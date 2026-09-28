import { useEffect, useState } from "react";
import {
User,
Mail,
Save,
CheckCircle2,
AlertCircle,
Loader2,
} from "lucide-react";

import ClientHeader from "../../components/client/ClientHeader";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import api from "../../services/api";

const Profile = () => {
const [form, setForm] = useState({
name: "",
email: "",
});

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [success, setSuccess] = useState("");
const [error, setError] = useState("");

useEffect(() => {
const fetchProfile = async () => {
try {
setLoading(true);
setError("");

    const response = await api.get("/auth/profile");

    const data = response?.data || {};

    setForm({
      name: data.name || "",
      email: data.email || "",
    });
  } catch (err) {
    console.error("Failed to fetch profile:", err);

    setError(
      err?.response?.data?.message ||
        "Failed to load your profile. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

fetchProfile();

}, []);

const handleChange = (e) => {
const { name, value } = e.target;

setForm((current) => ({
  ...current,
  [name]: value,
}));

setSuccess("");

if (error) {
  setError("");
}

};

const handleSubmit = async (e) => {
e.preventDefault();

setSaving(true);
setSuccess("");
setError("");

try {
  const response = await api.put("/auth/profile", {
    name: form.name.trim(),
    email: form.email.trim(),
  });

  const updatedUser = response?.data?.user;

  if (updatedUser) {
    setForm({
      name: updatedUser.name || "",
      email: updatedUser.email || "",
    });

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  }

  setSuccess(
    response?.data?.message ||
      "Profile updated successfully."
  );
} catch (err) {
  console.error("Failed to update profile:", err);

  setError(
    err?.response?.data?.message ||
      "Failed to update your profile. Please try again."
  );
} finally {
  setSaving(false);
}

};

if (loading) {
return ( <div className="space-y-6"> <ClientHeader
       title="Profile"
       description="Manage your account information"
     />

    <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col items-center gap-3">
        <Loader2
          size={30}
          className="animate-spin text-blue-600"
        />

        <p className="text-sm text-gray-500">
          Loading profile...
        </p>
      </div>
    </div>
  </div>
);

}

return ( <div className="space-y-6"> <ClientHeader
     title="Profile"
     description="Manage your account information"
   />

  <div className="max-w-2xl">
    <Card>
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <User size={26} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Account Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your personal account information.
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Success
            </p>

            <p className="mt-1">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-semibold">
              Something went wrong
            </p>

            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Input
          label="Full Name"
          name="name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={handleChange}
          disabled={saving}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          disabled={saving}
          required
        />

        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
          <div className="flex items-start gap-3">
            <Mail
              size={18}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div>
              <p className="text-sm font-medium text-blue-900">
                Email information
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                Your email is used to sign in to your
                account. Make sure you enter a valid
                email address.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-5">
          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  </div>
</div>

);
};

export default Profile;
