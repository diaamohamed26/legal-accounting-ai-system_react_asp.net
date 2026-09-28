const Card = ({ children, title, className = "" }) => {
  return (
    <div className={`rounded-xl bg-white p-5 shadow-sm ${className}`}>
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          {title}
        </h3>
      )}

      {children}
    </div>
  );
};

export default Card;