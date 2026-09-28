import { FileText, Download } from "lucide-react";

const DocumentCard = ({
  name,
  type,
  date,
  size,
  onDownload,
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-blue-50 p-3">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">
            {name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {type} • {size}
          </p>

          <p className="text-xs text-gray-400">
            {date}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onDownload}
        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
        title="Download"
      >
        <Download className="h-5 w-5" />
      </button>
    </div>
  );
};

export default DocumentCard;