import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  User,
  Mail,
  FileText,
  Receipt,
  Wallet,
  FolderOpen,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

const API_URL = "http://localhost:5001/api/admin";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const fetchClient = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      const response = await fetch(
        `${API_URL}/clients/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.status === 401) {
        throw new Error(
          "Your session has expired. Please login again."
        );
      }

      if (response.status === 403) {
        throw new Error(
          "You do not have permission to view this client."
        );
      }

      if (response.status === 404) {
        throw new Error("Client not found.");
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load client."
        );
      }

      setClient(data);
    } catch (err) {
      console.error("Client details error:", err);

      setError(
        err.message || "Failed to load client."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

  const handleDelete = async () => {
    if (!client) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${client.name}"?\n\n` +
        "This action may also delete related accounting data."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response = await fetch(
        `${API_URL}/clients/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete client."
        );
      }

      navigate("/admin/clients");
    } catch (err) {
      console.error("Delete client error:", err);

      alert(
        err.message || "Failed to delete client."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />

        <div className="h-40 animate-pulse rounded-xl bg-gray-100" />

        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <Link
          to="/admin/clients"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Clients
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex gap-3 text-red-700">
            <AlertCircle size={22} />

            <div>
              <h2 className="font-semibold">
                Unable to load client
              </h2>

              <p className="mt-1 text-sm">
                {error || "Client not found."}
              </p>
            </div>
          </div>

          <button
            onClick={fetchClient}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const invoices = client.invoices || [];
  const expenses = client.expenses || [];
  const transactions = client.transactions || [];
  const documents = client.documents || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/clients"
            className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Client Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View client profile and accounting activity.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/admin/clients/${client.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Edit size={17} />
            Edit
          </Link>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? (
              <RefreshCw
                size={17}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={17} />
            )}

            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-50 text-2xl font-bold text-blue-600">
            {(client.name || "C")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {client.name}
            </h2>

            <div className="mt-2 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:gap-5">
              <span className="inline-flex items-center gap-2">
                <Mail size={16} />
                {client.email}
              </span>

              <span>
                Client ID: #{client.id}
              </span>

              <span>
                User ID: #{client.userId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Receipt size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Invoices
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {invoices.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <Wallet size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Expenses
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {expenses.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <FileText size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Transactions
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {transactions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
              <FolderOpen size={21} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Documents
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {documents.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent invoices */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-semibold text-gray-900">
            Recent Invoices
          </h2>
        </div>

        {invoices.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No invoices found for this client.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Invoice
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Amount
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {invoices.slice(0, 10).map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {invoice.invoiceNumber}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      ${Number(invoice.amount || 0).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {invoice.date
                        ? new Date(
                            invoice.date
                          ).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;