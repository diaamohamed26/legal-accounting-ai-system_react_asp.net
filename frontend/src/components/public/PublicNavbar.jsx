import React, { useState } from "react";
import {
ChevronDown,
Home,
LogIn,
LogOut,
Menu,
User,
X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PublicNavbar = () => {
const [mobileOpen, setMobileOpen] = useState(false);
const [profileOpen, setProfileOpen] = useState(false);

const location = useLocation();
const navigate = useNavigate();
const { user, logout } = useAuth();

const links = [
{ name: "Home", path: "/" },
{ name: "About", path: "/about" },
{ name: "Services", path: "/services" },
{ name: "Pricing", path: "/pricing" },
{ name: "FAQ", path: "/faq" },
{ name: "Contact", path: "/contact" },
];

const isActive = (path) => {
return location.pathname === path;
};

const closeMenu = () => {
setMobileOpen(false);
setProfileOpen(false);
};

const displayName =
user?.fullName ||
user?.name ||
user?.username ||
user?.email?.split("@")[0] ||
"Account";

const isAdmin = user?.role === "Admin";

const dashboardPath = isAdmin ? "/admin" : "/client";

const profilePath = isAdmin
? "/admin/settings"
: "/client/profile";

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

closeMenu();
navigate("/", { replace: true });

};

return ( <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur"> <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div className="flex h-16 items-center justify-between">
{/* Logo */} <Link
         to="/"
         onClick={closeMenu}
         className="flex shrink-0 items-center gap-3"
       > <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
LA </div>

        <div className="hidden sm:block">
          <div className="text-lg font-bold leading-tight text-gray-900">
            Legal Accounting
          </div>

          <div className="text-xs text-gray-500">
            Smart Financial Management
          </div>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-6 lg:flex">
        {links.map((link) => {
          const active = isActive(link.path);

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative py-5 text-sm font-medium transition ${
                active
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {link.name}

              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Desktop Actions */}
      <div className="hidden items-center gap-3 lg:flex">
        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setProfileOpen((previous) => !previous)
              }
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-100"
              title="Account Menu"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User size={18} />
              </div>

              <div className="max-w-28 text-left">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {displayName}
                </p>

                <p className="text-xs text-gray-500">
                  {isAdmin ? "Administrator" : "Client"}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {displayName}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {user?.email || "Signed in account"}
                  </p>
                </div>

                <Link
                  to={dashboardPath}
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  <Home size={17} />
                  Dashboard
                </Link>

                <Link
                  to={profilePath}
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  <User size={17} />
                  Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              <LogIn size={17} />
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile Button */}
      <button
        type="button"
        onClick={() => setMobileOpen((previous) => !previous)}
        className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 lg:hidden"
        aria-label="Toggle navigation"
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>

    {/* Mobile Navigation */}
    {mobileOpen && (
      <div className="border-t border-gray-200 py-4 lg:hidden">
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const active = isActive(link.path);

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="mt-3 border-t border-gray-200 pt-3">
            {user ? (
              <div className="space-y-2">
                {/* Mobile User Info */}
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <User size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {displayName}
                    </p>

                    <p className="text-xs text-gray-500">
                      {isAdmin ? "Administrator" : "Client"}
                    </p>
                  </div>
                </div>

                {/* Dashboard */}
                <Link
                  to={dashboardPath}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  <Home size={18} />
                  Dashboard
                </Link>

                {/* Profile */}
                <Link
                  to={profilePath}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  <User size={18} />
                  Profile
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  <LogIn size={17} />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    )}
  </div>
</header>

);
};

export default PublicNavbar;
