import Button from "../common/Button";
import Input from "../common/Input";

const AuthForm = ({
title,
description,
fields = [],
submitText = "Submit",
onSubmit,
loading = false,
footer,
}) => {
const handleSubmit = (e) => {
e.preventDefault();

const formData = new FormData(e.target);
const data = Object.fromEntries(formData.entries());

onSubmit?.(data);

};

return ( <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4 py-8"> <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
{/* Header */} <div className="mb-6 text-center"> <h1 className="text-2xl font-bold text-gray-800">
{title} </h1>

      {description && (
        <p className="mt-2 text-sm text-gray-500">
          {description}
        </p>
      )}
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <Input
          key={field.name}
          name={field.name}
          label={field.label}
          type={field.type || "text"}
          placeholder={field.placeholder}
          required={field.required}
        />
      ))}

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? "Please wait..." : submitText}
      </Button>
    </form>

    {/* Footer */}
    {footer && (
      <div className="mt-6 text-center text-sm">
        {footer}
      </div>
    )}
  </div>
</div>

);
};

export default AuthForm;
