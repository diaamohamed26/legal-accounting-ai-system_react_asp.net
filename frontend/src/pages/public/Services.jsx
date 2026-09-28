import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Receipt,
  Wallet,
  FileText,
  BarChart3,
  Bot,
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Users,
      title: "Client Management",
      description:
        "Create and manage client profiles while keeping important information organized.",
    },
    {
      icon: Receipt,
      title: "Invoice Management",
      description:
        "Create invoices, monitor their status, and keep billing information accessible.",
    },
    {
      icon: Wallet,
      title: "Accounting Management",
      description:
        "Manage accounts, transactions, expenses, and ledger information.",
    },
    {
      icon: FileText,
      title: "Document Management",
      description:
        "Store and organize important documents in a centralized workspace.",
    },
    {
      icon: BarChart3,
      title: "Reports",
      description:
        "Review financial information and generate useful business reports.",
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description:
        "Use an AI-powered assistant to interact with financial information and workflows.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Our Services
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Everything you need to manage your financial workflows
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            From clients and invoices to accounting records, documents,
            reports, and AI assistance.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="rounded-2xl border border-gray-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Icon size={26} />
                  </div>

                  <h2 className="mt-6 text-xl font-bold text-gray-900">
                    {service.title}
                  </h2>

                  <p className="mt-3 leading-7 text-gray-600">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to get started?
          </h2>

          <p className="mt-4 text-gray-600">
            Create your account and start managing your financial
            operations.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
