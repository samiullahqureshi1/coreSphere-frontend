import { useState, useEffect } from "react";
import { FiPlus, FiMail, FiPhone, FiUser, FiGlobe, FiX, FiSearch } from "react-icons/fi";

export default function Clients() {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "BrightTech",
      email: "ravi@brighttech.com",
      phone: "+91 9876543210",
      industry: "Software",
      projects: 2,
      status: "Active",
      website: "https://brighttech.com",
    },
    {
      id: 2,
      name: "FinGrow",
      email: "sneha@fingrow.in",
      phone: "+91 9123456789",
      industry: "Finance",
      projects: 1,
      status: "Pending Renewal",
      website: "https://fingrow.in",
    },
  ]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    industry: "",
    website: "",
    status: "Active",
  });

  // Filter clients by search
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddClient = (e) => {
    e.preventDefault();
    const newEntry = { ...newClient, id: Date.now(), projects: 0 };
    setClients((prev) => [...prev, newEntry]);
    setIsDrawerOpen(false);
    setNewClient({
      name: "",
      email: "",
      phone: "",
      industry: "",
      website: "",
      status: "Active",
    });
  };

  return (
    <div className="p-8 bg-gradient-to-b from-indigo-50 to-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-indigo-900 tracking-tight">
            Clients Directory
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage all clients, contact details, and project associations.
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md transition"
        >
          <FiPlus size={16} />
          Add Client
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center border border-gray-200 bg-white px-3 py-2 rounded-xl w-72 shadow-sm mb-6 focus-within:ring-2 focus-within:ring-sky-600 transition">
        <FiSearch className="text-sky-600 mr-2" />
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Clients Table */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-indigo-100 text-indigo-800 font-semibold">
            <tr>
              <th className="p-3">Client Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Industry</th>
              <th className="p-3">Projects</th>
              <th className="p-3">Website</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="border-t hover:bg-sky-50 transition duration-150"
                >
                  <td className="p-3 font-semibold text-gray-800 flex items-center gap-2">
                    <FiUser className="text-sky-500" /> {client.name}
                  </td>
                  <td className="p-3 text-gray-700 flex items-center gap-2">
                    <FiMail className="text-sky-500" /> {client.email}
                  </td>
                  <td className="p-3 text-gray-700 flex items-center gap-2">
                    <FiPhone className="text-emerald-500" /> {client.phone}
                  </td>
                  <td className="p-3 text-gray-700">{client.industry}</td>
                  <td className="p-3 text-center font-semibold text-indigo-800">
                    {client.projects}
                  </td>
                  <td className="p-3 text-sky-700 hover:underline">
                    <a href={client.website} target="_blank" rel="noreferrer">
                      {client.website.replace("https://", "")}
                    </a>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        client.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : client.status === "Pending Renewal"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-8 italic"
                >
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl rounded-l-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5 bg-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900">Add New Client</h2>
          <FiX
            className="text-gray-500 cursor-pointer hover:text-red-500 transition"
            size={22}
            onClick={() => setIsDrawerOpen(false)}
          />
        </div>

        <div className="p-6">
          <form onSubmit={handleAddClient} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                placeholder="Enter company name"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="Enter client email"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="+91 90000 00000"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Industry
              </label>
              <input
                type="text"
                value={newClient.industry}
                onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                placeholder="e.g. Finance, Software, Marketing"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Website
              </label>
              <input
                type="url"
                value={newClient.website}
                onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
                placeholder="https://example.com"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Status
              </label>
              <select
                value={newClient.status}
                onChange={(e) => setNewClient({ ...newClient, status: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              >
                <option value="Active">Active</option>
                <option value="Pending Renewal">Pending Renewal</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-bold transition shadow-lg"
            >
              Save Client
            </button>
          </form>
        </div>
      </div>

      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        ></div>
      )}
    </div>
  );
}
