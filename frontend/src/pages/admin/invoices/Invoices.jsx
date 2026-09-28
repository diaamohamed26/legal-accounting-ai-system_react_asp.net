import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Eye,
  Trash2,
  RefreshCw,
  Loader2,
  FileText,
  AlertCircle,
} from "lucide-react";

import Button from "../../../components/common/Button";
import api from "../../../services/api";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/invoices");

      setInvoices(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Failed to fetch invoices:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load invoices. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await api.delete(`/invoices/${id}`);

      setInvoices((current) =>
        current.filter((invoice) => invoice.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete invoice:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete invoice."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      setError("");

      await api.put(`/invoices/${id}/status`, status);

      setInvoices((current) =>
        current.map((invoice) =>
          invoice.id === id
            ? {
                ...invoice,
                status,
              }
            : invoice
        )
      );
    } catch (error) {
      console.error(
        "Failed to update invoice status:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update invoice status."
      );
    }
  };

  const formatAmount = (amount) => {
    return `$${Number(amount || 0).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "overdue":
        return "bg-red-100 text-red-700";

      case "cancelled":
        return "bg-gray-100 text-gray-700";

      case "draft":
        return "bg-blue-100 text-blue-700";

      case "partiallypaid":
      case "partially paid":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Title + Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Invoices
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage invoices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={fetchInvoices}
            disabled={loading}
          >
            <span className="flex items-center gap-2">
              {loading ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <RefreshCw size={17} />
              )}

              Refresh
            </span>
          </Button>

          <Link to="/admin/invoices/create">
            <Button>
              <span className="flex items-center gap-2">
                <Plus size={18} />
                Create Invoice
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Invoices Table */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2
                size={22}
                className="animate-spin"
              />

              Loading invoices...
            </div>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <FileText
              size={45}
              className="mb-4 text-gray-300"
            />

            <h3 className="text-lg font-semibold text-gray-700">
              No invoices found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Create your first invoice to get started.
            </p>

            <Link
              to="/admin/invoices/create"
              className="mt-5"
            >
              <Button>
                <span className="flex items-center gap-2">
                  <Plus size={18} />
                  Create Invoice
                </span>
              </Button>
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm">

            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4">
                  Invoice
                </th>

                <th className="px-6 py-4">
                  Client
                </th>

                <th className="px-6 py-4">
                  Amount
                </th>

                <th className="px-6 py-4">
                  Invoice Date
                </th>

                <th className="px-6 py-4">
                  Due Date
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  {/* Invoice */}
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </td>

                  {/* Client */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-800">
                        {invoice.clientName ||
                          "Unknown Client"}
                      </p>

                      {invoice.clientEmail && (
                        <p className="text-xs text-gray-500">
                          {invoice.clientEmail}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 font-medium">
                    {formatAmount(invoice.amount)}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    {formatDate(invoice.date)}
                  </td>

                  {/* Due Date */}
                  <td className="px-6 py-4">
                    {formatDate(invoice.dueDate)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <select
                      value={
                        invoice.status || "Pending"
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          invoice.id,
                          e.target.value
                        )
                      }
                      className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium outline-none ${getStatusClasses(
                        invoice.status
                      )}`}
                    >
                      <option value="Draft">
                        Draft
                      </option>

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Paid">
                        Paid
                      </option>

                      <option value="PartiallyPaid">
                        Partially Paid
                      </option>

                      <option value="Overdue">
                        Overdue
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">

                      <Link
                        to={`/admin/invoices/${invoice.id}`}
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                        title="View invoice"
                      >
                        <Eye size={18} />
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(invoice.id)
                        }
                        disabled={
                          deletingId === invoice.id
                        }
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete invoice"
                      >
                        {deletingId === invoice.id ? (
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
};

export default Invoices;