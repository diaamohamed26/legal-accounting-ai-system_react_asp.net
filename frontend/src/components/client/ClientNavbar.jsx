import React, { useState } from "react";
import {
Bell,
ChevronDown,
Home,
LogOut,
User,
LayoutDashboard,
X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ClientNavbar = () => {
const navigate = useNavigate();
const { user, logout } = useAuth();

const [profileOpen, setProfileOpen] = useState(false);
const [notificationsOpen, setNotificationsOpen] =
useState(false);

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

setProfileOpen(false);
setNotificationsOpen(false);

navigate("/", { replace: true });

};

const displayName =
user?.fullName ||
user?.name ||
user?.username ||
user?.email?.split("@")[0] ||
"My Account";

const email = user?.email || "";

return ( <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6">
{/* Left Side */} <div className="flex min-w-0 items-center gap-4">
{/* Logo */}
<Link
to="/"
onClick={() => {
setProfileOpen(false);
setNotificationsOpen(false);
}}
className="flex shrink-0 items-center gap-2"
title="Public Home"
> <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
LA </div>

      <div className="hidden sm:block">
        <p className="text-sm font-bold text-gray-900">
          Legal Accounting
        </p>

        <p className="text-xs text-gray-500">
          Client Portal
        </p>
      </div>
    </Link>

    <div className="hidden h-8 w-px bg-gray-200 md:block" />

    {/* Portal Information */}
    <div className="hidden md:block">
      <h1 className="text-sm font-bold text-gray-900">
        Client Portal
      </h1>

      <p className="text-xs text-gray-500">
        Manage your legal & accounting services
      </p>
    </div>
  </div>

  {/* Right Side */}
  <div className="flex items-center gap-1 sm:gap-3">
    {/* Public Home */}
    <Link
      to="/"
      onClick={() => {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }}
      className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-blue-50 hover:text-blue-600 sm:flex"
      title="Public Home"
    >
      <Home size={18} />
      <span>Home</span>
    </Link>

    {/* Notifications */}
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setNotificationsOpen(
            (previous) => !previous
          );
          setProfileOpen(false);
        }}
        className="relative rounded-xl p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
        title="Notifications"
        aria-label="Notifications"
        aria-expanded={notificationsOpen}
      >
        <Bell size={20} />

        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
      </button>

      {notificationsOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Notifications
              </h3>

              <p className="text-xs text-gray-500">
                Your latest updates
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setNotificationsOpen(false)
              }
              className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close notifications"
            >
              <X size={17} />
            </button>
          </div>

          <div className="p-4">
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <Bell
                size={22}
                className="mx-auto text-gray-300"
              />

              <p className="mt-2 text-sm font-medium text-gray-700">
                No new notifications
              </p>

              <p className="mt-1 text-xs text-gray-500">
                You're all caught up.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>

    <div className="hidden h-8 w-px bg-gray-200 sm:block" />

    {/* Account */}
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setProfileOpen(
            (previous) => !previous
          );
          setNotificationsOpen(false);
        }}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-100"
        title="Account Menu"
        aria-label="Account Menu"
        aria-expanded={profileOpen}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <User size={19} />
        </div>

        <div className="hidden max-w-32 text-left sm:block">
          <p className="truncate text-sm font-semibold text-gray-800">
            {displayName}
          </p>

          <p className="truncate text-xs text-gray-500">
            {email || "Client"}
          </p>
        </div>

        <ChevronDown
          size={16}
          className={`hidden shrink-0 text-gray-500 transition-transform sm:block ${
            profileOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {profileOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
          {/* User Info */}
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User size={19} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {displayName}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {email || "Client account"}
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard */}
          <Link
            to="/client"
            onClick={() => setProfileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          {/* Profile */}
          <Link
            to="/client/profile"
            onClick={() => setProfileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
          >
            <User size={18} />
            My Profile
          </Link>

          {/* Logout */}
          <div className="mt-1 border-t border-gray-100 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>

    {/* Direct Logout - Desktop */}
    <button
      type="button"
      onClick={handleLogout}
      className="group hidden items-center gap-2 rounded-xl p-2.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600 md:flex"
      title="Logout"
      aria-label="Logout"
    >
      <LogOut
        size={19}
        className="transition-transform group-hover:-translate-x-0.5"
      />

      <span className="hidden text-sm font-medium lg:block">
        Logout
      </span>
    </button>
  </div>
</header>

);
};

export default ClientNavbar;
