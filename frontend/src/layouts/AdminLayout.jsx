import React from "react";
import { Outlet } from "react-router-dom";

import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          Admin Sidebar
      ===================================================== */}
      <AdminSidebar />

      {/* =====================================================
          Main Application
      ===================================================== */}
      <div className="min-h-screen lg:ml-64">

        {/* -----------------------------------------------------
            Admin Header
        ----------------------------------------------------- */}
        <AdminHeader />

        {/* -----------------------------------------------------
            Page Content
        ----------------------------------------------------- */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
