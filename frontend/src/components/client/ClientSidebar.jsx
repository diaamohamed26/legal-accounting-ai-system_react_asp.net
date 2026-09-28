import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  BarChart3,
  ArrowLeftRight,
  User,
  Scale,
} from "lucide-react";

const ClientSidebar = () => {
  const links = [
    {
      name: "Dashboard",
      path: "/client",
      icon: LayoutDashboard,
    },
    {
      name: "Invoices",
      path: "/client/invoices",
      icon: FileText,
    },
    {
      name: "Documents",
      path: "/client/documents",
      icon: FolderOpen,
    },
    {
      name: "Reports",
      path: "/client/reports",
      icon: BarChart3,
    },
    {
      name: "Transactions",
      path: "/client/transactions",
      icon: ArrowLeftRight,
    },
    {
      name: "Profile",
      path: "/client/profile",
      icon: User,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-gray-200 bg-white lg:block">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Scale size={22} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Legal & Accounting
            </h2>

            <p className="text-xs text-gray-500">
              Client Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        <nav className="flex-1 space-y-1.5 p-4">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/client"}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={20}
                      className={`shrink-0 ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-blue-600"
                      }`}
                    />

                    <span>{link.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Card */}
        <div className="border-t border-gray-200 p-4">
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Scale size={18} />
            </div>

            <p className="text-sm font-semibold text-gray-800">
              Need Help?
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Contact your legal or accounting team for assistance.
            </p>

            <button
              type="button"
              className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Contact Support →
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ClientSidebar;