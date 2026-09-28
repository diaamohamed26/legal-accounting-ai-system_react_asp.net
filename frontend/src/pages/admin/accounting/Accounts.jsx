import AdminHeader from "../../../components/admin/AdminHeader";
import Card from "../../../components/common/Card";

const Accounts = () => {
  const accounts = [
    { id: 1, name: "Cash", balance: "$15,000" },
    { id: 2, name: "Bank Account", balance: "$35,000" },
    { id: 3, name: "Accounts Receivable", balance: "$8,500" },
  ];

  return (
    <div>
      <AdminHeader
        title="Accounts"
        description="Manage chart of accounts"
      />

      <div className="grid gap-5 md:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id}>
            <p className="text-sm text-gray-500">
              {account.name}
            </p>

            <p className="mt-2 text-2xl font-bold">
              {account.balance}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Accounts;