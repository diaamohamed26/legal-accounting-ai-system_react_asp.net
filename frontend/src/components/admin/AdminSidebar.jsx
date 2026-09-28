import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Calculator,
  Bot,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const links = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Clients",
      path: "/admin/clients",
      icon: Users,
    },
    {
      title: "Invoices",
      path: "/admin/invoices",
      icon: FileText,
    },
    {
      title: "Expenses",
      path: "/admin/expenses",
      icon: Receipt,
    },
    {
      title: "AI Assistant",
      path: "/admin/ai",
      icon: Bot,
    },
  ];

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
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-gray-200 bg-white lg:flex lg:flex-col">

      {/* =====================================================
          Logo
      ===================================================== */}
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Calculator size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Legal Accounting
            </h1>

            <p className="text-xs text-gray-500">
              Admin Panel
            </p>
          </div>

        </div>
      </div>

      {/* =====================================================
          Navigation
      ===================================================== */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">

          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/admin"}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-4 py-3",
                    "text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  ].join(" ")
                }
              >
                <Icon
                  size={19}
                  strokeWidth={2}
                />

                <span>{link.title}</span>
              </NavLink>
            );
          })}

        </div>
      </nav>

      {/* =====================================================
          User & Logout
      ===================================================== */}
      <div className="shrink-0 border-t border-gray-200 p-4">

        {user && (
          <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2">
            <p className="truncate text-sm font-semibold text-gray-900">
              {displayName}
            </p>

            <p className="truncate text-xs text-gray-500">
              {user.email}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut
            size={19}
            strokeWidth={2}
          />

          <span>Logout</span>
        </button>

      </div>
    </aside>
  );
};

export default AdminSidebar;
