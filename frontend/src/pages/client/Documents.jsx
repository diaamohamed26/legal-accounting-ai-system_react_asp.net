
import { useEffect, useState } from "react";
import ClientHeader from "../../components/client/ClientHeader";
import DocumentCard from "../../components/client/DocumentCard";
import api from "../../services/api";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/documents");

      setDocuments(response.data || []);
    } catch (err) {
      console.error("Error fetching documents:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load documents. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div>
      <ClientHeader
        title="Documents"
        description="Access your documents and files"
      />

      {loading && (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading documents...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={fetchDocuments}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && documents.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            No documents found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            You don't have any documents uploaded yet.
          </p>
        </div>
      )}

      {!loading && !error && documents.length > 0 && (
        <div className="space-y-4">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
