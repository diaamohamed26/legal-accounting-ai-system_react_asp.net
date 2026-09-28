import ClientHeader from "../../components/client/ClientHeader";
import TransactionCard from "../../components/client/TransactionCard";

const Transactions = () => {
  const transactions = [
    {
      id: 1,
      description: "Invoice Payment",
      date: "Sep 08, 2026",
      amount: "2,000",
      type: "Income",
    },
    {
      id: 2,
      description: "Legal Service",
      date: "Sep 05, 2026",
      amount: "500",
      type: "Expense",
    },
    {
      id: 3,
      description: "Invoice Payment",
      date: "Sep 01, 2026",
      amount: "1,500",
      type: "Income",
    },
  ];

  return (
    <div>
      <ClientHeader
        title="Transactions"
        description="View your financial transactions"
      />

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </div>
    </div>
  );
};

export default Transactions;