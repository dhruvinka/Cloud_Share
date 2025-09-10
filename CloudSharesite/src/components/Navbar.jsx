import { SignedIn, UserButton } from "@clerk/clerk-react";
import { MenuIcon, Share2, Wallet, X } from "lucide-react";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidemenu from "./Sidemenu";
import CreaditDisplay from "./CreaditDisplay";
import { useUserCreditsContext } from "../context/UserCreditsContext";

export default function Navbar({ activeMenu }) {
 
  const [openSideMenu, setOpenSideMenu] = React.useState(false);
  const {credits,fetchUserCredits}=useUserCreditsContext();

   useEffect(()=>{
      fetchUserCredits();
  },[fetchUserCredits]);

  

  return (
    <div className="flex justify-between items-center gap-5 bg-white border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-4 sm:px-7 sticky top-0 z-30">
      {/* Left side - menu button and title */}
      <div className="flex items-center gap-5">
        {/* Hamburger only on mobile */}
        <button
          className="lg:hidden text-black hover:bg-gray-100 p-1 rounded transition-colors"
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <X className="text-2xl" />
          ) : (
            <MenuIcon className="text-2xl" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <Share2 className="text-blue-600" />
          <span className="text-lg font-medium text-black truncate">
            Cloud Share
          </span>
        </div>
      </div>

      {/* Right side credits and user button */}
      <SignedIn>
        <div className="flex items-center gap-4">
          <Link to="/subscription">
             <CreaditDisplay credits={credits}/>
          </Link>
          <div className="relative">
            <UserButton />
          </div>
        </div>
      </SignedIn>

      {/* ✅ Sidebar (always visible on desktop, toggle on mobile) */}
      {/* Desktop version */}
      <div className="hidden lg:block fixed left-0 top-[61px] h-[calc(100vh-61px)] w-64 border-r border-gray-200/50 bg-white">
        <Sidemenu activeMenu={activeMenu}/>
      </div>

      {/* Mobile version (overlay) */}
      {openSideMenu && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50">
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl">
            <Sidemenu activeMenu={activeMenu}    />
          </div>

          {/* Close overlay */}
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setOpenSideMenu(false)}
          >
            <X className="text-2xl" />
          </button>
        </div>
      )}
    </div>
  );
}
