import AdminHeader from "../../../components/admin/AdminHeader";
import DocumentTable from "../../../components/admin/DocumentTable";

const Documents = () => {
  const documents = [
    {
      id: 1,
      name: "Tax Report.pdf",
      client: "Ahmed Mohamed",
      date: "Sep 08, 2026",
    },
    {
      id: 2,
      name: "Contract.pdf",
      client: "Sara Ali",
      date: "Sep 05, 2026",
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Documents"
        description="Manage client documents"
      />

      <DocumentTable documents={documents} />
    </div>
  );
};

export default Documents;