const StatCard = ({ title, value, description, icon }) => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="mt-2 text-2xl font-bold text-gray-800">
            {value}
          </h2>

          {description && (
            <p className="mt-1 text-xs text-gray-400">
              {description}
            </p>
          )}
        </div>

        <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;