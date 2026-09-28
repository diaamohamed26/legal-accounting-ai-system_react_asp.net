import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";

import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import api from "../../../services/api";

const CreateInvoice = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);

  const [loadingClients, setLoadingClients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    clientId: "",
    amount: "",
    status: "Pending",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
  });

  // =========================================================
  // Load Clients
  // =========================================================

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        setError("");

        const response = await api.get("/admin/clients");

        const data = Array.isArray(response.data)
          ? response.data
          : [];

        setClients(data);
      } catch (error) {
        console.error(
          "Failed to fetch clients:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load clients."
        );
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  // =========================================================
  // Handle Input Change
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================================================
  // Submit
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Client validation
    if (!form.clientId) {
      setError("Please select a client.");
      return;
    }

    // Amount validation
    if (!form.amount || Number(form.amount) <= 0) {
      setError(
        "Invoice amount must be greater than zero."
      );
      return;
    }

    // Date validation
    if (!form.date) {
      setError("Invoice date is required.");
      return;
    }

    // Due date validation
    if (
      form.dueDate &&
      new Date(form.dueDate) < new Date(form.date)
    ) {
      setError(
        "Due date cannot be earlier than invoice date."
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        clientId: Number(form.clientId),

        amount: Number(form.amount),

        status: form.status,

        date: new Date(
          `${form.date}T00:00:00`
        ).toISOString(),

        dueDate: form.dueDate
          ? new Date(
              `${form.dueDate}T00:00:00`
            ).toISOString()
          : null,
      };

      console.log(
        "[CREATE INVOICE PAYLOAD]",
        payload
      );

      await api.post("/invoices", payload);

      navigate("/admin/invoices");
    } catch (error) {
      console.error(
        "Failed to create invoice:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create invoice. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // Render
  // =========================================================

  return (
    <div className="space-y-6">

      {/* Page Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Invoice
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create a new invoice
          </p>
        </div>

        <Button
          type="button"
          onClick={() =>
            navigate("/admin/invoices")
          }
        >
          <span className="flex items-center gap-2">
            <ArrowLeft size={18} />
            Back to Invoices
          </span>
        </Button>
      </div>

      {/* Error */}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} />

          <span>{error}</span>
        </div>
      )}

      {/* Form */}

      <Card>
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Client */}

          <div>
            <label
              htmlFor="clientId"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Client
            </label>

            <select
              id="clientId"
              name="clientId"
              value={form.clientId}
              onChange={handleChange}
              disabled={
                loadingClients || submitting
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">
                {loadingClients
                  ? "Loading clients..."
                  : "Select a client"}
              </option>

              {clients.map((client) => (
                <option
                  key={client.id}
                  value={client.id}
                >
                  {client.name}
                  {client.email
                    ? ` - ${client.email}`
                    : ""}
                </option>
              ))}
            </select>

            {!loadingClients &&
              clients.length === 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  No clients available. Please create
                  a client first.
                </p>
              )}
          </div>

          {/* Amount */}

          <Input
            label="Amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Invoice amount"
            value={form.amount}
            onChange={handleChange}
            disabled={submitting}
          />

          {/* Status */}

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100"
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
          </div>

          {/* Invoice Date */}

          <Input
            label="Invoice Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            disabled={submitting}
          />

          {/* Due Date */}

          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            disabled={submitting}
          />

          {/* Buttons */}

          <div className="flex items-center gap-3 pt-3">

            <Button
              type="submit"
              disabled={
                submitting ||
                loadingClients ||
                clients.length === 0
              }
            >
              <span className="flex items-center gap-2">
                {submitting && (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                )}

                {submitting
                  ? "Creating..."
                  : "Create Invoice"}
              </span>
            </Button>

            <Button
              type="button"
              onClick={() =>
                navigate("/admin/invoices")
              }
              disabled={submitting}
            >
              Cancel
            </Button>

          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateInvoice;