import { BarChart3, Download } from "lucide-react";

import ClientHeader from "../../components/client/ClientHeader";
import Button from "../../components/common/Button";

const Reports = () => {
  const reports = [
    {
      id: 1,
      name: "Annual Financial Report",
      date: "Sep 01, 2026",
    },
    {
      id: 2,
      name: "Tax Report",
      date: "Aug 20, 2026",
    },
    {
      id: 3,
      name: "Transaction Report",
      date: "Aug 15, 2026",
    },
  ];

  return (
    <div>
      <ClientHeader
        title="Reports"
        description="View your financial reports"
      />

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <BarChart3 size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">
                  {report.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {report.date}
                </p>
              </div>
            </div>

            <Button variant="secondary">
              <span className="flex items-center gap-2">
                <Download size={16} />
                Download
              </span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;