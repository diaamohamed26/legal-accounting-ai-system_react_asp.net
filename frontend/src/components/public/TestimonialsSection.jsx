import React from "react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Business Owner",
      role: "Small Business",
      text: "Having clients, invoices, and financial information organized in one place makes our daily workflow much easier.",
    },
    {
      name: "Accounting Professional",
      role: "Accounting",
      text: "The centralized approach makes it easier to keep track of transactions and important financial records.",
    },
    {
      name: "Legal Professional",
      role: "Professional Services",
      text: "A simple interface and organized financial information can make managing client operations much more efficient.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Customer Experience
          </span>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Built around simpler workflows
          </h2>

          <p className="mt-4 text-gray-600">
            A centralized platform can help teams keep important financial
            information organized and accessible.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-7"
            >
              <div className="flex gap-1 text-yellow-500">
                ★★★★★
              </div>

              <p className="mt-5 text-sm leading-7 text-gray-600">
                “{testimonial.text}”
              </p>

              <div className="mt-6 border-t border-gray-200 pt-5">
                <p className="font-semibold text-gray-900">
                  {testimonial.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
