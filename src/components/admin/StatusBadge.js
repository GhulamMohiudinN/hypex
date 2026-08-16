export default function StatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-[11px] uppercase tracking-wide px-2.5 py-1 font-medium ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}
