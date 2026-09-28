import { Link, useSearchParams } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const fields = [
    {
      name: "password",
      label: "New Password",
      type: "password",
      placeholder: "Enter your new password",
      required: true,
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm your new password",
      required: true,
    },
  ];

  const handleResetPassword = (data) => {
    console.log("Token:", token);
    console.log("Reset Password:", data);

    // Connect API later
  };

  return (
    <AuthForm
      title="Reset Password"
      description="Create a new password for your account"
      fields={fields}
      submitText="Reset Password"
      onSubmit={handleResetPassword}
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

export default ResetPassword;