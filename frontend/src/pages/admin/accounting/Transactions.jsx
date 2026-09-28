import AdminHeader from "../../../components/admin/AdminHeader";
import TransactionTable from "../../../components/admin/TransactionTable";

const Transactions = () => {
  const transactions = [
    {
      id: 1,
      description: "Client Payment",
      type: "Income",
      amount: "$2,000",
      date: "Sep 08, 2026",
    },
    {
      id: 2,
      description: "Office Rent",
      type: "Expense",
      amount: "$1,000",
      date: "Sep 05, 2026",
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Transactions"
        description="Manage financial transactions"
      />

      <TransactionTable transactions={transactions} />
    </div>
  );
};

export default Transactions;