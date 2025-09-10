import React from "react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import { LayoutDashboard, Sidebar } from "lucide-react"; // ✅ replace Sidebar with a valid icon
import Sidemenu from "../components/Sidemenu";

export default function DeashboardLayout({ children, activeMenu }) {
  const { user } = useUser();

  return (
    <div>
      {/* Navbar */}
      <Navbar activeMenu={activeMenu} />

      {/* Sidebar + Content */}

      {user && (
        <div className="flex">
          <div className="max-[1050px]:hidden p-4 ">
            {/* Sidebar component or icon */}
            <Sidemenu activeMenu={activeMenu} className="w-6 h-6" />
          </div>
          <div className="grow p-4">
            {children}
          </div>
        </div>
      )}

      dashboard
    </div>
  );
}
