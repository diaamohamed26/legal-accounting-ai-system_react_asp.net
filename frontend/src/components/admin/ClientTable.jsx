import { useMemo, useState } from "react";
import {
Search,
Eye,
Pencil,
Trash2,
User,
Mail,
Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

const ClientTable = ({ clients = [], onDelete }) => {
const [search, setSearch] = useState("");
const [status, setStatus] = useState("All");

const filteredClients = useMemo(() => {
return clients.filter((client) => {
const name = client.name || client.fullName || "";
const email = client.email || "";
const phone = client.phone || "";
const clientStatus = client.status || "Active";

  const searchValue = search.toLowerCase();

  const matchesSearch =
    name.toLowerCase().includes(searchValue) ||
    email.toLowerCase().includes(searchValue) ||
    phone.toLowerCase().includes(searchValue);

  const matchesStatus =
    status === "All" || clientStatus === status;

  return matchesSearch && matchesStatus;
});

}, [clients, search, status]);

const handleDelete = (id) => {
if (window.confirm("Are you sure you want to delete this client?")) {
onDelete?.(id);
}
};

return ( <div className="w-full">
{/* Filters */} <div className="flex flex-col gap-4 border-b border-gray-200 p-4 md:flex-row md:items-center md:justify-between">
{/* Search */} <div className="relative w-full md:max-w-md"> <Search
         size={19}
         className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
       />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search clients..."
        className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {/* Status */}
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    >
      <option value="All">All Status</option>
      <option value="Active">Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  </div>

  {/* Desktop Table */}
  <div className="hidden overflow-x-auto md:block">
    <table className="w-full text-left">
      <thead className="bg-gray-50">
        <tr className="border-b border-gray-200">
          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Client
          </th>

          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Contact
          </th>

          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Status
          </th>

          <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => {
            const name =
              client.name || client.fullName || "Unnamed Client";

            const email = client.email || "No email";
            const phone = client.phone || "No phone";
            const clientStatus = client.status || "Active";

            return (
              <tr
                key={client.id}
                className="transition hover:bg-gray-50"
              >
                {/* Client */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <User size={19} />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {name}
                      </p>

                      {client.company && (
                        <p className="text-xs text-gray-500">
                          {client.company}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-6 py-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={14} />
                      {email}
                    </div>

                    <div className="flex items-center gap-2 text-gray-500">
                      <Phone size={14} />
                      {phone}
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      clientStatus === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {clientStatus}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/admin/clients/${client.id}`}
                      title="View client"
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={18} />
                    </Link>

                    <Link
                      to={`/admin/clients/${client.id}/edit`}
                      title="Edit client"
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-yellow-50 hover:text-yellow-600"
                    >
                      <Pencil size={18} />
                    </Link>

                    <button
                      type="button"
                      title="Delete client"
                      onClick={() => handleDelete(client.id)}
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan="4"
              className="px-6 py-12 text-center"
            >
              <div className="flex flex-col items-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <User className="text-gray-400" size={22} />
                </div>

                <h3 className="font-semibold text-gray-900">
                  No clients found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or status filter.
                </p>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Mobile Cards */}
  <div className="space-y-3 p-4 md:hidden">
    {filteredClients.length > 0 ? (
      filteredClients.map((client) => {
        const name =
          client.name || client.fullName || "Unnamed Client";

        const email = client.email || "No email";
        const phone = client.phone || "No phone";
        const clientStatus = client.status || "Active";

        return (
          <div
            key={client.id}
            className="rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {name}
                  </h3>

                  {client.company && (
                    <p className="text-xs text-gray-500">
                      {client.company}
                    </p>
                  )}
                </div>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  clientStatus === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {clientStatus}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={15} />
                {email}
              </div>

              <div className="flex items-center gap-2">
                <Phone size={15} />
                {phone}
              </div>
            </div>

            <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
              <Link
                to={`/admin/clients/${client.id}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                <Eye size={16} />
                View
              </Link>

              <Link
                to={`/admin/clients/${client.id}/edit`}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100"
              >
                <Pencil size={16} />
                Edit
              </Link>

              <button
                type="button"
                onClick={() => handleDelete(client.id)}
                className="flex items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })
    ) : (
      <div className="py-10 text-center">
        <User className="mx-auto text-gray-400" size={30} />
        <p className="mt-2 font-medium text-gray-700">
          No clients found
        </p>
      </div>
    )}
  </div>
</div>

);
};

export default ClientTable;
