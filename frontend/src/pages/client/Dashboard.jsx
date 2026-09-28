import { useCallback, useEffect, useMemo, useState } from "react";
import {
FileText,
FolderOpen,
Wallet,
Receipt,
ArrowUpRight,
ArrowDownRight,
RefreshCw,
Loader2,
} from "lucide-react";

import ClientHeader from "../../components/client/ClientHeader";
import ClientStatCard from "../../components/client/ClientStatCard";
import InvoiceCard from "../../components/client/InvoiceCard";
import NotificationCard from "../../components/client/NotificationCard";

import api from "../../services/api";

const Dashboard = () => {
const [dashboard, setDashboard] = useState(null);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [error, setError] = useState("");

const fetchDashboard = useCallback(async (isRefresh = false) => {
try {
if (isRefresh) {
setRefreshing(true);
} else {
setLoading(true);
}

  setError("");

  const response = await api.get("/client/dashboard");

  setDashboard(response?.data || null);
} catch (err) {
  console.error("Dashboard error:", err);

  const status = err?.response?.status;

  if (status === 401) {
    setError("Your session has expired. Please login again.");
  } else if (status === 403) {
    setError(
      "You do not have permission to access this dashboard."
    );
  } else if (status === 404) {
    setError(
      err?.response?.data?.message ||
        "Client dashboard endpoint or client profile was not found."
    );
  } else {
    setError(
      err?.response?.data?.message ||
        "Unable to load dashboard data. Please try again."
    );
  }
} finally {
  setLoading(false);
  setRefreshing(false);
}

}, []);

useEffect(() => {
fetchDashboard();
}, [fetchDashboard]);

const client = dashboard?.client || {};
const stats = dashboard?.stats || {};

const invoices = Array.isArray(dashboard?.recentInvoices)
? dashboard.recentInvoices
: [];

const transactions = Array.isArray(
dashboard?.recentTransactions
)
? dashboard.recentTransactions
: [];

const documents = Array.isArray(
dashboard?.recentDocuments
)
? dashboard.recentDocuments
: [];

const formatCurrency = (value) => {
return new Intl.NumberFormat("en-US", {
style: "currency",
currency: "USD",
minimumFractionDigits: 2,
maximumFractionDigits: 2,
}).format(Number(value || 0));
};

const formatDate = (date) => {
if (!date) return "-";

const parsedDate = new Date(date);

if (Number.isNaN(parsedDate.getTime())) {
  return "-";
}

return parsedDate.toLocaleDateString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

};

const notifications = useMemo(() => {
const pendingInvoiceNotifications = invoices
.filter(
(invoice) =>
String(invoice?.status || "").toLowerCase() ===
"pending"
)
.slice(0, 3)
.map((invoice) => ({
id: `invoice-${invoice.id}`,
title: "Pending Invoice",
message: `Invoice #${
          invoice.invoiceNumber || invoice.id
        } is awaiting payment.`,
date: formatDate(invoice.date),
}));

const documentNotifications = documents
  .slice(0, 2)
  .map((document) => ({
    id: `document-${document.id}`,
    title: "Document Uploaded",
    message: `${
      document.name || "A new document"
    } is now available.`,
    date: formatDate(
      document.uploadedAt || document.createdAt
    ),
  }));

return [
  ...pendingInvoiceNotifications,
  ...documentNotifications,
].slice(0, 5);

}, [invoices, documents]);

if (loading) {
return ( <div className="space-y-6"> <ClientHeader
       title="Dashboard"
       description="Welcome to your client portal"
     />

    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-32 animate-pulse rounded-xl bg-gray-200"
        />
      ))}
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
      <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
    </div>

    <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
  </div>
);

}

if (error) {
return ( <div className="space-y-6"> <ClientHeader
       title="Dashboard"
       description="Welcome to your client portal"
     />

    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <FileText className="h-6 w-6 text-red-600" />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-red-700">
        Unable to load dashboard
      </h2>

      <p className="mx-auto mt-2 max-w-lg text-sm text-red-600">
        {error}
      </p>

      <button
        type="button"
        onClick={() => fetchDashboard(true)}
        disabled={refreshing}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {refreshing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}

        {refreshing ? "Loading..." : "Try Again"}
      </button>
    </div>
  </div>
);

}

