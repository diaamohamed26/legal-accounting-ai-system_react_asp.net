import Badge from "../common/Badge";

const TransactionCard = ({
  title,
  amount,
  date,
  type = "income",
  status = "Completed",
}) => {
  const isIncome = type === "income";

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>

        <p className="mt-1 text-sm text-gray-500">
          {date}
        </p>
      </div>

      <div className="text-right">
        <p
          className={`font-semibold ${
            isIncome ? "text-green-600" : "text-red-600"
          }`}
        >
          {isIncome ? "+" : "-"} ${amount}
        </p>

        <div className="mt-1">
          <Badge
            variant={status === "Completed" ? "success" : "warning"}
          >
            {status}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;