import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      description: "For individuals getting started.",
      price: "$19",
      features: [
        "Client management",
        "Invoice management",
        "Document management",
        "Basic reports",
      ],
    },
    {
      name: "Professional",
      description: "For growing businesses.",
      price: "$49",
      popular: true,
      features: [
        "Everything in Starter",
        "Advanced reports",
        "Accounting management",
        "Transaction tracking",
        "Priority support",
      ],
    },
    {
      name: "Business",
      description: "For larger teams and operations.",
      price: "$99",
      features: [
        "Everything in Professional",
        "Multiple users",
        "Advanced document management",
        "AI Assistant",
        "Enhanced support",
      ],
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Pricing
          </span>

          <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple plans for different needs
          </h1>

          <p className="mt-5 text-lg text-gray-600">
            Choose a plan based on the features and workflows your
            organization needs.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-white p-8 ${
                plan.popular
                  ? "border-blue-500 shadow-xl"
                  : "border-gray-200 shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-6 top-6 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Popular
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-900">
                {plan.name}
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                {plan.description}
              </p>

              <div className="mt-7">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>

                <span className="text-sm text-gray-500">
                  /month
                </span>
              </div>

              <Link
                to="/register"
                className={`mt-7 block rounded-lg px-5 py-3 text-center text-sm font-semibold transition ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Get Started
              </Link>

              <div className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-3"
                  >
                    <Check
                      size={18}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <span className="text-sm text-gray-600">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Pricing;
