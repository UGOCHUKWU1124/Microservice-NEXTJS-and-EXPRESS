"use client";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axiosInstance from "apps/seller-ui/src/utils/axiosInstance";

type FormData = {
  email: string;
  password: string;
};

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // Timer for OTP resend
  const startResetTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1: Request OTP
  const requestOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await axiosInstance.post("/api/forgot-password-seller", {
        email,
        userType: "seller",
      });
      return response.data;
    },
    onSuccess: (_, { email }) => {
      setUserEmail(email);
      setStep("otp");
      setServerError(null);
      setCanResend(false);
      startResetTimer();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to send OTP";
      setServerError(errorMessage);
    },
  });

  // Step 2: Verify OTP
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) return;
      const response = await axiosInstance.post(
        "/api/verify-forgot-password-seller",
        {
          email: userEmail,
          otp: otp.join(""),
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep("reset");
      setServerError(null);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Invalid OTP. Try again!";
      setServerError(errorMessage);
    },
  });

  // Step 3: Reset Password
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!password) return;
      const response = await axiosInstance.post("/api/reset-password-seller", {
        email: userEmail,
        newPassword: password,
      });
      return response.data;
    },
    onSuccess: () => {
      setStep("email");
      toast.success(
        "Password reset successfully! Please login with your new password"
      );
      setServerError(null);
      router.push("/auth/login"); // redirect to login page
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to reset password. Try again!";
      setServerError(errorMessage);
    },
  });

  // OTP Input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Form submit handlers
  const onSubmitEmail = ({ email }: { email: string }) =>
    requestOtpMutation.mutate({ email });
  const onSubmitPassword = ({ password }: { password: string }) =>
    resetPasswordMutation.mutate({ password });

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          {/* Step 1: Email */}
          {step === "email" && (
            <>
              <h3 className="text-3xl font-semibold text-center mb-2 ">
                Forgot Password?
              </h3>
              <p className="text-center text-gray-500 mb-4 ">
                Go back to?{" "}
                <Link
                  href={"/auth/login"}
                  className="text-blue-500 hover:underline"
                >
                  Login
                </Link>
              </p>
              <form onSubmit={handleSubmit(onSubmitEmail)}>
                <label className="block text-gray-700 mb-1 ">Email</label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="w-full p-2 px-4 border border-gray-300 outline-0 rounded-lg mb-1 focus:border-gray-600"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {String(errors.email.message)}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={requestOtpMutation.isPending}
                  className="w-full text-lg cursor-pointer bg-gray-800 text-white py-2 rounded-lg mt-5"
                >
                  {requestOtpMutation.isPending ? "Sending OTP" : "Submit"}
                </button>
                {serverError && (
                  <p className="text-red-500 text-sm">{serverError}</p>
                )}
              </form>
            </>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <>
              <h3 className="text-xl font-semibold text-center mb-2">
                Enter OTP
              </h3>
              <div className="flex justify-center gap-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    maxLength={1}
                    className="w-12 h-12 text-center border border-gray-300 outline-none !rounded"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>
              <button
                disabled={verifyOtpMutation.isPending}
                onClick={() => verifyOtpMutation.mutate()}
                className="w-full mt-4 text-lg cursor-pointer bg-gray-800 text-white py-2 rounded-lg "
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </button>
              <p className="text-center text-sm mt-4">
                {canResend ? (
                  <button
                    onClick={() => {
                      requestOtpMutation.mutate({ email: userEmail! });
                      setCanResend(false);
                      setTimer(60);
                      startResetTimer();
                    }}
                    className="text-blue-500 cursor-pointer hover:underline"
                    disabled={requestOtpMutation.isPending}
                  >
                    {requestOtpMutation.isPending ? "Sending..." : "Resend OTP"}
                  </button>
                ) : (
                  `Resend OTP in ${timer}s`
                )}
              </p>
              {serverError && (
                <p className="text-red-500 text-sm">{serverError}</p>
              )}
            </>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <>
              <h3 className="text-xl font-semibold text-center mb-2">
                Reset Password
              </h3>
              <form onSubmit={handleSubmit(onSubmitPassword)}>
                <label className="block text-gray-700 mb-1 ">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Enter your Password"
                    className="w-full p-2 px-4 border border-gray-300 outline-0 rounded-lg mb-1 focus:border-gray-600"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                  >
                    {passwordVisible ? <Eye /> : <EyeOff />}
                  </button>
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {String(errors.password.message)}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full text-lg cursor-pointer bg-gray-800 text-white py-2 rounded-lg mt-5"
                >
                  {resetPasswordMutation.isPending
                    ? "Resetting Password"
                    : "Reset Password"}
                </button>
                {serverError && (
                  <p className="text-red-500 text-sm">{serverError}</p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
