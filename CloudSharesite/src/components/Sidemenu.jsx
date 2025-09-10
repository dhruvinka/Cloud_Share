import { useUser } from "@clerk/clerk-react";
import { User, X } from "lucide-react";
import React from "react";
import { SIDE_MENU_DATA } from "../data";
import { Link, useLocation } from "react-router-dom";

export default function Sidemenu({ onClose, isMobile }) {
  const { user } = useUser();
  const location = useLocation();

  return (
    <div
      className={`
         border-gray-200/50 p-5 
        h-[calc(100vh-61px)] z-20
        ${isMobile 
          ? "fixed inset-0 w-64 shadow-xl lg:hidden" 
          : "hidden lg:block sticky top-[61px] w-64"} 
      `}
    >
      {/* Close button only for mobile */}
      {isMobile && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Profile section */}
      <div className="flex flex-col items-center justify-center gap-3 mt-12 mb-7">
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full border border-gray-300 shadow-sm"
          />
        ) : (
          <User className="w-20 h-20 text-gray-500" />
        )}
        <span className="text-lg font-semibold text-gray-700">
          {user?.fullName || "Guest User"}
        </span>
      </div>

      {/* Sidebar menu links */}
      <div className="flex flex-col gap-2 text-gray-700">
        {SIDE_MENU_DATA.map((item) => {
          const isActive = location.pathname === item.Path; // ✅ active route check

          return (
            <Link
              key={item.id}
              to={item.Path}
              className={`
                flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-200
                ${isActive 
                  ? "bg-blue-100 text-blue-600 font-medium" 
                  : "hover:bg-blue-50 hover:text-blue-600"}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
