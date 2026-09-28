const ClientStatCard = ({
title,
value,
icon: Icon,
description,
className = "",
}) => {
return (
<div
className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md ${className}`}
> <div className="flex items-start justify-between"> <div> <p className="text-sm font-medium text-gray-500">
{title} </p>

      <h3 className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </h3>

      {description && (
        <p className="mt-2 text-xs text-gray-500">
          {description}
        </p>
      )}
    </div>

    {Icon && (
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={22} />
      </div>
    )}
  </div>
</div>

);
};

export default ClientStatCard;
