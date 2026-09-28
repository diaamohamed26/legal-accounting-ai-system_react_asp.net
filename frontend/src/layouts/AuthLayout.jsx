import React from "react";
import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Auth Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 transition hover:text-blue-700"
          >
            Legal Accounting
          </Link>

          <Link
            to="/"
            className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            Home
          </Link>
        </div>
      </header>

      {/* Auth Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
