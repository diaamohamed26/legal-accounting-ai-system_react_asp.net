import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Wallet,
  BarChart3,
  FolderOpen,
  Bot,
  UserCog,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const links = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Clients", path: "/admin/clients", icon: Users },
    { name: "Invoices", path: "/admin/invoices", icon: FileText },
    { name: "Expenses", path: "/admin/expenses", icon: Receipt },
    { name: "Accounting", path: "/admin/accounting", icon: Wallet },
    { name: "Reports", path: "/admin/reports", icon: BarChart3 },
    { name: "Documents", path: "/admin/documents", icon: FolderOpen },
    { name: "AI Assistant", path: "/admin/ai", icon: Bot },
    { name: "Users", path: "/admin/users", icon: UserCog },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-blue-600">
          Legal & Accounting
        </h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={20} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;