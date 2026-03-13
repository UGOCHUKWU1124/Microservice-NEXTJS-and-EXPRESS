import crypto from "crypto";
import { sendEmail } from "./sendMail/sendEmail";
import bcrypt from "bcryptjs";
import { ValidationError } from 'packages/error-handler';
import redis from 'packages/libs/redis';
import prisma from 'packages/libs/prisma';

const OTP_TTL = 300; // 5 minutes
const OTP_COOLDOWN = 60; // 1 minute
const OTP_SPAM_LOCK_EX = 3600; // 1 hour
const OTP_LOCK_EX = 1800; // 30 minutes

export const checkOtpRestrictions = async (email: string): Promise<void> => {
  if (await redis.get(`otp_lock:${email}`)) {
    throw new ValidationError("Account locked due to multiple failed attempts! Try again after 30 minutes");
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    throw new ValidationError("Too many OTP requests! Please wait 1 hour before requesting again");
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    throw new ValidationError("Please wait 1 minute before requesting a new OTP");
  }
};

export const trackOtpRequests = async (email: string): Promise<void> => {
  const key = `otp_request_count:${email}`;
  const current = parseInt((await redis.get(key)) || "0", 10);
  if (current >= 5) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", OTP_SPAM_LOCK_EX);
    throw new ValidationError("Too many OTP requests! Please wait 1 hour before requesting again");
  }
  await redis.set(key, (current + 1).toString(), "EX", OTP_SPAM_LOCK_EX);
};

export const sendOtp = async (name: string, email: string, subject: string, template: string): Promise<void> => {
  const otp = crypto.randomInt(1000, 9999).toString().padStart(4, "0");
  await sendEmail(email, subject, template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", OTP_TTL);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", OTP_COOLDOWN);
};

export const verifyOtp = async (email: string, otp: string): Promise<void> => {
  if (await redis.get(`otp_lock:${email}`)) {
    throw new ValidationError("Account locked due to multiple failed attempts! Try again after 30 minutes");
  }

  const stored = await redis.get(`otp:${email}`);
  if (!stored) {
    throw new ValidationError("Expired OTP! Please request a new one");
  }

  if (stored !== otp) {
    const failedKey = `otp_failed_attempts:${email}`;
    const failed = await redis.incr(failedKey);
    if (failed === 1) {
      await redis.expire(failedKey, OTP_LOCK_EX);
    }
    if (failed >= 5) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", OTP_LOCK_EX);
      await redis.del(`otp:${email}`, failedKey);
      throw new ValidationError("Account locked due to multiple failed attempts! Try again after 30 minutes");
    }
    throw new ValidationError(`Incorrect OTP! You have ${5 - failed} attempts left.`);
  }

  await redis.del(`otp:${email}`, `otp_failed_attempts:${email}`);
};

export const updateUserPassword = async (email: string, newPassword: string): Promise<void> => {
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { email }, data: { password: hashed } });
};

export const updateSellerPassword = async (email: string, newPassword: string): Promise<void> => {
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.seller.update({ where: { email }, data: { password: hashed } });
};