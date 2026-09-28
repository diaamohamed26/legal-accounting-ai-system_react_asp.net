import React from "react";
import {
  Bell,
  Home,
  LogOut,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      if (typeof logout === "function") {
        await logout();
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
      }
    } catch (error) {
      console.error("Logout error:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
    }

    navigate("/login", { replace: true });
  };

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6">

      {/* =====================================================
          Left Side
      ===================================================== */}
      <div className="flex min-w-0 items-center gap-4">

        <Link
          to="/"
          className="flex shrink-0 items-center gap-2"
          title="Public Home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            LA
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900">
              Legal Accounting
            </p>

            <p className="text-xs text-gray-500">
              Admin Portal
            </p>
          </div>
        </Link>

        <div className="hidden h-8 w-px bg-gray-200 md:block" />

        <div className="hidden md:block">
          <h1 className="text-sm font-bold text-gray-900">
            Admin Portal
          </h1>

          <p className="text-xs text-gray-500">
            Manage your legal & accounting system
          </p>
        </div>

      </div>

      {/* =====================================================
          Right Side
      ===================================================== */}
      <div className="flex items-center gap-1 sm:gap-3">

        {/* ---------------------------------------------------
            Home
        --------------------------------------------------- */}
        <Link
          to="/"
          className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 sm:flex"
          title="Public Home"
        >
          <Home size={18} />

          <span>
            Home
          </span>
        </Link>

        {/* ---------------------------------------------------
            Notifications
        --------------------------------------------------- */}
        <button
          type="button"
          className="relative rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          title="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="hidden h-8 w-px bg-gray-200 sm:block" />

        {/* ---------------------------------------------------
            Admin Profile
        --------------------------------------------------- */}
        <div className="flex items-center gap-2 rounded-xl px-2 py-1.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <User size={19} />
          </div>

          <div className="hidden max-w-32 text-left sm:block">
            <p className="truncate text-sm font-semibold text-gray-800">
              {displayName}
            </p>

            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------
            Logout
        --------------------------------------------------- */}
        <button
          type="button"
          onClick={handleLogout}
          className="group flex items-center gap-2 rounded-xl p-2.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          title="Logout"
        >
          <LogOut
            size={19}
            className="transition-transform group-hover:-translate-x-0.5"
          />

          <span className="hidden text-sm font-medium md:block">
            Logout
          </span>
        </button>

      </div>
    </header>
  );
};

export default AdminHeader;
