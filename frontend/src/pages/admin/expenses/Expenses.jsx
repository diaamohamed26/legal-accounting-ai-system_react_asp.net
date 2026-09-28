import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  Receipt,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import api from "../../../services/api";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // =========================================================
  // LOAD EXPENSES
  // =========================================================

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/expenses");

      setExpenses(response.data || []);
    } catch (err) {
      console.error("Failed to load expenses:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load expenses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // =========================================================
  // DELETE EXPENSE
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await api.delete(`/expenses/${id}`);

      setExpenses((current) =>
        current.filter((expense) => expense.id !== id)
      );
    } catch (err) {
      console.error("Failed to delete expense:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete expense. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredExpenses = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return expenses;
    }

    return expenses.filter((expense) => {
      return (
        expense.description?.toLowerCase().includes(searchValue) ||
        expense.category?.toLowerCase().includes(searchValue) ||
        expense.clientName?.toLowerCase().includes(searchValue)
      );
    });
  }, [expenses, search]);

  // =========================================================
  // TOTAL
  // =========================================================

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (total, expense) => total + Number(expense.amount || 0),
      0
    );
  }, [expenses]);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  // =========================================================
  // FORMAT AMOUNT
  // =========================================================

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE TITLE
      ===================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Expenses
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Track and manage business expenses
        </p>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Expenses
              </p>

              <p className="mt-1 text-2xl font-bold text-red-600">
                ${formatAmount(totalExpenses)}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3">
              <Receipt className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Number of Expenses
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {expenses.length}
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-3">
              <Receipt className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* =====================================================
          SEARCH + ACTIONS
      ===================================================== */}

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={loadExpenses}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}

              Refresh
            </Button>

            <Link to="/admin/expenses/create">
              <Button type="button">
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-medium">
              Something went wrong
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <Card>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

            <span className="ml-3 text-gray-500">
              Loading expenses...
            </span>
          </div>
        </Card>
      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading && filteredExpenses.length === 0 && (
        <Card>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Receipt className="h-12 w-12 text-gray-300" />

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {search
                ? "No expenses found"
                : "No expenses yet"}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {search
                ? "Try a different search term."
                : "Create your first expense to get started."}
            </p>

            {!search && (
              <Link
                to="/admin/expenses/create"
                className="mt-4"
              >
                <Button type="button">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}

      {/* =====================================================
          EXPENSE LIST
      ===================================================== */}

      {!loading && filteredExpenses.length > 0 && (
        <div className="space-y-4">
          {filteredExpenses.map((expense) => (
            <Card key={expense.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Expense information */}

                <div className="min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-red-50 p-2">
                      <Receipt className="h-5 w-5 text-red-600" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900">
                        {expense.description}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                        <span>
                          {formatDate(expense.date)}
                        </span>

                        {expense.category && (
                          <>
                            <span>•</span>

                            <span>
                              {expense.category}
                            </span>
                          </>
                        )}

                        {expense.clientName && (
                          <>
                            <span>•</span>

                            <span>
                              {expense.clientName}
                            </span>
                          </>
                        )}
                      </div>

                      {expense.notes && (
                        <p className="mt-2 text-sm text-gray-500">
                          {expense.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount + actions */}

                <div className="flex items-center justify-between gap-4 lg:justify-end">
                  <p className="font-bold text-red-600">
                    -${formatAmount(expense.amount)}
                  </p>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/expenses/${expense.id}/edit`}
                    >
                      <button
                        type="button"
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
                        title="Edit expense"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(expense.id)
                      }
                      disabled={deletingId === expense.id}
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Delete expense"
                    >
                      {deletingId === expense.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Expenses;
