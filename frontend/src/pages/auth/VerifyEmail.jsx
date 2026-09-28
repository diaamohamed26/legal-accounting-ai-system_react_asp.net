import { Link, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const handleVerify = () => {
    console.log("Verify token:", token);

    // Connect API later
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl">
        ✉️
      </div>

      <h1 className="text-2xl font-bold text-gray-800">
        Verify Your Email
      </h1>

      <p className="mt-3 text-sm text-gray-500">
        Click the button below to verify your email address.
      </p>

      <Button
        onClick={handleVerify}
        className="mt-6 w-full"
      >
        Verify Email
      </Button>

      <p className="mt-5 text-sm text-gray-500">
        Already verified?{" "}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default VerifyEmail;