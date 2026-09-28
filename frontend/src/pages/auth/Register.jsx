import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AuthForm from "../../components/auth/AuthForm";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
const navigate = useNavigate();
const { register } = useAuth();

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const fields = [
{
name: "name",
label: "Full Name",
type: "text",
placeholder: "Enter your full name",
required: true,
},
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
{
name: "confirmPassword",
label: "Confirm Password",
type: "password",
placeholder: "Confirm your password",
required: true,
},
];

const handleRegister = async (data) => {
try {
setLoading(true);
setError("");

  if (data.password !== data.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  if (data.password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  const userData = {
    name: data.name.trim(),
    email: data.email.trim(),
    password: data.password,
  };

  const user = await register(userData);

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
    error.message || "Registration failed. Please try again."
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
    title="Create Account"
    description="Create your account to get started"
    fields={fields}
    submitText="Register"
    loading={loading}
    onSubmit={handleRegister}
    footer={
      <p className="text-gray-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Login
        </Link>
      </p>
    }
  />
</div>

);
};

export default Register;
