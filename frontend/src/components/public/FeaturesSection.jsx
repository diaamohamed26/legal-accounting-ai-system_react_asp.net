import React from "react";
import {
  BarChart3,
  FileText,
  Receipt,
  Users,
  FolderOpen,
  ShieldCheck,
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: "Client Management",
      description:
        "Keep client information organized and accessible from one place.",
    },
    {
      icon: Receipt,
      title: "Invoice Management",
      description:
        "Create, manage, and track invoices throughout their lifecycle.",
    },
    {
      icon: FolderOpen,
      title: "Document Management",
      description:
        "Store and organize important financial and business documents.",
    },
    {
      icon: BarChart3,
      title: "Financial Reports",
      description:
        "Get a clear overview of transactions and financial activity.",
    },
    {
      icon: FileText,
      title: "Accounting Records",
      description:
        "Manage accounts, transactions, and ledger information efficiently.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Access",
      description:
        "Role-based access helps keep financial information organized.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Powerful Features
          </span>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Everything you need in one platform
          </h2>

          <p className="mt-4 text-gray-600">
            Simplify daily financial workflows with tools designed for
            modern businesses and professionals.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={24} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
