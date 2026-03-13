"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { shopCategories } from "apps/seller-ui/src/utils/categories";
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';

type FormData = {
  name: string;
  bio: string;
  address: string;
  opening_hours: string;
  website?: string;
  category: string;
};

interface CreateShopProps {
  sellerId: string;
  setActiveStep: (step: number) => void;
}

const CreateShop: React.FC<CreateShopProps> = ({ sellerId, setActiveStep }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // Count words for bio validation
  const countWords = (text: string) => text.trim().split(/\s+/).length;

  // Mutation to create a shop
  const shopCreateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosInstance.post("/api/create-shop", {
        ...data,
        sellerId,
      });
      return response.data;
    },
    onSuccess: () => {
      setActiveStep(3); // Move to next step after successful creation
    },
  });

  const onSubmit = (data: FormData) => {
    shopCreateMutation.mutate(data);
  };

  // Render
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-2xl font-semibold text-center mb-4">
          Setup New Shop
        </h3>

        {/* Shop Name */}
        <label className="block text-gray-700 mb-1">Name *</label>
        <input
          type="text"
          placeholder="Shop name"
          className="w-full p-2 px-4 border border-gray-300 outline-0 rounded-lg mb-1 focus:border-gray-600"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}

        {/* Bio */}
        <label className="block text-gray-700 mb-1">
          Bio (Max 100 words) *
        </label>
        <input
          type="text"
          placeholder="Shop bio"
          className="w-full p-2 px-4 border border-gray-300 outline-0 rounded-lg mb-1 focus:border-gray-600"
          {...register("bio", {
            required: "Shop bio is required",
            validate: (value) =>
              countWords(value) <= 100 || "Bio can't exceed 100 words",
          })}
        />
        {errors.bio && (
          <p className="text-red-500 text-sm">{errors.bio.message}</p>
        )}

        {/* Address */}
        <label className="block text-gray-700 mb-1">Address *</label>
        <input
          type="text"
          placeholder="Shop location"
          className="w-full p-2 px-4 border border-gray-300 outline-0 rounded-lg mb-1 focus:border-gray-600"
          {...register("address", { required: "Shop address is required" })}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address.message}</p>
        )}

        {/* Opening Hours */}
        <label className="block text-gray-700 mb-1">Opening Hours *</label>
        <input
          type="text"
          placeholder="e.g., Mon-Fri 9AM - 6PM"
          className="w-full p-2 px-4 border border-gray-300 outline-0 rounded-lg mb-1 focus:border-gray-600"
          {...register("opening_hours", {
            required: "Opening hours are required",
          })}
        />
        {errors.opening_hours && (
          <p className="text-red-500 text-sm">{errors.opening_hours.message}</p>
        )}

        {/* Website */}
        <label className="block text-gray-700 mb-1">Website</label>
        <input
          type="url"
          placeholder="https://example.com"
          className="w-full p-2 px-4 border border-gray-300 outline-0 rounded-lg mb-1 focus:border-gray-600"
          {...register("website", {
            pattern: {
              value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/,
              message: "Enter a valid URL",
            },
          })}
        />
        {errors.website && (
          <p className="text-red-500 text-sm">{errors.website.message}</p>
        )}

        {/* Category */}
        <label className="block text-gray-700 mb-1">Category *</label>
        <select
          className="w-full p-2 px-4 border border-gray-300 outline-0 rounded-lg mb-1 focus:border-gray-600"
          {...register("category", { required: "Category is required" })}
        >
          <option value="">Select a category</option>
          {shopCategories.map((category) => (
            <option value={category.value} key={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={shopCreateMutation.isPending}
          className="w-full text-lg bg-blue-600 cursor-pointer text-white py-2 rounded-lg mt-4"
        >
          {shopCreateMutation.isPending ? "Creating Shop..." : "Create Shop"}
        </button>
      </form>
    </div>
  );
};

export default CreateShop;
