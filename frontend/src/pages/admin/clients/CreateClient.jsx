import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  UserPlus,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5001/api/admin";

const CreateClient = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // Get token
  // =========================================================
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================================================
  // Handle input
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================================================
  // Submit
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    // =======================================================
    // Validation
    // =======================================================

    if (!name) {
      setError("Client name is required.");
      return;
    }

    if (name.length > 200) {
      setError(
        "Client name cannot exceed 200 characters."
      );
      return;
    }

    if (!email) {
      setError("Client email is required.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Password and Confirm Password do not match."
      );
      return;
    }

    // =======================================================
    // Create Client
    // =======================================================

    try {
      setSubmitting(true);

      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const payload = {
        name,
        email,
        password,
        confirmPassword,
      };

      console.log(
        "[CREATE CLIENT] POST /admin/clients",
        payload
      );

      const response = await fetch(
        `${API_URL}/clients`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      console.log(
        "[CREATE CLIENT] Response:",
        response.status,
        data
      );

      // =====================================================
      // Unauthorized
      // =====================================================

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      // =====================================================
      // Error
      // =====================================================

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.title ||
            "Failed to create client."
        );
      }

      // =====================================================
      // Success
      // =====================================================

      setSuccess(
        "Client created successfully. The client can now log in."
      );

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/admin/clients");
      }, 1000);
    } catch (err) {
      console.error(
        "[CREATE CLIENT] Error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong while creating the client."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // Render
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">

        {/* =====================================================
            Header
        ====================================================== */}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <UserPlus className="h-7 w-7 text-blue-600" />

              <h1 className="text-2xl font-bold text-gray-900">
                Create Client
              </h1>
            </div>

            <p className="text-sm text-gray-500">
              Create a new client account and client profile.
            </p>
          </div>

          <Link
            to="/admin/clients"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Link>
        </div>

        {/* =====================================================
            Error
        ====================================================== */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-medium">
                Error
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            Success
        ====================================================== */}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* =====================================================
            Form
        ====================================================== */}

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

          <form onSubmit={handleSubmit}>

            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Client Account
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                The system will automatically create a Client
                user account.
              </p>
            </div>

            <div className="space-y-6 p-6">

              {/* =================================================
                  Name
              ================================================== */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="Enter client full name"
                    autoComplete="name"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* =================================================
                  Email
              ================================================== */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="client@example.com"
                    autoComplete="email"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  />
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  This email will be used by the client to log in.
                </p>
              </div>

              {/* =================================================
                  Password
              ================================================== */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={form.password}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* =================================================
                  Confirm Password
              ================================================== */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={form.confirmPassword}
                    onChange={handleChange}
                    disabled={submitting}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* =================================================
                  Info
              ================================================== */}

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-900">
                  What happens when you create the client?
                </p>

                <ul className="mt-2 space-y-1 text-sm text-blue-800">
                  <li>
                    • A new User account will be created.
                  </li>

                  <li>
                    • The User role will automatically be Client.
                  </li>

                  <li>
                    • A Client profile will be created.
                  </li>

                  <li>
                    • The Client profile will be linked to the User.
                  </li>
                </ul>
              </div>
            </div>

            {/* =================================================
                Footer
            ================================================== */}

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">

              <Link
                to="/admin/clients"
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Client...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Client
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateClient;