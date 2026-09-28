import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(() => {
const storedUser = localStorage.getItem("user");

if (!storedUser) {
  return null;
}

try {
  return JSON.parse(storedUser);
} catch {
  localStorage.removeItem("user");
  return null;
}

});

const [token, setToken] = useState(
() => localStorage.getItem("token") || null
);

const [loading, setLoading] = useState(true);

// =========================
// Check Authentication
// =========================

const checkAuth = async () => {
const storedToken = localStorage.getItem("token");

if (!storedToken) {
  setUser(null);
  setToken(null);
  setLoading(false);
  return;
}

try {
  const response = await api.get("/auth/me");

  const userData = response.data;

  setUser(userData);
  setToken(storedToken);

  localStorage.setItem(
    "user",
    JSON.stringify(userData)
  );
} catch (error) {
  console.error(
    "Authentication check failed:",
    error
  );

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setToken(null);
  setUser(null);
} finally {
  setLoading(false);
}

};

// =========================
// Login
// =========================

const login = async (credentials) => {
try {
const response = await api.post(
"/auth/login",
credentials
);

  const {
    token: accessToken,
    user: userData,
  } = response.data;

  localStorage.setItem("token", accessToken);
  localStorage.setItem(
    "user",
    JSON.stringify(userData)
  );

  setToken(accessToken);
  setUser(userData);

  return userData;
} catch (error) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.title ||
    "Invalid email or password.";

  throw new Error(message);
}

};

// =========================
// Register
// =========================

const register = async (userData) => {
try {
const response = await api.post(
"/auth/register",
userData
);

  const {
    token: accessToken,
    user: registeredUser,
  } = response.data;

  localStorage.setItem("token", accessToken);
  localStorage.setItem(
    "user",
    JSON.stringify(registeredUser)
  );

  setToken(accessToken);
  setUser(registeredUser);

  return registeredUser;
} catch (error) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.title ||
    "Registration failed.";

  throw new Error(message);
}

};

// =========================
// Logout
// =========================

const logout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");

setToken(null);
setUser(null);

};

// =========================
// Forgot Password
// =========================

const forgotPassword = async (email) => {
try {
const response = await api.post(
"/auth/forgot-password",
{
email,
}
);

  return response.data;
} catch (error) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.title ||
    "Failed to send reset email.";

  throw new Error(message);
}

};

// =========================
// Reset Password
// =========================

const resetPassword = async (data) => {
try {
const response = await api.post(
"/auth/reset-password",
data
);

  return response.data;
} catch (error) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.title ||
    "Failed to reset password.";

  throw new Error(message);
}

};

// =========================
// Initialize Auth
// =========================

useEffect(() => {
checkAuth();
}, []);

// =========================
// Authentication State
// =========================

const isAuthenticated = Boolean(user && token);

const value = {
user,
token,
loading,
isAuthenticated,

login,
register,
logout,

forgotPassword,
resetPassword,

checkAuth,

};

return (
<AuthContext.Provider value={value}>
{children}
</AuthContext.Provider>
);
};

// =========================
// useAuth Hook
// =========================

export const useAuth = () => {
const context = useContext(AuthContext);

if (!context) {
throw new Error(
"useAuth must be used inside AuthProvider"
);
}

return context;
};

export default AuthContext;
