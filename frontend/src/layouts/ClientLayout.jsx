import React from "react";
import { Outlet } from "react-router-dom";

import ClientNavbar from "../components/client/ClientNavbar";
import ClientSidebar from "../components/client/ClientSidebar";

const ClientLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Client Sidebar */}
      <ClientSidebar />

      {/* Main Content Area */}
      <div className="min-h-screen lg:ml-64">
        {/* Client Navbar */}
        <ClientNavbar />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
