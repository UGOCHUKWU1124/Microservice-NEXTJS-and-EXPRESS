import { Router } from "express";
import * as controller from "../controller/auth.controller";
import { registerSchema, verifySchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyForgotPasswordSchema, registerSellerSchema, verifySellerSchema, createShopSchema } from "../utils/validators/auth.schema";
import isAuthenticated from 'packages/middleware/isAuthenticated';
import { validate } from 'packages/middleware/validate';
import { isSeller, isUser } from 'packages/middleware/authorizeRoles';

const router = Router();
//users
router.get("/logged-in-user", isAuthenticated, isUser, controller.getUser);
router.post("/user-registration", validate(registerSchema), controller.userRegistration);
router.post("/verify-user", validate(verifySchema), controller.verifyUser);
router.post("/login-user", validate(loginSchema), controller.loginUser);
router.post("/forgot-password-user", validate(forgotPasswordSchema), controller.handleForgotPassword);
router.post("/verify-forgot-password-user", validate(verifyForgotPasswordSchema), controller.verifyUserForgotPassword);
router.post("/reset-password-user", validate(resetPasswordSchema), controller.resetUserPassword);

//refresh token 
router.post("/refresh-token", controller.refreshToken);

//sellers

router.post("/seller-registration", validate(registerSellerSchema), controller.sellerRegistration);
router.post("/verify-seller", validate(verifySellerSchema), controller.verifySeller);
router.post("/create-shop", validate(createShopSchema), controller.shopCreation);
router.post("/login-seller", validate(loginSchema), controller.loginSeller);
router.get("/logged-in-seller", isAuthenticated, isSeller, controller.getSeller);
router.post("/forgot-password-seller", validate(forgotPasswordSchema), controller.handleForgotPassword);
router.post("/verify-forgot-password-seller", validate(verifyForgotPasswordSchema), controller.verifySellerForgotPassword);
router.post("/reset-password-seller", validate(resetPasswordSchema), controller.resetSellerPassword);

//paystack

//stripe 
router.post("/create-stripe-link", controller.createStripeConnectionLink);

export default router;