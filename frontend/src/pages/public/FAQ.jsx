import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Legal Accounting?",
      answer:
        "Legal Accounting is a centralized platform for managing clients, invoices, documents, transactions, accounting records, and reports.",
    },
    {
      question: "Who can use the platform?",
      answer:
        "The platform can be used by businesses, professionals, accounting teams, and organizations that need centralized financial management tools.",
    },
    {
      question: "Can I manage invoices?",
      answer:
        "Yes. Users can create and manage invoices and keep track of invoice information and status.",
    },
    {
      question: "Can I upload documents?",
      answer:
        "Yes. The platform provides document management functionality for organizing important files.",
    },
    {
      question: "Does the platform support different user roles?",
      answer:
        "Yes. The application is designed around role-based access, including separate administrative and client experiences.",
    },
    {
      question: "Is there an AI Assistant?",
      answer:
        "Yes. The platform includes an AI Assistant area designed to support interaction with financial workflows and information.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((current) =>
      current === index ? null : index
    );
  };

  return (
    <div className="bg-gray-50">
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            FAQ
          </span>

          <h1 className="mt-3 text-4xl font-bold text-gray-900 sm:text-5xl">
            Frequently Asked Questions
          </h1>

          <p className="mt-5 text-lg text-gray-600">
            Find answers to common questions about the platform.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-gray-900">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-gray-500 transition ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 px-6 py-5">
                      <p className="text-sm leading-7 text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
