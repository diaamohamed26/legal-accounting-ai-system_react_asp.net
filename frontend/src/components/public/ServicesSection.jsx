import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Receipt,
  Wallet,
  FileArchive,
} from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Users,
      title: "Client Management",
      description:
        "Manage client profiles and keep relevant information organized.",
    },
    {
      icon: Receipt,
      title: "Invoices",
      description:
        "Create and track invoices while keeping payment information accessible.",
    },
    {
      icon: Wallet,
      title: "Accounting",
      description:
        "Manage accounts, transactions, expenses, and ledger records.",
    },
    {
      icon: FileArchive,
      title: "Documents",
      description:
        "Upload and organize important documents in one centralized location.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Our Services
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Financial tools designed around your workflow
            </h2>

            <p className="mt-4 text-gray-600">
              Access the tools you need to manage daily financial and
              accounting operations more efficiently.
            </p>
          </div>

          <Link
            to="/services"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all services →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="rounded-2xl bg-white p-7 shadow-sm border border-gray-200"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Icon size={23} />
                </div>

                <h3 className="mt-5 font-bold text-gray-900">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
