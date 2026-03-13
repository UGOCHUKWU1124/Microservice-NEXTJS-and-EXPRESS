import React from "react";

const PremiumGoogleButton = () => (
  <button
    type="button"
    className="w-full flex items-center justify-center gap-3 py-2 px-4 rounded-lg shadow-lg bg-gradient-to-r from-white via-gray-100 to-gray-200 border border-gray-300 hover:from-gray-50 hover:to-gray-300 transition-all duration-200"
    style={{ boxShadow: "0 4px 14px 0 rgba(60,64,67,0.15)" }}
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M21.6 12.227c0-.638-.057-1.252-.163-1.84H12v3.481h5.37a4.594 4.594 0 01-1.99 3.014v2.497h3.22c1.887-1.74 2.97-4.304 2.97-7.152z"
          fill="#4285F4"
        />
        <path
          d="M12 22c2.43 0 4.47-.805 5.96-2.188l-3.22-2.497c-.894.6-2.037.955-3.29.955-2.53 0-4.678-1.71-5.44-4.01H2.66v2.522A9.997 9.997 0 0012 22z"
          fill="#34A853"
        />
        <path
          d="M6.56 14.27A5.996 5.996 0 016.13 12c0-.788.14-1.552.39-2.27V7.208H2.66A9.996 9.996 0 002 12c0 1.64.393 3.193 1.09 4.522l3.47-2.252z"
          fill="#FBBC05"
        />
        <path
          d="M12 6.58c1.322 0 2.505.454 3.438 1.345l2.573-2.573C16.47 3.805 14.43 3 12 3A9.997 9.997 0 002.66 7.208l3.47 2.522C7.322 8.29 9.47 6.58 12 6.58z"
          fill="#EA4335"
        />
      </g>
    </svg>
    <span className="font-semibold text-gray-800 text-base">
      Continue with Google
    </span>
  </button>
);

export default PremiumGoogleButton;
