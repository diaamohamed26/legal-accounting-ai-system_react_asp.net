import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="bg-blue-600">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to simplify your financial management?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-blue-100">
          Start managing your clients, invoices, documents, and accounting
          operations from one centralized platform.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-blue-600 transition hover:bg-gray-100"
          >
            Create Your Account
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-blue-400 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
