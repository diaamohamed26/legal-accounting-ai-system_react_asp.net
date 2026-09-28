import React from "react";
import { Link } from "react-router-dom";

const PublicFooter = () => {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                LA
              </div>

              <span className="text-lg font-bold text-white">
                Legal Accounting
              </span>
            </Link>

            <p className="mt-5 text-sm leading-6 text-gray-400">
              A modern platform for managing clients, invoices, documents,
              transactions, and accounting operations from one centralized
              system.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 font-semibold text-white">
              Company
            </h3>

            <div className="space-y-3 text-sm">
              <Link
                to="/about"
                className="block hover:text-white"
              >
                About Us
              </Link>

              <Link
                to="/services"
                className="block hover:text-white"
              >
                Services
              </Link>

              <Link
                to="/pricing"
                className="block hover:text-white"
              >
                Pricing
              </Link>

              <Link
                to="/contact"
                className="block hover:text-white"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-5 font-semibold text-white">
              Resources
            </h3>

            <div className="space-y-3 text-sm">
              <Link
                to="/faq"
                className="block hover:text-white"
              >
                FAQ
              </Link>

              <Link
                to="/login"
                className="block hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="block hover:text-white"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 font-semibold text-white">
              Contact
            </h3>

            <div className="space-y-3 text-sm text-gray-400">
              <p>Cairo, Egypt</p>
              <p>support@legalaccounting.com</p>
              <p>+20 100 000 0000</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-gray-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Legal Accounting. All rights
            reserved.
          </p>

          <div className="flex gap-6 text-sm text-gray-500">
            <Link
              to="/privacy"
              className="hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
