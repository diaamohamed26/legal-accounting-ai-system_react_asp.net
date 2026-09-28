import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const ClientHeader = ({
  title,
  description,
  action,
  showHome = true,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Title */}
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {title || "Client Dashboard"}
        </h1>

        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        {showHome && (
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            title="Go to Public Home"
          >
            <Home size={17} />

            <span className="hidden sm:inline">
              Home
            </span>
          </Link>
        )}

        {action && (
          <div className="flex items-center">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientHeader;
