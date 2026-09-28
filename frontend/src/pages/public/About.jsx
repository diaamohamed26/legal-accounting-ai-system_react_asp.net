import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Target,
  Users,
  Lightbulb,
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "Make financial and accounting workflows simpler, clearer, and easier to manage.",
    },
    {
      icon: ShieldCheck,
      title: "Security",
      description:
        "Keep financial information organized with controlled access and secure workflows.",
    },
    {
      icon: Users,
      title: "Client Focus",
      description:
        "Build tools around the needs of businesses, professionals, and their clients.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Use modern technology to improve everyday accounting and financial operations.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              About Legal Accounting
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              A smarter way to manage financial operations
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Legal Accounting is a centralized platform designed to help
              businesses and professionals manage clients, invoices,
              expenses, documents, transactions, and financial information.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Our Story
              </span>

              <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Bringing important financial workflows together
              </h2>

              <p className="mt-6 leading-7 text-gray-600">
                Managing financial information across different systems can
                create unnecessary complexity. Legal Accounting brings key
                financial workflows together in one centralized platform.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                The platform provides tools for client management, invoices,
                documents, transactions, accounting records, and reports,
                helping users keep their information organized.
              </p>

              <Link
                to="/services"
                className="mt-8 inline-flex rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Our Services
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">
                    01
                  </div>
                  <h3 className="mt-3 font-bold text-gray-900">
                    Organized
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Keep important information structured and accessible.
                  </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="text-3xl font-bold text-indigo-600">
                    02
                  </div>
                  <h3 className="mt-3 font-bold text-gray-900">
                    Centralized
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Manage multiple financial workflows from one place.
                  </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="text-3xl font-bold text-green-600">
                    03
                  </div>
                  <h3 className="mt-3 font-bold text-gray-900">
                    Efficient
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Reduce unnecessary manual processes.
                  </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="text-3xl font-bold text-purple-600">
                    04
                  </div>
                  <h3 className="mt-3 font-bold text-gray-900">
                    Accessible
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Access relevant information through a clear interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Our Values
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Principles behind the platform
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-gray-200 bg-white p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 font-bold text-gray-900">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">
            Start managing your financial operations
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Create an account and explore the Legal Accounting platform.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-gray-100"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
