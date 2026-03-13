import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const verifySchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(4).required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(100).required()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    userType: Joi.string()
        .valid("user", "seller")
        .required()
});


export const verifyForgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(4).required()
});

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    newPassword: Joi.string().min(6).required()
});

export const registerSellerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
});

export const verifySellerSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(4).required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(100).required(),
    phone_number: Joi.string().min(7).max(20).required(),
    country: Joi.string().min(2).max(100).required(),
});


export const createShopSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    bio: Joi.string().min(10).max(500).required(),
    address: Joi.string().min(5).max(200).required(),
    opening_hours: Joi.string().min(5).max(100).required(),
    website: Joi.string().uri().allow('').optional(),
    category: Joi.string().min(2).max(50).required(),
    sellerId: Joi.string().min(24).max(24).required(), // MongoDB ObjectId is 24 chars
});
