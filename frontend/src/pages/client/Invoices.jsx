import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  FileText,
  RefreshCw,
  Loader2,
  Wallet,
} from "lucide-react";

import ClientHeader from "../../components/client/ClientHeader";
import InvoiceCard from "../../components/client/InvoiceCard";
import api from "../../services/api";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchInvoices = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/invoices/my");

      const data = Array.isArray(response?.data)
        ? response.data
        : [];

      setInvoices(data);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load invoices. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const summary = useMemo(() => {
    const paidInvoices = invoices.filter(
      (invoice) =>
        String(invoice?.status || "").toLowerCase() === "paid"
    );

    const pendingInvoices = invoices.filter(
      (invoice) =>
        String(invoice?.status || "").toLowerCase() !== "paid"
    );

    const totalAmount = invoices.reduce(
      (total, invoice) =>
        total + Number(invoice?.amount || 0),
      0
    );

    const paidAmount = paidInvoices.reduce(
      (total, invoice) =>
        total + Number(invoice?.amount || 0),
      0
    );

    const pendingAmount = pendingInvoices.reduce(
      (total, invoice) =>
        total + Number(invoice?.amount || 0),
      0
    );

    return {
      total: invoices.length,
      paid: paidInvoices.length,
      pending: pendingInvoices.length,
      totalAmount,
      paidAmount,
      pendingAmount,
    };
  }, [invoices]);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <ClientHeader
          title="Invoices"
          description="View and manage your invoices"
        />

        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-48 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <ClientHeader
          title="Invoices"
          description="View and manage your invoices"
        />

        <button
          type="button"
          onClick={() => fetchInvoices(true)}
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

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-red-700">
                Unable to load invoices
              </h3>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchInvoices(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
      )}

      {/* Summary */}
      {!error && (
        <div className="grid gap-5 md:grid-cols-3">
          {/* Total */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Invoices
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {summary.total}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              {formatCurrency(summary.totalAmount)} total
            </p>
          </div>

          {/* Paid */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Paid
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {summary.paid}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>

            <p className="mt-3 text-xs text-green-600">
              {formatCurrency(summary.paidAmount)} paid
            </p>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Pending
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {summary.pending}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                <Clock3 className="h-5 w-5 text-orange-600" />
              </div>
            </div>

            <p className="mt-3 text-xs text-orange-600">
              {formatCurrency(summary.pendingAmount)} awaiting payment
            </p>
          </div>
        </div>
      )}

      {/* Empty */}
      {!error && invoices.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Wallet className="h-7 w-7 text-gray-400" />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-800">
            No invoices found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            You don't have any invoices yet. New invoices
            created for your account will appear here.
          </p>
        </div>
      )}

      {/* Invoices */}
      {!error && invoices.length > 0 && (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Invoices
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View your invoice details and payment status.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {invoices.map((invoice) => (
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
