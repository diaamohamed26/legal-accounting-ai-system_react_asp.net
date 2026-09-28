import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  FileText,
  Wallet,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import StatCard from "../../components/admin/StatCard";
import DashboardCard from "../../components/admin/DashboardCard";
import RecentActivity from "../../components/admin/RecentActivity";

const API_URL = "http://localhost:5001/api";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(`${API_URL}/admin/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error("Your session has expired. Please login again.");
      }

      if (response.status === 403) {
        throw new Error("You do not have permission to access the admin dashboard.");
      }

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          message || `Failed to load dashboard (${response.status})`
        );
      }

      const data = await response.json();

      setDashboard(data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =====================================================
  // Helpers
  // =====================================================

  const formatCurrency = (value) => {
    const amount = Number(value || 0);

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRelativeDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    const now = new Date();

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const target = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate()
    );

    const difference =
      Math.floor((today - target) / (1000 * 60 * 60 * 24));

    if (difference === 0) return "Today";
    if (difference === 1) return "Yesterday";
    if (difference > 1 && difference < 7) {
      return `${difference} days ago`;
    }

    return formatDate(date);
  };

  // =====================================================
  // Statistics
  // =====================================================

  const statistics = dashboard?.statistics || {};

  const totalClients = statistics.totalClients ?? 0;
  const totalInvoices = statistics.totalInvoices ?? 0;
  const pendingInvoices = statistics.pendingInvoices ?? 0;
  const totalRevenue = statistics.totalRevenue ?? 0;
  const totalExpenses = statistics.totalExpenses ?? 0;
  const incomeThisMonth = statistics.incomeThisMonth ?? 0;
  const expensesThisMonth = statistics.expensesThisMonth ?? 0;

  // =====================================================
  // Recent Activity
  // =====================================================

  const activities = useMemo(() => {
    if (!dashboard) {
      return [];
    }

    const invoices = dashboard.recentInvoices || [];
    const expenses = dashboard.recentExpenses || [];
    const transactions = dashboard.recentTransactions || [];

    const invoiceActivities = invoices.map((invoice) => ({
      id: `invoice-${invoice.id}`,
      title:
        invoice.status?.toLowerCase() === "paid"
          ? "Invoice paid"
          : "Invoice created",
      description: `Invoice #${invoice.invoiceNumber} for ${formatCurrency(
        invoice.amount
      )}`,
      date: getRelativeDate(invoice.date),
    }));

    const expenseActivities = expenses.map((expense) => ({
      id: `expense-${expense.id}`,
      title: "Expense recorded",
      description: `${expense.description || "Expense"} - ${formatCurrency(
        expense.amount
      )}`,
      date: getRelativeDate(expense.date),
    }));

    const transactionActivities = transactions.map((transaction) => ({
      id: `transaction-${transaction.id}`,
      title: `${transaction.type || "Transaction"} transaction`,
      description: `${
        transaction.description || "Transaction"
      } - ${formatCurrency(transaction.amount)}`,
      date: getRelativeDate(transaction.date),
    }));

    return [
      ...invoiceActivities,
      ...expenseActivities,
      ...transactionActivities,
    ]
      .sort((a, b) => {
        const dateA =
          invoices.find(
            (item) => `invoice-${item.id}` === a.id
          )?.date ||
          expenses.find(
            (item) => `expense-${item.id}` === a.id
          )?.date ||
          transactions.find(
            (item) => `transaction-${item.id}` === a.id
          )?.date ||
          0;

        const dateB =
          invoices.find(
            (item) => `invoice-${item.id}` === b.id
          )?.date ||
          expenses.find(
            (item) => `expense-${item.id}` === b.id
          )?.date ||
          transactions.find(
            (item) => `transaction-${item.id}` === b.id
          )?.date ||
          0;

        return new Date(dateB) - new Date(dateA);
      })
      .slice(0, 6);
  }, [dashboard]);

  // =====================================================
  // Loading State
  // =====================================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-36 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-36 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>
    );
  }

  // =====================================================
  // Error State
  // =====================================================

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1.5 text-sm text-gray-500">
            Overview of your legal and accounting business
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-red-100 p-2 text-red-600">
              <AlertCircle size={22} />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-red-800">
                Unable to load dashboard
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

              <button
                onClick={fetchDashboard}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* =====================================================
          Page Header
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1.5 text-sm text-gray-500">
            Overview of your legal and accounting business
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchDashboard}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <Link
            to="/admin/clients/create"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            <span>New Client</span>
          </Link>

          <Link
            to="/admin/invoices/create"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            <FileText size={18} />
            <span>New Invoice</span>
          </Link>
        </div>
      </div>

      {/* =====================================================
          Statistics
      ===================================================== */}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clients"
          value={totalClients.toLocaleString()}
          description="Active clients"
          icon={<Users size={22} />}
        />

        <StatCard
          title="Invoices"
          value={totalInvoices.toLocaleString()}
          description={`${pendingInvoices} pending`}
          icon={<FileText size={22} />}
        />

        <StatCard
          title="Revenue"
          value={formatCurrency(totalRevenue)}
          description="Paid invoices"
          icon={<Wallet size={22} />}
        />

        <StatCard
          title="Expenses"
          value={formatCurrency(totalExpenses)}
          description="Total recorded expenses"
          icon={<Receipt size={22} />}
        />
      </div>

      {/* =====================================================
          Monthly Financial Summary
      ===================================================== */}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Income This Month
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(incomeThisMonth)}
              </p>

              <p className="mt-2 text-sm text-green-600">
                From paid invoices this month
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <ArrowUpRight size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Expenses This Month
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatCurrency(expensesThisMonth)}
              </p>

              <p className="mt-2 text-sm text-red-600">
                Recorded expenses this month
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <ArrowDownRight size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          Activity & Financial Overview
      ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Recent Activity">
          {activities.length > 0 ? (
            <RecentActivity activities={activities} />
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-gray-50">
              <FileText
                size={36}
                className="mb-3 text-gray-300"
              />

              <p className="text-sm font-medium text-gray-500">
                No recent activity
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Recent invoices, expenses and transactions will appear here.
              </p>
            </div>
          )}
        </DashboardCard>

        <DashboardCard title="Financial Overview">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  This Month
                </p>

                <p className="mt-1 text-xl font-bold text-gray-900">
                  {formatCurrency(
                    Number(incomeThisMonth) -
                      Number(expensesThisMonth)
                  )}
                </p>

                <p className="text-xs text-gray-400">
                  Net income
                </p>
              </div>

              <Wallet
                size={30}
                className="text-gray-300"
              />
            </div>

            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-500">
                    Income
                  </span>

                  <span className="font-medium text-green-600">
                    {formatCurrency(incomeThisMonth)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width:
                        incomeThisMonth > 0
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-gray-500">
                    Expenses
                  </span>

                  <span className="font-medium text-red-600">
                    {formatCurrency(expensesThisMonth)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{
                      width:
                        incomeThisMonth > 0
                          ? `${Math.min(
                              100,
                              (expensesThisMonth /
                                incomeThisMonth) *
                                100
                            )}%`
                          : expensesThisMonth > 0
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* =====================================================
          Quick Actions
      ===================================================== */}

      <DashboardCard title="Quick Actions">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/admin/clients"
            className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Users size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Clients
                </p>

                <p className="text-xs text-gray-500">
                  {totalClients} clients
                </p>
              </div>
            </div>

            <Eye
              size={17}
              className="text-gray-400 transition group-hover:text-blue-600"
            />
          </Link>

          <Link
            to="/admin/invoices"
            className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                <FileText size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Invoices
                </p>

                <p className="text-xs text-gray-500">
                  {pendingInvoices} pending
                </p>
              </div>
            </div>

            <Eye
              size={17}
              className="text-gray-400 transition group-hover:text-blue-600"
            />
          </Link>

          <Link
            to="/admin/expenses"
            className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-50 p-2 text-red-600">
                <Receipt size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Expenses
                </p>

                <p className="text-xs text-gray-500">
                  {formatCurrency(expensesThisMonth)} this month
                </p>
              </div>
            </div>

            <Eye
              size={17}
              className="text-gray-400 transition group-hover:text-blue-600"
            />
          </Link>

          <Link
            to="/admin/reports"
            className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <Wallet size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Reports
                </p>

                <p className="text-xs text-gray-500">
                  View financial reports
                </p>
              </div>
            </div>

            <Eye
              size={17}
              className="text-gray-400 transition group-hover:text-green-600"
            />
          </Link>
        </div>
      </DashboardCard>
    </div>
  );
};

export default Dashboard;