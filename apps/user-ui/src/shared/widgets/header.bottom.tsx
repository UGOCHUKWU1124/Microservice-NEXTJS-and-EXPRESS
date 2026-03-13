"use client";
import ProfileIcon from "../../assets/svgs/profile-icon";
import { navItems } from "./../../configs/constants"
import { AlignLeft, ChevronDown, HeartIcon, ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useUser from '../../hooks/useUser';

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

const { user,isLoading } = useUser();
  // useEffect(() => {
  //   if (user) {
  //     console.log(user);
  //   }
  // }, [user]);
  //track scroll position after 100vh only this part would be visible
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={`w-full transition-all duration-300 ${
        isSticky ? "fixed top-0 left-0 z-[100] bg-white shadow-lg" : "relative"
      }`}
    >
      <div
        className={`w-[80%] relative m-auto flex items-center justify-between ${
          isSticky ? "pt-3" : "py-0"
        }`}
      >
        {/* all dropdowns */}
        <div
          className={`w-[260px] ${
            isSticky && "-mb-2"
          } cursor-pointer flex items-center justify-between px-5 h-[50px] bg-gray-800`}
          onClick={() => setShow(!show)}
        >
          <div className="flex items-center gap-2">
            <AlignLeft color="white" />
            <span className="text-white font-medium">All Departments</span>
          </div>
          <ChevronDown color="white" />
        </div>

        {/* drop down menu  */}
        {show && (
          <div
            className={` absolute left-0 ${
              isSticky ? "top-[70px]" : "top-[50px]"
            } w-[260px] h-[400px] bg-gray-800`}
          ></div>
        )}

        {/* navigation links */}
        <div className="flex items-center">
          {navItems.map((i: NavItemsTypes, index: number) => (
            <Link
              href={i.href}
              key={index}
              className="px-5 font-medium text-lg"
            >
              {i.title}
            </Link>
          ))}
        </div>

        <div className="">
          {isSticky && (
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
                      <span className="font-semibold text-sm">
                        {user?.name.split(" ")[0]}
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="border-2 w-[45px] h-[45px] flex items-center justify-center rounded-full border-gray-200"
                    >
                      <ProfileIcon />
                    </Link>
                    <Link href="/login">
                      <span className="block text-sm font-medium">Hello,</span>
                      <span className="font-semibold text-sm">
                        {isLoading ? "..." : "Sign In"}
                      </span>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
