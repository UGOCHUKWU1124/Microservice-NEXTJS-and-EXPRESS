"use client";
import Link from "next/link";
import React from "react";
import { HeartIcon, Search, ShoppingCart } from "lucide-react";
import ProfileIcon from "../../assets/svgs/profile-icon";
import HeaderBottom from "./header.bottom";
import useUser from '../../hooks/useUser';

const Header = () => {
    const { user, isLoading } = useUser();
  return (
    <header className="w-full bg-white overflow-hidden">
      <div className="max-w-[1200px] w-[90%] py-5 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-3xl font-[500]">
          Eshop
        </Link>

        {/* Search bar */}
        <div className="w-[45%] relative">
          <input
            placeholder="Search for products"
            type="text"
            className="w-full px-4 font-medium border-2 border-gray-300 hover:border-gray-400 focus:border-gray-600 transition-colors outline-none h-[50px] rounded-[25px]"
          />
          <button
            type="button"
            className="absolute top-0 right-0 w-[55px] h-[50px] bg-gray-800 hover:bg-gray-900 flex items-center justify-center rounded-[25px]"
          >
            <Search color="#fff" />
          </button>
        </div>

        {/* Profile & Icons */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {!isLoading && user ? (
              <>
                <Link
                  href="/profile"
                  className="border-2 w-[45px] h-[45px] flex items-center justify-center rounded-full border-gray-200"
                >
                  <ProfileIcon />
                </Link>
                <Link href="/profile">
                  <span className="block text-sm font-medium">Hello,</span>
                  <span className="font-semibold text-sm">{user?.name.split(" ")[0]}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="border-2 w-[45px] h-[45px] flex items-center justify-center rounded-full border-gray-200"
                >
                  <ProfileIcon />
                </Link>
                <Link href="/auth/login">
                  <span className="block text-sm font-medium">Hello,</span>
                  <span className="font-semibold text-sm">{isLoading? "..." : "Sign In"}</span>
                </Link>
              </>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <Link href="/wishlist" className="relative">
              <HeartIcon />
              <div className="w-5 h-5 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-8px] right-[-8px]">
                <span className="text-white text-xs">0</span>
              </div>
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingCart />
              <div className="w-5 h-5 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-8px] right-[-8px]">
                <span className="text-white text-xs">0</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200" />

      {/* Bottom Nav */}
      <HeaderBottom />
    </header>
  );
};

export default Header;
