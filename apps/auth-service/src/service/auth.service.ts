import bcrypt from "bcryptjs";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import Stripe from "stripe";
import {
    checkOtpRestrictions,
    trackOtpRequests,
    sendOtp,
    verifyOtp,
    updateUserPassword,
    updateSellerPassword,
} from "../utils/auth.helper.js";
import { setCookie } from '../utils/cookies/setCookies.js';
import prisma from 'packages/libs/prisma';
import { AuthError, ValidationError } from 'packages/error-handler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-11-17.clover',
});

const ACCESS_EXPIRES_MS = 15 * 60 * 1000; // 1 min
const REFRESH_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface IUserPayload { name: string; email: string; password?: string; otp: string }
interface ISellerPayload extends IUserPayload { phone_number: string; country: string }
interface ILoginPayload { email: string; password: string }
interface IForgotPasswordPayload { email: string; userType: "user" | "seller" }
interface ICreateShopPayload { name: string; bio: string; address: string; opening_hours: string; website: string; category: string; sellerId: string }
interface IStripeLinkPayload { sellerId: string }

class AuthService {

    // USER 

    public async userRegistration({ name, email }: IUserPayload) {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) throw new ValidationError("User already exists with this email!");

        await checkOtpRestrictions(email);
        await trackOtpRequests(email);
        await sendOtp(name, email, "Verify Your Email", "user-activation-mail");

