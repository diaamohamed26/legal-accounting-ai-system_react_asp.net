import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  FileText,
  Receipt,
  ArrowDownCircle,
  FolderOpen,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5001/api/admin";

const getApiErrorMessage = async (response) => {
  try {
    const data = await response.json();

    if (typeof data === "string") {
      return data;
    }

    return (
      data?.message ||
      data?.title ||
      data?.error ||
      "Something went wrong."
    );
  } catch {
    return `Request failed with status ${response.status}.`;
  }
};

const normalizeClient = (client) => ({
  id: client?.id,
  userId: client?.userId,
  name: client?.name || "Unnamed Client",
  email: client?.email || "",
  invoiceCount: Number(client?.invoiceCount ?? 0),
  expenseCount: Number(client?.expenseCount ?? 0),
  transactionCount: Number(client?.transactionCount ?? 0),
  documentCount: Number(client?.documentCount ?? 0),
});

export default function Clients() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }, [navigate]);

  const fetchClients = useCallback(async () => {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log(
        "[ADMIN CLIENTS] GET",
        `${API_URL}/clients`
      );

      const response = await fetch(`${API_URL}/clients`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        throw new Error(
          "You do not have permission to view clients."
        );
      }

      if (!response.ok) {
        const message = await getApiErrorMessage(response);
        throw new Error(message);
      }

      const data = await response.json();

      console.log("[ADMIN CLIENTS] Response:", data);

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid response received from the server."
        );
      }

      setClients(data.map(normalizeClient));
    } catch (err) {
      console.error("[ADMIN CLIENTS] Error:", err);

      setError(
        err?.message ||
          "Failed to load clients. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return clients;
    }

    return clients.filter((client) => {
      return (
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query)
      );
    });
  }, [clients, searchTerm]);

  const stats = useMemo(() => {
    return {
      clients: clients.length,
      invoices: clients.reduce(
        (total, client) => total + client.invoiceCount,
        0
      ),
      expenses: clients.reduce(
        (total, client) => total + client.expenseCount,
        0
      ),
      transactions: clients.reduce(
        (total, client) => total + client.transactionCount,
        0
      ),
      documents: clients.reduce(
        (total, client) => total + client.documentCount,
        0
      ),
    };
  }, [clients]);

  const handleDelete = async (client) => {
    if (!client?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${client.name}"?\n\nThis may also delete the client's related accounting data.`
    );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setDeletingId(client.id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/clients/${client.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        throw new Error(
          "You do not have permission to delete clients."
        );
      }

      if (!response.ok) {
        const message = await getApiErrorMessage(response);
        throw new Error(message);
      }

      setClients((current) =>
        current.filter((item) => item.id !== client.id)
      );
    } catch (err) {
      console.error("[ADMIN CLIENTS] Delete error:", err);

      setError(
        err?.message ||
          "Failed to delete client. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Clients
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your clients and their accounting records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchClients}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}

            Refresh
          </button>

          <Link
            to="/admin/clients/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div className="flex-1">
            <p className="font-medium">
              Something went wrong
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchClients}
            className="text-sm font-medium underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Clients
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {stats.clients}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Invoices
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {stats.invoices}
              </p>
            </div>

            <div className="rounded-lg bg-green-50 p-3">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Expenses
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {stats.expenses}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3">
              <Receipt className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Transactions
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {stats.transactions}
              </p>
            </div>

            <div className="rounded-lg bg-purple-50 p-3">
              <ArrowDownCircle className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Documents
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {stats.documents}
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 p-3">
              <FolderOpen className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading clients...</span>
            </div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="rounded-full bg-gray-100 p-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {searchTerm
                ? "No clients found"
                : "No clients yet"}
            </h3>

            <p className="mt-1 max-w-md text-sm text-gray-500">
              {searchTerm
                ? "Try changing your search criteria."
                : "Create your first client to start managing accounting records."}
            </p>

            {!searchTerm && (
              <Link
                to="/admin/clients/create"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Client
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Client
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Accounting
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* Client */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                          {client.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {client.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            Client ID: {client.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {client.email || "—"}
                      </span>
                    </td>

                    {/* Accounting */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          <FileText className="h-3.5 w-3.5" />
                          {client.invoiceCount} invoices
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                          <Receipt className="h-3.5 w-3.5" />
                          {client.expenseCount} expenses
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
                          <ArrowDownCircle className="h-3.5 w-3.5" />
                          {client.transactionCount} transactions
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                          <FolderOpen className="h-3.5 w-3.5" />
                          {client.documentCount} documents
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/clients/${client.id}`}
                          title="View client"
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        <Link
                          to={`/admin/clients/${client.id}/edit`}
                          title="Edit client"
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-yellow-50 hover:text-yellow-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>

                        <button
                          type="button"
                          title="Delete client"
                          onClick={() => handleDelete(client)}
                          disabled={deletingId === client.id}
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === client.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      {!loading && filteredClients.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {filteredClients.length} of{" "}
            {clients.length} clients
          </span>

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
