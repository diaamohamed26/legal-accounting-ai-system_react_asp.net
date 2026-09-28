import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Receipt,
} from "lucide-react";

import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import api from "../../../services/api";

const CreateExpense = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    clientId: "",
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoadingClients(true);
      setError("");

      const response = await api.get("/admin/clients");

      setClients(response.data || []);
    } catch (err) {
      console.error("Failed to load clients:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load clients. Please try again."
      );
    } finally {
      setLoadingClients(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.clientId) {
      setError("Please select a client.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter the expense description.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Please enter a valid expense amount.");
      return;
    }

    if (!formData.date) {
      setError("Please select an expense date.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        clientId: Number(formData.clientId),
        description: formData.description.trim(),
        amount: Number(formData.amount),
        category: formData.category.trim() || null,
        date: formData.date,
        notes: formData.notes.trim() || null,
      };

      await api.post("/expenses", payload);

      navigate("/admin/expenses");
    } catch (err) {
      console.error("Failed to create expense:", err);

      if (err.response?.data?.errors) {
        const validationErrors = Object.values(
          err.response.data.errors
        ).flat();

        setError(
          validationErrors.length > 0
            ? validationErrors.join(" ")
            : "Please check the entered data."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.response?.data ||
            "Failed to create expense. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/expenses"
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Add Expense
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Create a new business expense
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-medium">Something went wrong</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Icon / Intro */}
          <div className="flex items-center gap-3 border-b border-gray-200 pb-5">
            <div className="rounded-lg bg-red-50 p-3">
              <Receipt className="h-6 w-6 text-red-600" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Expense Information
              </h2>

              <p className="text-sm text-gray-500">
                Enter the details of the expense
              </p>
            </div>
          </div>

          {/* Client */}
          <div>
            <label
              htmlFor="clientId"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Client <span className="text-red-500">*</span>
            </label>

            <select
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              disabled={loadingClients || saving}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">
                {loadingClients
                  ? "Loading clients..."
                  : "Select a client"}
              </option>

              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                  {client.email ? ` - ${client.email}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description <span className="text-red-500">*</span>
            </label>

            <input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              disabled={saving}
              maxLength={500}
              placeholder="e.g. Office Rent"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />
          </div>

          {/* Amount + Category */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Amount <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  $
                </span>

                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                disabled={saving}
                maxLength={100}
                placeholder="e.g. Rent, Software, Travel"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Date <span className="text-red-500">*</span>
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              disabled={saving}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={saving}
              maxLength={1000}
              rows={4}
              placeholder="Additional information about this expense..."
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
            <Link to="/admin/expenses">
              <Button
                type="button"
                disabled={saving}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={saving || loadingClients}
              className="w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Expense
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateExpense;