        return { message: "OTP sent to your email! Please verify your account" };
    }

    public async verifyUser({ name, email, otp, password }: IUserPayload) {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) throw new ValidationError("User already exists with this email!");

        await verifyOtp(email, otp);

        const hashedPassword = await bcrypt.hash(password!, 10);
        const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });

        const safeUser = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
        return { user: safeUser, message: "Account verified and created successfully" };
    }

    public async loginUser({ email, password }: ILoginPayload, res: any) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new AuthError("No user found with this email!");

        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) throw new AuthError("Incorrect password!");

        res.clearCookie("seller_access_token");
        res.clearCookie("seller_refresh_token");

        const accessToken = jwt.sign({ id: user.id, role: "user" }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user.id, role: "user" }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });

        setCookie(res, "access_token", accessToken, ACCESS_EXPIRES_MS);
        setCookie(res, "refresh_token", refreshToken, REFRESH_EXPIRES_MS);

        return { user, message: "Login successful" };
    }

    //  SELLER 

    public async registerSeller({ name, email }: ISellerPayload) {
        const existing = await prisma.seller.findUnique({ where: { email } });
        if (existing) throw new ValidationError("Seller already exists with this email!");

        await checkOtpRestrictions(email);
        await trackOtpRequests(email);
        await sendOtp(name, email, "Verify Your Email", "seller-activation-mail");

        return { message: "OTP sent to your email! Please verify your account" };
    }

    public async verifySeller({ name, email, otp, password, phone_number, country }: ISellerPayload) {
        const existing = await prisma.seller.findUnique({ where: { email } });
        if (existing) throw new ValidationError("Seller already exists with this email!");

        await verifyOtp(email, otp);

        const hashedPassword = await bcrypt.hash(password!, 10);
        const seller = await prisma.seller.create({ data: { name, email, password: hashedPassword, phone_number, country } });

        const safeSeller = { seller };
        return { data: safeSeller, message: "Seller account verified and created successfully" };
    }

    public async loginSeller({ email, password }: ILoginPayload, res: any) {
        const seller = await prisma.seller.findUnique({ where: { email } });
        if (!seller) throw new AuthError("No seller found with this email!");

        const isMatch = await bcrypt.compare(password, seller.password!);
        if (!isMatch) throw new AuthError("Incorrect password!");

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        const accessToken = jwt.sign({ id: seller.id, role: "seller" }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: seller.id, role: "seller" }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });

        setCookie(res, "seller_access_token", accessToken, ACCESS_EXPIRES_MS);
        setCookie(res, "seller_refresh_token", refreshToken, REFRESH_EXPIRES_MS);

        return { seller, message: "Login successful" };
    }

    // PASSWORD & OTP 

    public async handleForgotPassword({ email, userType }: IForgotPasswordPayload) {
        // safeguard in case userType is missing
        if (!userType || (userType !== "user" && userType !== "seller")) {
            throw new ValidationError("Invalid userType"); // avoids 'undefined not found'
        }

        const account = userType === "user"
            ? await prisma.user.findUnique({ where: { email } })
            : await prisma.seller.findUnique({ where: { email } });

        if (!account) throw new ValidationError(`${userType} not found`);

        await checkOtpRestrictions(email);
        await trackOtpRequests(email);
        await sendOtp(
            account.name,
            email,
            "Password Reset Request",
            userType === "user"
                ? "forgot-password-user-email"
                : "forgot-password-seller-email"
        );

        return { message: "OTP sent to your email! Please verify to reset your password" };
    }


    public async verifyUserForgotPassword({ email, otp }: { email: string; otp: string }) {
        await verifyOtp(email, otp);
        return { message: "OTP verified! You can now reset your password" };
    }

    public async verifySellerForgotPassword({ email, otp }: { email: string; otp: string }) {
        await verifyOtp(email, otp);
        return { message: "OTP verified! You can now reset your password" };
    }


    public async resetUserPassword({ email, newPassword }: { email: string; newPassword: string }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new ValidationError("No user found with this email!");

        if (await bcrypt.compare(newPassword, user.password!))
            throw new ValidationError("New password must be different from the old password");

        await updateUserPassword(email, newPassword);
        return { message: "Password reset successful" };
    }

    public async resetSellerPassword({ email, newPassword }: { email: string; newPassword: string }) {
        const seller = await prisma.seller.findUnique({ where: { email } });
        if (!seller) throw new ValidationError("No seller found with this email!");

        if (await bcrypt.compare(newPassword, seller.password!))
            throw new ValidationError("New password must be different from the old password");

        await updateSellerPassword(email, newPassword);
        return { message: "Password reset successful" };
    }

    //SHOP & STRIPE

    public async createShop({ name, bio, address, opening_hours, website, category, sellerId }: ICreateShopPayload) {
        if (!sellerId?.trim()) throw new ValidationError("Valid sellerId is required to create shop");

        const shop = await prisma.shop.create({
            data: { name, bio, address, opening_hours, website: website?.trim() ? website : null, category, seller: { connect: { id: sellerId } } }
        });
        return { data: shop, message: "Seller shop created successfully" };
    }

    public async createStripeConnectLink({ sellerId }: IStripeLinkPayload) {
        const seller = await prisma.seller.findUnique({ where: { id: sellerId } });
        if (!seller) throw new ValidationError("Seller not found");

        const account = await stripe.accounts.create({
            type: "express",
            email: seller.email,
            country: "GB",
            capabilities: { card_payments: { requested: true }, transfers: { requested: true } }
        });

        await prisma.seller.update({ where: { id: sellerId }, data: { stripeId: account.id } });

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: process.env.STRIPE_REFRESH_URL!,
            return_url: process.env.STRIPE_RETURN_URL!,
            type: "account_onboarding"
        });

        return accountLink;
    }

    //REFRESH TOKEN
    public async refreshToken(token: string | undefined, res: any) {
        if (!token) throw new AuthError("Refresh token not found");

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { id: string; role: "user" | "seller" };
        if (!decoded?.id || !decoded?.role) throw new JsonWebTokenError("Invalid refresh token");

        const account = decoded.role === "user"
            ? await prisma.user.findUnique({ where: { id: decoded.id } })
            : await prisma.seller.findUnique({ where: { id: decoded.id }, include: { shop: true } });

        if (!account) throw new AuthError("Forbidden! Account not found");

        const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
        setCookie(res, decoded.role === "user" ? "access_token" : "seller_access_token", newAccessToken, ACCESS_EXPIRES_MS);

        return { data: account, accessToken: newAccessToken, role: decoded.role };
    }
}

export default new AuthService();