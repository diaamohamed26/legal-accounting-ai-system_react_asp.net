import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// =========================================================
// Layouts
// =========================================================
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import ClientLayout from "../layouts/ClientLayout";

// =========================================================
// Route Guards
// =========================================================
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import ClientRoute from "./ClientRoute";

// =========================================================
// Public Pages
// =========================================================
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Services from "../pages/public/Services";
import Pricing from "../pages/public/Pricing";
import FAQ from "../pages/public/FAQ";
import Contact from "../pages/public/Contact";

// =========================================================
// Authentication Pages
// =========================================================
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";

// =========================================================
// Admin Pages
// =========================================================
import AdminDashboard from "../pages/admin/Dashboard";

// =========================================================
// Admin - Clients
// =========================================================
import Clients from "../pages/admin/clients/Clients";
import CreateClient from "../pages/admin/clients/CreateClient";
import ClientDetails from "../pages/admin/clients/ClientDetails";
import EditClient from "../pages/admin/clients/EditClient";

// =========================================================
// Admin - Invoices
// =========================================================
import Invoices from "../pages/admin/invoices/Invoices";
import CreateInvoice from "../pages/admin/invoices/CreateInvoice";
import InvoiceDetails from "../pages/admin/invoices/InvoiceDetails";

// =========================================================
// Admin - Expenses
// =========================================================
import Expenses from "../pages/admin/expenses/Expenses";
import CreateExpense from "../pages/admin/expenses/CreateExpense";
import EditExpense from "../pages/admin/expenses/EditExpense";

// =========================================================
// Admin - AI Assistant
// =========================================================
import AIAssistant from "../pages/admin/ai/AIAssistant";

// =========================================================
// Client Pages
// =========================================================
import ClientDashboard from "../pages/client/Dashboard";
import ClientClients from "../pages/client/Clients";
import ClientInvoices from "../pages/client/Invoices";
import ClientDocuments from "../pages/client/Documents";
import ClientReports from "../pages/client/Reports";
import ClientTransactions from "../pages/client/Transactions";
import Profile from "../pages/client/Profile";

// =========================================================
// App Routes
// =========================================================
const AppRoutes = () => {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC WEBSITE
      ===================================================== */}
      <Route element={<PublicRoute />}>
        <Route element={<PublicLayout />}>

          <Route
            index
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/services"
            element={<Services />}
          />

          <Route
            path="/pricing"
            element={<Pricing />}
          />

          <Route
            path="/faq"
            element={<FAQ />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

        </Route>
      </Route>

      {/* =====================================================
          AUTHENTICATION
      ===================================================== */}
      <Route element={<AuthLayout />}>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

      </Route>

      {/* =====================================================
          PROTECTED APPLICATION
      ===================================================== */}
      <Route element={<ProtectedRoute />}>

        {/* ===================================================
            ADMIN APPLICATION
        =================================================== */}
        <Route element={<AdminRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            {/* =================================================
                Dashboard
                /admin
            ================================================= */}
            <Route
              index
              element={<AdminDashboard />}
            />

            {/* =================================================
                Clients
                /admin/clients/*
            ================================================= */}
            <Route path="clients">

              {/* /admin/clients */}
              <Route
                index
                element={<Clients />}
              />

              {/* /admin/clients/create */}
              <Route
                path="create"
                element={<CreateClient />}
              />

              {/* /admin/clients/:id/edit */}
              <Route
                path=":id/edit"
                element={<EditClient />}
              />

              {/* /admin/clients/:id */}
              <Route
                path=":id"
                element={<ClientDetails />}
              />

            </Route>

            {/* =================================================
                Invoices
                /admin/invoices/*
            ================================================= */}
            <Route path="invoices">

              {/* /admin/invoices */}
              <Route
                index
                element={<Invoices />}
              />

              {/* /admin/invoices/create */}
              <Route
                path="create"
                element={<CreateInvoice />}
              />

              {/* /admin/invoices/:id */}
              <Route
                path=":id"
                element={<InvoiceDetails />}
              />

            </Route>

            {/* =================================================
                Expenses
                /admin/expenses/*
            ================================================= */}
            <Route path="expenses">

              {/* /admin/expenses */}
              <Route
                index
                element={<Expenses />}
              />

              {/* /admin/expenses/create */}
              <Route
                path="create"
                element={<CreateExpense />}
              />

              {/* /admin/expenses/:id/edit */}
              <Route
                path=":id/edit"
                element={<EditExpense />}
              />

            </Route>

            {/* =================================================
                AI Assistant
                /admin/ai
            ================================================= */}
            <Route
              path="ai"
              element={<AIAssistant />}
            />

          </Route>
        </Route>

        {/* ===================================================
            CLIENT APPLICATION
        =================================================== */}
        <Route element={<ClientRoute />}>

          <Route
            path="/client"
            element={<ClientLayout />}
          >

            {/* /client */}
            <Route
              index
              element={<ClientDashboard />}
            />

            {/* /client/clients */}
            <Route
              path="clients"
              element={<ClientClients />}
            />

            {/* /client/invoices */}
            <Route
              path="invoices"
              element={<ClientInvoices />}
            />

            {/* /client/documents */}
            <Route
              path="documents"
              element={<ClientDocuments />}
            />

            {/* /client/reports */}
            <Route
              path="reports"
              element={<ClientReports />}
            />

            {/* /client/transactions */}
            <Route
              path="transactions"
              element={<ClientTransactions />}
            />

            {/* /client/profile */}
            <Route
              path="profile"
              element={<Profile />}
            />

          </Route>
        </Route>

      </Route>

      {/* =====================================================
          FALLBACK
      ===================================================== */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
};

export default AppRoutes;
