import AdminHeader from "../../../components/admin/AdminHeader";
import Card from "../../../components/common/Card";

const Ledger = () => {
  return (
    <div>
      <AdminHeader
        title="General Ledger"
        description="View account ledger"
      />

      <Card>
        <div className="flex h-64 items-center justify-center text-gray-400">
          General ledger data will appear here
        </div>
      </Card>
    </div>
  );
};

export default Ledger;