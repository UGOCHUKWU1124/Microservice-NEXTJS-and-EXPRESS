import { Request, Response } from "express";
import authService from "../service/auth.service";
import { asyncHandler } from 'packages/middleware/asyncHandler';

// USER ENDPOINTS
export const userRegistration = asyncHandler(async (req: Request, res: Response) => {
  await authService.userRegistration(req.body);
  return res.status(201).json({
    success: true,
    message: "OTP sent to your email! Please verify your account.",
    data: null
  });
});

export const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.verifyUser(req.body);
  return res.status(201).json({
    success: true,
    message: result.message,
    data: result.user
  });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body, res);
  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: result.user
  });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  return res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    data: user
  });
});

export const handleForgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.handleForgotPassword(req.body);
  return res.status(200).json({
    success: true,
    message: result.message,
    data: null
  });
});

export const verifyUserForgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.verifyUserForgotPassword(req.body);
  return res.status(200).json({
    success: true,
    message: result.message,
    data: null
  });
});

export const resetUserPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.resetUserPassword(req.body);
  return res.status(200).json({
    success: true,
    message: result.message,
    data: null
  });
});

// SELLER ENDPOINTS
export const sellerRegistration = asyncHandler(async (req: Request, res: Response) => {
  await authService.registerSeller(req.body);
  return res.status(201).json({
    success: true,
    message: "OTP sent to your email! Please verify your account.",
    data: null
  });
});

export const verifySeller = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.verifySeller(req.body);
  return res.status(201).json({
    success: true,
    message: result.message,
    data: result.data
  });
});

export const loginSeller = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.loginSeller(req.body, res);
  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: result.seller
  });
});

export const getSeller = asyncHandler(async (req: Request, res: Response) => {
  const seller = (req as any).seller;
  return res.status(200).json({
    success: true,
    message: "Seller retrieved successfully",
    data: seller
  });
});

export const verifySellerForgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.verifySellerForgotPassword(req.body);
  return res.status(200).json({
    success: true,
    message: result.message,
    data: null
  });
});

export const resetSellerPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.resetSellerPassword(req.body);
  return res.status(200).json({
    success: true,
    message: result.message,
    data: null
  });
});

// SHOP & STRIPE ENDPOINTS
export const shopCreation = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.createShop(req.body);
  return res.status(201).json({
    success: true,
    message: result.message,
    data: result.data
  });
});

export const createStripeConnectionLink = asyncHandler(async (req: Request, res: Response) => {
  const { sellerId } = req.body;
  const accountLink = await authService.createStripeConnectLink({ sellerId });
  return res.status(200).json({
    success: true,
    message: "Stripe connection link created successfully",
    data: { url: accountLink.url }
  });
});

// TOKEN REFRESH ENDPOINT
export const refreshToken = asyncHandler(async (req: any, res: Response) => {
  const token = req.cookies["refresh_token"] || req.cookies["seller_refresh_token"];
  const result = await authService.refreshToken(token, res);
  return res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      account: result.data,
      accessToken: result.accessToken,
      role: result.role
    }
  });
});