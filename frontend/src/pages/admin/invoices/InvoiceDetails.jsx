import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileText,
  RefreshCw,
} from "lucide-react";

import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import api from "../../../services/api";

const InvoiceDetails = () => {
  const { id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/invoices/${id}`);

      setInvoice(response.data);
    } catch (error) {
      console.error("Failed to fetch invoice:", error);

      setInvoice(null);

      setError(
        error.response?.data?.message ||
          "Failed to load invoice."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) {
      return "$0.00";
    }

    return `$${Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  const formatStatus = (status) => {
    if (!status) {
      return "-";
    }

    if (status.toLowerCase() === "partiallypaid") {
      return "Partially Paid";
    }

    return status;
  };

  /*
   * Loading State
   */
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Invoice Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Loading invoice information...
          </p>
        </div>

        <Card>
          <div className="flex min-h-[250px] items-center justify-center">
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2
                size={22}
                className="animate-spin"
              />

              <span>Loading invoice...</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  /*
   * Error State
   */
  if (error || !invoice) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Invoice Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Invoice #{id}
          </p>
        </div>

        <Card>
          <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
            <AlertCircle
              size={42}
              className="mb-4 text-red-400"
            />

            <h3 className="text-lg font-semibold text-gray-800">
              Unable to load invoice
            </h3>

            <p className="mt-2 max-w-md text-sm text-red-600">
              {error || "Invoice not found."}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                onClick={fetchInvoice}
              >
                <span className="flex items-center gap-2">
                  <RefreshCw size={18} />
                  Try Again
                </span>
              </Button>

              <Link to="/admin/invoices">
                <Button type="button">
                  <span className="flex items-center gap-2">
                    <ArrowLeft size={18} />
                    Back to Invoices
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  /*
   * Invoice Details
   */
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Invoice Details
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {invoice.invoiceNumber}
          </p>
        </div>

        <Link to="/admin/invoices">
          <Button type="button">
            <span className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Back to Invoices
            </span>
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Invoice Summary */}
        <Card>
          <div className="mb-6 flex items-center gap-3 border-b pb-5">
            <div className="rounded-xl bg-gray-100 p-3">
              <FileText
                size={24}
                className="text-gray-700"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {invoice.invoiceNumber}
              </h2>

              <p className="text-sm text-gray-500">
                Invoice ID: {invoice.id}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Client */}
            <div>
              <p className="text-sm text-gray-500">
                Client
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {invoice.clientName || "Unknown Client"}
              </p>

              {invoice.clientEmail && (
                <p className="mt-1 text-sm text-gray-500">
                  {invoice.clientEmail}
                </p>
              )}
            </div>

            {/* Client ID */}
            <div>
              <p className="text-sm text-gray-500">
                Client ID
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {invoice.clientId}
              </p>
            </div>

            {/* Amount */}
            <div>
              <p className="text-sm text-gray-500">
                Amount
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                {formatAmount(invoice.amount)}
              </p>
            </div>
          </div>
        </Card>

        {/* Invoice Information */}
        <Card>
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Invoice Information
          </h2>

          <div className="space-y-5">
            {/* Status */}
            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <span
                className={`mt-2 inline-block rounded-full px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                  invoice.status
                )}`}
              >
                {formatStatus(invoice.status)}
              </span>
            </div>

            {/* Invoice Date */}
            <div>
              <p className="text-sm text-gray-500">
                Invoice Date
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {formatDate(invoice.date)}
              </p>
            </div>

            {/* Due Date */}
            <div>
              <p className="text-sm text-gray-500">
                Due Date
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {formatDate(invoice.dueDate)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceDetails;
