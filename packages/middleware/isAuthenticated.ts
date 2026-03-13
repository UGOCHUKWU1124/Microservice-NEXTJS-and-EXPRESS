import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from 'packages/libs/prisma';

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies["access_token"] || req.cookies["seller_access_token"] || req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized: token missing" });

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: string; role: "user" | "seller" };
        let account;

        if (decoded.role === "user") {
            account = await prisma.user.findUnique({ where: { id: decoded.id } });
            if (!account) return res.status(401).json({ message: "User not found" });
            req.user = account;
        } else {
            account = await prisma.seller.findUnique({ where: { id: decoded.id }, include: { shop: true } });
            if (!account) return res.status(401).json({ message: "Seller not found" });
            req.seller = account;
        }

        req.role = decoded.role;
        return next();
    } catch (err: any) {
        if (err.name === "TokenExpiredError") return res.status(401).json({ message: "Access token expired" });
        return res.status(401).json({ message: "Unauthorized: token invalid" });
    }
};

export default isAuthenticated;
