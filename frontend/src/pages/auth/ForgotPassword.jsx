import { Link } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm";

const ForgotPassword = () => {
  const fields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
    },
  ];

  const handleForgotPassword = (data) => {
    console.log("Forgot Password:", data);

    // Connect API later
  };

  return (
    <AuthForm
      title="Forgot Password"
      description="Enter your email to receive a password reset link"
      fields={fields}
      submitText="Send Reset Link"
      onSubmit={handleForgotPassword}
      footer={
        <Link
          to="/login"
          className="text-blue-600 hover:underline"
        >
          Back to Login
        </Link>
      }
    />
  );
};

export default ForgotPassword;