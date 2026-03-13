"use client";

import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PremiumGoogleButton from "apps/user-ui/src/shared/components/google-button/google.button";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // Login mutation using axios instance
  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // `axiosInstance` handles cookies, access token, and refresh token automatically
      const response = await axiosInstance.post("/api/login-user", data, {
        withCredentials: true, // ensures cookies are stored
      });
      return response.data;
    },
    onSuccess: () => {
      setServerError(null);
      toast.success("Logged in successfully!");
      router.push("/"); // redirect to home/dashboard after login
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials. Try again!";
      setServerError(errorMessage);
    },
  });

  // Form submit handler
  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-2 ">
            Welcome Back
          </h3>
          <p className="text-center text-gray-500 mb-4 ">
            New to Eshop?{" "}
            <Link
              href={"/auth/signup"}
              className="text-blue-500 hover:underline"
            >
              Create an account
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

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email input */}
            <label className="block text-gray-700 mb-1 ">Email</label>
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
              <p className="text-red-500 text-sm">
                {String(errors.email.message)}
              </p>
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
                  {String(errors.password.message)}
                </p>
              )}
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex justify-between items-center my-4">
              <label className="flex items-center text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
              <Link
                className="text-blue-500 text-sm hover:underline"
                href={"/auth/forgot-password"}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full text-lg cursor-pointer bg-gray-800 text-white py-2 rounded-lg"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </button>

            {/* Server error */}
            {serverError && (
              <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
