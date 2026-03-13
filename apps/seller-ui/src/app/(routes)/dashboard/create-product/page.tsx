"use client";
import ImagePlaceHolder from 'apps/seller-ui/src/shared/modules/auth/components/image-placeholder';
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import CololorSelector from 'packages/components/color-selector';
import CustomSpecifications from 'packages/components/custom-specifications';
import Input from 'packages/components/input';
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [openImageModal, setOpenImageModal] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [isLoading, setIsLoading] = useState(false);
  

  const onsubmit = (data: any) => {
    console.log(data);
  };

  //image change handler i.e when image is changed from the image placeholder component
  const handleImageChange = (file: File | null, index: number) => {
    const updatedImages = [...images];
    updatedImages[index] = file;
    if (index === images.length - 1 && images.length < 8) {
      updatedImages.push(null);
    } //if last image is changed and there is less than 8 images then add null to the end of the array
    setImages(updatedImages);
    setValue("images", updatedImages); //set value of images to the updatedImages array i.e set value of images to the updatedImages array
  };
  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      let updatedImages = [...prevImages];
      if (index === -1) {
        updatedImages[0] = null;
      } else {
        updatedImages.splice(index, 1);
      }

      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }
      return updatedImages;
    });
    setValue("images", images);
  };

  return (
    <form
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white"
      onSubmit={handleSubmit(onsubmit)}
    >
      {/* heading */}
      <h2 className="text-2xl py-2 font-semibold font-Poppins text-white">
        Create Product
      </h2>
      <div className="flex items-center">
        <Link href={"/dashboard"}>
          <span className="text-[#80Deea] cursor-pointer">Dashboard</span>
        </Link>
        <ChevronRight size={20} className="opacity-[.8]" />
        <span className="">Create Product</span>
      </div>

      {/* content layout */}
      <div className="py-4 w-full flex gap-6">
        {/* left side - image upload section  */}
        <div className="md:w-[35%]">
          {/* image upload  PARENT PROPS*/}
          {images?.length > 0 && (
            <ImagePlaceHolder
              setOpenImageModal={setOpenImageModal}
              size="765 x 850" //h and w
              small={false}
              index={0}
              onImageChange={handleImageChange}
              onRemove={handleRemoveImage}
            />
          )}

          <div className="grid grid-cols-2 gap-3 mt-4 ">
            {images.slice(1).map((_, index) => (
              <ImagePlaceHolder
                setOpenImageModal={setOpenImageModal}
                size="765 x 850" //h and w
                key={index}
                small={true}
                index={index + 1}
                onImageChange={handleImageChange}
                onRemove={handleRemoveImage}
              />
            ))}
          </div>
        </div>

        {/* right side - form inputs  */}
        <div className="md:w-[65%] ">
          <div className="w-full flex gap-6 ">
            {/* Product title input  */}
            <div className="w-2/4">
              <Input
                label="Product Title *"
                placeholder="Enter product title"
                {...register("title", {
                  required: "Product title is required",
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message as string}
                </p>
              )}

              <div className="mt-2">
                <Input
                  type="textarea"
                  rows={8}
                  cols={10}
                  label="Short product Description * (Max 150 words)"
                  placeholder="Enter product description"
                  {...register("description", {
                    required: "Product description is required",
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        "Description should not exceed 150 words."
                      );
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Tags *"
                  placeholder="apple, flagship"
                  {...register("tags", {
                    required: "Seprate related product tags with comma (,)",
                  })}
                />
                {errors.tags && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tags.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Warranty *"
                  placeholder="1 year / No warranty"
                  {...register("warranty", {
                    required: "Product warranty is required",
                  })}
                />
                {errors.warranty && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.warranty.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Slug *"
                  placeholder="product_slug"
                  {...register("slug", {
                    required: "Slug is required",
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message:
                        "Slug should contain only lowercase letters, numbers, and hyphens",
                    },
                    minLength: {
                      value: 3,
                      message: "Slug must be at least 3 characters long",
                    },
                    maxLength: {
                      value: 50,
                      message: "Slug cannot be more than 50 characters",
                    },
                  })}
                />
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.slug.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  label="Brand *"
                  placeholder="Apple"
                  {...register("brand")}
                />
                {errors.brand && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.brand.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <CololorSelector control={control} errors={errors} />
              </div>

              <div className="mt-2">
                <CustomSpecifications control={control} errors={errors} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
