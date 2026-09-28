import React, { useState } from "react";
import {
Mail,
Phone,
MapPin,
Send,
CheckCircle2,
AlertCircle,
Loader2,
} from "lucide-react";
import api from "../../services/api";

const Contact = () => {
const [form, setForm] = useState({
name: "",
email: "",
subject: "",
message: "",
});

const [submitted, setSubmitted] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleChange = (event) => {
const { name, value } = event.target;

setForm((current) => ({
  ...current,
  [name]: value,
}));

if (error) {
  setError("");
}

if (submitted) {
  setSubmitted(false);
}

};

const handleSubmit = async (event) => {
event.preventDefault();

setLoading(true);
setError("");
setSubmitted(false);

try {
  await api.post("/contact", {
    name: form.name.trim(),
    email: form.email.trim(),
    subject: form.subject.trim(),
    message: form.message.trim(),
  });

  setSubmitted(true);

  setForm({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
} catch (error) {
  console.error("Contact form error:", error);

  const responseMessage =
    error?.response?.data?.message;

  const validationErrors =
    error?.response?.data?.errors;

  if (responseMessage) {
    setError(responseMessage);
  } else if (validationErrors) {
    setError(
      "Please check the form fields and try again."
    );
  } else if (!error?.response) {
    setError(
      "Unable to connect to the server. Please try again."
    );
  } else {
    setError(
      "Something went wrong while sending your message."
    );
  }
} finally {
  setLoading(false);
}

};

return ( <div className="bg-gray-50">
{/* Hero */} <section className="bg-white"> <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8"> <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
Contact Us </span>

      <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
        Let's talk
      </h1>

      <p className="mt-5 text-lg text-gray-600">
        Have a question about Legal Accounting? Send us a
        message and our team will get back to you.
      </p>
    </div>
  </section>

  <section className="pb-20">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">

      {/* Contact Information */}
      <div className="rounded-2xl bg-blue-600 p-8 text-white">
        <h2 className="text-2xl font-bold">
          Contact Information
        </h2>

        <p className="mt-4 text-sm leading-6 text-blue-100">
          Reach out to us through any of the following
          channels.
        </p>

        <div className="mt-10 space-y-7">

          <div className="flex gap-4">
            <Mail
              className="mt-1 shrink-0"
              size={21}
            />

            <div>
              <p className="font-semibold">Email</p>

              <a
                href="mailto:support@legalaccounting.com"
                className="mt-1 block text-sm text-blue-100 transition hover:text-white"
              >
                support@legalaccounting.com
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <Phone
              className="mt-1 shrink-0"
              size={21}
            />

            <div>
              <p className="font-semibold">Phone</p>

              <a
                href="tel:+201000000000"
                className="mt-1 block text-sm text-blue-100 transition hover:text-white"
              >
                +20 100 000 0000
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <MapPin
              className="mt-1 shrink-0"
              size={21}
            />

            <div>
              <p className="font-semibold">Location</p>

              <p className="mt-1 text-sm text-blue-100">
                Cairo, Egypt
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 lg:col-span-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Send us a message
        </h2>

        {/* Success */}
        {submitted && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Message sent successfully
              </p>

              <p className="mt-1">
                Your message has been received. Our team
                will get back to you soon.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Message could not be sent
              </p>

              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          {/* Name + Email */}
          <div className="grid gap-5 sm:grid-cols-2">

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                maxLength={100}
                disabled={loading}
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                maxLength={150}
                disabled={loading}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="subject"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Subject
            </label>

            <input
              id="subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              required
              maxLength={200}
              disabled={loading}
              placeholder="How can we help?"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Message
            </label>

            <textarea
              id="message"
              name="message"
              rows={6}
              value={form.message}
              onChange={handleChange}
              required
              maxLength={5000}
              disabled={loading}
              placeholder="Write your message..."
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  </section>
</div>

);
};

export default Contact;
