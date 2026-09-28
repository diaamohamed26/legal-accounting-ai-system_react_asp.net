import React from "react";
import { Outlet } from "react-router-dom";

import PublicNavbar from "../components/public/PublicNavbar";
import PublicFooter from "../components/public/PublicFooter";

const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      {/* Public Navbar */}
      <PublicNavbar />

      {/* Public Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