return ( <div className="space-y-6">
{/* Header */} <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
<ClientHeader
title="Dashboard"
description={`Welcome back, ${
            client.name || "Client"
          }`}
/>

    <button
      type="button"
      onClick={() => fetchDashboard(true)}
      disabled={refreshing}
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {refreshing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}

      {refreshing ? "Refreshing..." : "Refresh"}
    </button>
  </div>

  {/* Statistics */}
  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
    <ClientStatCard
      title="Total Invoices"
      value={stats.totalInvoices ?? 0}
      description={`${stats.paidInvoices ?? 0} paid invoices`}
      icon={FileText}
    />

    <ClientStatCard
      title="Pending Invoices"
      value={stats.pendingInvoices ?? 0}
      description="Awaiting payment"
      icon={Receipt}
    />

    <ClientStatCard
      title="Documents"
      value={documents.length}
      description="Recent documents"
      icon={FolderOpen}
    />

    <ClientStatCard
      title="Balance"
      value={formatCurrency(stats.balance)}
      description="Current balance"
      icon={Wallet}
    />
  </div>

  {/* Financial Summary */}
  <div className="grid gap-5 md:grid-cols-3">
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Total Paid
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(stats.totalPaid)}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
          <ArrowUpRight className="h-5 w-5 text-green-600" />
        </div>
      </div>

      <p className="mt-3 text-xs text-green-600">
        Paid invoices
      </p>
    </div>

    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Total Pending
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(stats.totalPending)}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
          <Receipt className="h-5 w-5 text-orange-600" />
        </div>
      </div>

      <p className="mt-3 text-xs text-orange-600">
        Awaiting payment
      </p>
    </div>

    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Total Expenses
          </p>

          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {formatCurrency(stats.totalExpenses)}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
          <ArrowDownRight className="h-5 w-5 text-red-600" />
        </div>
      </div>

      <p className="mt-3 text-xs text-red-600">
        Recorded expenses
      </p>
    </div>
  </div>

  {/* Recent Invoices + Notifications */}
  <div className="grid gap-6 lg:grid-cols-2">
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Invoices
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your latest invoices
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {invoices.length}
        </span>
      </div>

      <div className="space-y-4">
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={{
                id: invoice.id,
                number: invoice.invoiceNumber,
                date: formatDate(invoice.date),
                amount: formatCurrency(invoice.amount),
                status: invoice.status,
                dueDate: formatDate(invoice.dueDate),
              }}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-gray-400" />

            <p className="mt-3 text-sm font-medium text-gray-700">
              No invoices found
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Your recent invoices will appear here.
            </p>
          </div>
        )}
      </div>
    </div>

    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Notifications
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Recent account activity
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {notifications.length}
        </span>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <FolderOpen className="mx-auto h-10 w-10 text-gray-400" />

            <p className="mt-3 text-sm font-medium text-gray-700">
              No notifications
            </p>

            <p className="mt-1 text-xs text-gray-500">
              You're all caught up.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Recent Transactions */}
  <div>
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Recent Transactions
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Your latest financial transactions
      </p>
    </div>

    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {transactions.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {transactions.map((transaction) => {
            const isIncome =
              String(transaction?.type || "")
                .toLowerCase() === "income";

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between gap-4 p-5 transition hover:bg-gray-50"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    {isIncome ? (
                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-red-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-800">
                      {transaction.description ||
                        "Transaction"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </p>

                  <p className="mt-1 text-xs capitalize text-gray-500">
                    {transaction.type ||
                      "Transaction"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center">
          <Wallet className="mx-auto h-10 w-10 text-gray-400" />

          <p className="mt-3 text-sm font-medium text-gray-700">
            No transactions found
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Your recent transactions will appear here.
          </p>
        </div>
      )}
    </div>
  </div>
</div>

);
};

export default Dashboard;
