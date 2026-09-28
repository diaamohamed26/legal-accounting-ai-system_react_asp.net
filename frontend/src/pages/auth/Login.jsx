import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AuthForm from "../../components/auth/AuthForm";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
const navigate = useNavigate();
const { login } = useAuth();

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const fields = [
{
name: "email",
label: "Email",
type: "email",
placeholder: "Enter your email",
required: true,
},
{
name: "password",
label: "Password",
type: "password",
placeholder: "Enter your password",
required: true,
},
];

const handleLogin = async (data) => {
try {
setLoading(true);
setError("");

  const user = await login(data);

  if (user.role === "Admin") {
    navigate("/admin", { replace: true });
    return;
  }

  if (user.role === "Client") {
    navigate("/client", { replace: true });
    return;
  }

  setError("Unknown user role.");
} catch (error) {
  setError(
    error.message || "Invalid email or password."
  );
} finally {
  setLoading(false);
}

};

return ( <div className="relative">
{error && ( <div className="mx-auto mb-4 w-full max-w-md rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
{error} </div>
)}

  <AuthForm
    title="Welcome Back"
    description="Login to your account"
    fields={fields}
    submitText="Login"
    loading={loading}
    onSubmit={handleLogin}
    footer={
      <div className="space-y-3">
        <Link
          to="/forgot-password"
          className="block text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>

        <p className="text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    }
  />
</div>

);
};

export default Login;
