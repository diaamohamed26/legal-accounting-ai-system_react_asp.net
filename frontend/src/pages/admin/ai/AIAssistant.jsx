import { useState } from "react";
import { Bot, Send, Loader2, User, AlertCircle } from "lucide-react";
import api from "../../../services/api";

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    // Add user message immediately
    const userMessage = {
      type: "user",
      text: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/ai/chat", {
        message: trimmedMessage,
      });

      const aiMessage = {
        type: "ai",
        text:
          response.data?.message ||
          "Sorry, I couldn't generate a response.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Assistant Error:", error);

      let errorMessage =
        "Sorry, something went wrong. Please try again.";

      if (error.response?.status === 401) {
        errorMessage =
          "Your session has expired. Please login again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          text: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex h-[600px] flex-col overflow-hidden rounded-xl bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Bot size={22} className="text-blue-600" />
          </div>

          <div>
            <h1 className="font-semibold text-gray-900">
              AI Assistant
            </h1>

            <p className="text-sm text-gray-500">
              Legal Accounting Assistant
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Bot size={36} className="text-blue-600" />
              </div>

              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                How can I help?
              </h2>

              <p className="mt-2 max-w-md text-gray-500">
                Ask me about clients, invoices, expenses,
                transactions, accounting, or documents.
              </p>
            </div>
          )}

          {messages.map((item, index) => (
            <div
              key={index}
              className={`flex ${
                item.type === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] gap-3 ${
                  item.type === "user"
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    item.type === "user"
                      ? "bg-blue-600"
                      : item.type === "error"
                      ? "bg-red-100"
                      : "bg-blue-100"
                  }`}
                >
                  {item.type === "user" ? (
                    <User size={18} className="text-white" />
                  ) : item.type === "error" ? (
                    <AlertCircle
                      size={18}
                      className="text-red-600"
                    />
                  ) : (
                    <Bot
                      size={18}
                      className="text-blue-600"
                    />
                  )}
                </div>

                {/* Message */}
                <div
                  className={`rounded-xl px-4 py-3 ${
                    item.type === "user"
                      ? "bg-blue-600 text-white"
                      : item.type === "error"
                      ? "bg-red-50 text-red-700"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {item.text}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                  <Bot
                    size={18}
                    className="text-blue-600"
                  />
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3">
                  <Loader2
                    size={18}
                    className="animate-spin text-blue-600"
                  />

                  <span className="text-sm text-gray-500">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 border-t bg-white p-4"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            placeholder={
              loading
                ? "AI is thinking..."
                : "Ask AI something..."
            }
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="flex items-center justify-center rounded-lg bg-blue-600 px-5 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {loading ? (
              <Loader2
                size={20}
                className="animate-spin"
              />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
