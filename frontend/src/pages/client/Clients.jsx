import {
Search,
User,
Mail,
Phone,
Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import ClientHeader from "../../components/client/ClientHeader";

const Clients = () => {
const [search, setSearch] = useState("");

const clients = [
{
id: 1,
name: "Ahmed Mohamed",
email: "[ahmed@example.com](mailto:ahmed@example.com)",
phone: "+20 100 123 4567",
status: "Active",
},
{
id: 2,
name: "Mohamed Ali",
email: "[mohamed@example.com](mailto:mohamed@example.com)",
phone: "+20 101 234 5678",
status: "Active",
},
{
id: 3,
name: "Omar Hassan",
email: "[omar@example.com](mailto:omar@example.com)",
phone: "+20 102 345 6789",
status: "Inactive",
},
{
id: 4,
name: "Mahmoud Ahmed",
email: "[mahmoud@example.com](mailto:mahmoud@example.com)",
phone: "+20 103 456 7890",
status: "Active",
},
];

const filteredClients = useMemo(() => {
const value = search.trim().toLowerCase();

```
if (!value) {
  return clients;
}

return clients.filter(
  (client) =>
    client.name.toLowerCase().includes(value) ||
    client.email.toLowerCase().includes(value) ||
    client.phone.includes(value)
);
```

}, [search]);

return ( <div className="space-y-6"> <ClientHeader
     title="Clients"
     description="View and manage your client information"
   />

  {/* Search */}
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="relative max-w-md">
      <Search
        size={19}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search clients..."
        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />
    </div>
  </div>

  {/* Clients */}
  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="border-b border-gray-200 px-5 py-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Clients
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {filteredClients.length} client
        {filteredClients.length !== 1 ? "s" : ""}
      </p>
    </div>

    {/* Desktop Table */}
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Client
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Email
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Phone
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Status
            </th>

            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredClients.map((client) => (
            <tr
              key={client.id}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <User size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {client.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Client #{client.id}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-5 py-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail size={15} />
                  {client.email}
                </div>
              </td>

              <td className="px-5 py-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone size={15} />
                  {client.phone}
                </div>
              </td>

              <td className="px-5 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    client.status === "Active"
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {client.status}
                </span>
              </td>

              <td className="px-5 py-4 text-right">
                <Link
                  to={`/client/clients/${client.id}`}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  <Eye size={16} />
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile Cards */}
    <div className="space-y-4 p-4 md:hidden">
      {filteredClients.map((client) => (
        <div
          key={client.id}
          className="rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <User size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {client.name}
                </h3>

                <p className="text-xs text-gray-500">
                  Client #{client.id}
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                client.status === "Active"
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {client.status}
            </span>
          </div>

          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mail size={15} />
              <span>{client.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone size={15} />
              <span>{client.phone}</span>
            </div>
          </div>

          <Link
            to={`/client/clients/${client.id}`}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Eye size={16} />
            View Client
          </Link>
        </div>
      ))}
    </div>

    {/* Empty State */}
    {filteredClients.length === 0 && (
      <div className="px-5 py-12 text-center">
        <User
          size={40}
          className="mx-auto text-gray-300"
        />

        <h3 className="mt-3 text-sm font-semibold text-gray-900">
          No clients found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Try changing your search criteria.
        </p>
      </div>
    )}
  </div>
</div>

);
};

export default Clients;
