import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
ArrowRight,
CheckCircle2,
FileText,
Users,
Wallet,
FolderOpen,
TrendingUp,
ShieldCheck,
BarChart3,
} from "lucide-react";
import api from "../../services/api";

const HeroSection = () => {
const [summary, setSummary] = useState({
totalInvoices: 0,
activeClients: 0,
totalExpenses: 0,
totalDocuments: 0,
totalRevenue: 0,
revenueGrowth: 0,
});

const [loading, setLoading] = useState(true);

useEffect(() => {
let mounted = true;

const loadSummary = async () => {
  try {
    const response = await api.get(
      "/public/dashboard/summary"
    );

    if (!mounted) return;

    const data = response?.data || {};

    setSummary({
      totalInvoices: Number(data.totalInvoices ?? 0),
      activeClients: Number(data.activeClients ?? 0),
      totalExpenses: Number(data.totalExpenses ?? 0),
      totalDocuments: Number(data.totalDocuments ?? 0),
      totalRevenue: Number(data.totalRevenue ?? 0),
      revenueGrowth: Number(data.revenueGrowth ?? 0),
    });
  } catch (error) {
    console.error(
      "Failed to load public dashboard summary:",
      error
    );
  } finally {
    if (mounted) {
      setLoading(false);
    }
  }
};

loadSummary();

return () => {
  mounted = false;
};

}, []);

const formatCurrency = (value) => {
return new Intl.NumberFormat("en-US", {
style: "currency",
currency: "USD",
maximumFractionDigits: 0,
}).format(value);
};

const stats = [
{
label: "Total Invoices",
value: summary.totalInvoices.toLocaleString(),
icon: FileText,
iconClass: "bg-blue-50 text-blue-600",
},
{
label: "Active Clients",
value: summary.activeClients.toLocaleString(),
icon: Users,
iconClass: "bg-indigo-50 text-indigo-600",
},
{
label: "Expenses",
value: formatCurrency(summary.totalExpenses),
icon: Wallet,
iconClass: "bg-red-50 text-red-600",
},
{
label: "Documents",
value: summary.totalDocuments.toLocaleString(),
icon: FolderOpen,
iconClass: "bg-purple-50 text-purple-600",
},
];

const growth =
summary.revenueGrowth >= 0
? `+${summary.revenueGrowth.toFixed(1)}%`
: `${summary.revenueGrowth.toFixed(1)}%`;

return ( <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
{/* Background */} <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

  <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />

  <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
    <div className="grid items-center gap-14 lg:grid-cols-2">

      {/* Hero Content */}
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          <ShieldCheck size={16} />
          Smart Legal Accounting Platform
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Manage your financial operations with confidence
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Manage clients, invoices, expenses, documents,
          transactions, and financial reports from one
          simple and centralized platform.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/services"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Explore Services
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            "Client management",
            "Invoice management",
            "Document management",
            "Financial reporting",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <CheckCircle2
                size={18}
                className="shrink-0 text-green-600"
              />

              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="relative">
        <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl sm:p-4">
          <div className="rounded-xl bg-gray-50 p-4 sm:p-5">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  Total Revenue
                </p>

                <h3 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {loading
                    ? "Loading..."
                    : formatCurrency(summary.totalRevenue)}
                </h3>
              </div>

              <div className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">
                <TrendingUp size={15} />

                {loading ? "..." : growth}
              </div>
            </div>

            {/* Backend Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-500">
                          {stat.label}
                        </p>

                        <p className="mt-2 text-xl font-bold text-gray-900">
                          {loading
                            ? "..."
                            : stat.value}
                        </p>
                      </div>

                      <div
                        className={`rounded-lg p-2 ${stat.iconClass}`}
                      >
                        <Icon size={18} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Revenue Overview */}
            <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Revenue Overview
                  </p>

                  <p className="text-xs text-gray-400">
                    Live data from .NET backend
                  </p>
                </div>

                <BarChart3
                  size={18}
                  className="text-blue-600"
                />
              </div>

              <div className="flex h-28 items-end gap-2">
                {[
                  35,
                  48,
                  42,
                  63,
                  55,
                  76,
                  68,
                  88,
                ].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-md bg-blue-500 transition hover:bg-blue-600"
                    style={{
                      height: `${height}%`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Backend Connection */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-green-100 bg-green-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Backend Status
                  </p>

                  <p className="text-sm font-semibold text-gray-900">
                    Connected to .NET API
                  </p>
                </div>
              </div>

              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>
          </div>
        </div>

        {/* Floating Badge */}
        <div className="absolute -bottom-5 -left-4 hidden rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg sm:block lg:-left-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Accounting System
              </p>

              <p className="text-sm font-semibold text-gray-900">
                Data Connected
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

);
};

export default HeroSection;
