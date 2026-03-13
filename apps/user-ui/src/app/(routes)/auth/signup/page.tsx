"use client";

import { useMutation } from "@tanstack/react-query";
import PremiumGoogleButton from "../../../../shared/components/google-button/google.button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // Start countdown timer for OTP resend
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

  // User registration mutation
  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosInstance.post(
        "/api/user-registration",
        data,
        {
          withCredentials: true, // ensures cookies (refresh token) are saved
        }
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setUserData(formData); // store user data to verify OTP
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResetTimer();
    },
    onError: (error: any) => {
      console.error(error);
    },
  });

  // OTP verification mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;
      const response = await axiosInstance.post("/api/verify-user", {
        ...userData,
        otp: otp.join(""),
      });
      return response.data;
    },
    onSuccess: () => {
      router.push("/auth/login"); // redirect to login after successful verification
    },
  });

  // Form submit handler for registration
  const onSubmit = (data: FormData) => {
    signupMutation.mutate(data);
  };

  // OTP input handling
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

  // Resend OTP
  const resendOTP = () => {
    if (!userData) return;
    signupMutation.mutate(userData);
    setCanResend(false);
    setTimer(60);
    startResetTimer();
  };

  return (
    <div className="w-full py-10 bg-[#f1f1f1] min-h-[85vh] overflow-y-auto">
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Welcome to Eshop!
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Have an account?{" "}
            <Link
              href={"/auth/login"}
              className="text-blue-500 hover:underline"
            >
              Login
            </Link>
          </p>

          {/* Google login button */}
          <PremiumGoogleButton />

          {/* Divider */}
          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3"> OR </span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Registration form or OTP form */}
          {!showOtp ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Name input */}
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter your Name"
                className="w-full p-2 px-4 border border-gray-300 outline-0 rounded-lg mb-1 focus:border-gray-600"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}

              {/* Email input */}
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your Email"
                className="w-full p-2 px-4 border border-gray-300 outline-0 rounded-lg mb-1 focus:border-gray-600"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}

              {/* Password input */}
              <label className="block text-gray-700 mb-1">Password</label>
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
                  className="absolute inset-y-o right-3 flex items-center text-gray-400 -mt-9"
                >
                  {passwordVisible ? <Eye /> : <EyeOff />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full text-lg cursor-pointer bg-black text-white py-2 rounded-lg"
              >
                {signupMutation.isPending ? "Signing Up..." : "Sign Up"}
              </button>

              {/* Server errors */}
              {signupMutation.isError &&
                signupMutation.error instanceof AxiosError && (
                  <p className="text-red-500 text-sm mt-2">
                    {signupMutation.error.response?.data?.message ||
                      signupMutation.error.message}
                  </p>
                )}
            </form>
          ) : (
            // OTP form
            <div>
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
                className="w-full mt-4 text-lg cursor-pointer bg-gray-800 text-white py-2 rounded-lg"
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </button>

              <p className="text-center text-sm mt-4">
                {canResend ? (
                  <button
                    onClick={resendOTP}
                    className="text-blue-500 cursor-pointer hover:underline"
                  >
                    {signupMutation.isPending ? "Resending..." : "Resend OTP"}
                  </button>
                ) : (
                  `Resend OTP in ${timer}s`
                )}
              </p>

              {verifyOtpMutation.isError &&
                verifyOtpMutation.error instanceof AxiosError && (
                  <p className="text-red-500 text-sm mt-2">
                    {verifyOtpMutation.error.response?.data?.message ||
                      verifyOtpMutation.error.message}
                  </p>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
