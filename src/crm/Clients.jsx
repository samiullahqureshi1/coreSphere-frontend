import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiPlus,
  FiMail,
  FiPhone,
  FiUser,
  FiGlobe,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
} from "react-icons/fi";

export default function Clients() {
  const API_URL = "https://core-sphere-backend.vercel.app/api/leads";
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    totalProjects: 0,
  });

  // ✅ Fetch All Clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${API_URL}/getClients`);
        if (res.data.success) setClients(res.data.clients);
      } catch (err) {
        console.error("Error fetching clients:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // 🔍 Search Filter
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase())
  );

  // 🧱 Open Drawer for Add/Edit
  const openDrawer = (client = null) => {
    if (client) {
      setSelectedClient(client);
      setFormData(client);
    } else {
      setSelectedClient(null);
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
        totalProjects: 0,
      });
    }
    setIsDrawerOpen(true);
  };

  // ✅ Submit Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedClient) {
        await axios.put(`${API_URL}/${selectedClient._id}/updateClient`, formData);
      } else {
        await axios.post(`${API_URL}/addClient`, formData);
      }
      setIsDrawerOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Error saving client:", err);
    }
  };
  // 🗑 Open Delete Modal
  const openDeleteModal = (client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  // ✅ Confirm Delete
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedClient._id}/delteClient`);
      setIsDeleteModalOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-500">
        Loading clients...
      </div>
    );

  return (
    <div className="p-8 bg-gradient-to-b from-indigo-50 to-white rounded-2xl shadow-lg border border-gray-100 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-indigo-900">
            Clients Directory
          </h2>
          <p className="text-gray-500 text-sm">
            Manage all clients, contact details, and project associations.
          </p>
        </div>
        <button
          onClick={() => openDrawer()}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md transition"
        >
          <FiPlus size={16} /> Add Client
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center border border-gray-200 bg-white px-3 py-2 rounded-xl w-72 shadow-sm mb-6">
        <FiSearch className="text-sky-600 mr-2" />
        <input
          type="text"
          placeholder="Search clients..."
          className="w-full text-sm outline-none text-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
  <table className="w-full text-sm text-left border-collapse">
    <thead className="bg-indigo-100 text-indigo-800 font-semibold">
      <tr>
        <th className="p-3">Client Name</th>
        <th className="p-3">Company</th>
        <th className="p-3">Email</th>
        <th className="p-3">Phone</th>
        <th className="p-3">Address</th>
        <th className="p-3">Notes</th>
        <th className="p-3 text-center">Projects</th>
        <th className="p-3 text-right">Actions</th>
      </tr>
    </thead>

    <tbody>
  {filteredClients.length > 0 ? (
    filteredClients.map((client) => (
      <tr
        key={client._id}
        className="border-t hover:bg-sky-50 transition duration-150 align-top"
      >
        {/* 🧩 Client Name */}
        <td className="p-3 font-semibold text-gray-800">
          <div className="flex items-center gap-2">
            <FiUser className="text-sky-500 mt-[2px]" />
            {client.name || "—"}
          </div>
        </td>

        {/* 🧩 Company */}
        <td className="p-3 text-gray-700">{client.company || "—"}</td>

        {/* 🧩 Email */}
        <td className="p-3 text-gray-700">
          <div className="flex items-center gap-2">
            <FiMail className="text-sky-500 mt-[2px]" />
            <a
              href={`mailto:${client.email}`}
              className="hover:underline text-sky-700"
            >
              {client.email || "—"}
            </a>
          </div>
        </td>

        {/* 🧩 Phone */}
        <td className="p-3 text-gray-700">
          <div className="flex items-center gap-2">
            <FiPhone className="text-emerald-500 mt-[2px]" />
            {client.phone || "—"}
          </div>
        </td>

        {/* 🧩 Address */}
        <td className="p-3 text-gray-700">{client.address || "—"}</td>

        {/* 🧩 Notes */}
        <td className="p-3 text-gray-700 max-w-[240px] truncate">
          {client.notes || "—"}
        </td>

        {/* 🧩 Projects */}
        <td className="p-3 text-center font-semibold text-indigo-800">
          {client.totalProjects || 0}
        </td>

        {/* 🧩 Actions */}
        <td className="p-3 text-right">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => openDrawer(client)}
              className="text-sky-600 hover:text-sky-800"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={() => openDeleteModal(client)}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="8"
        className="text-center text-gray-500 py-8 italic"
      >
        No clients found.
      </td>
    </tr>
  )}
</tbody>

  </table>
</div>


      {/* Drawer (Add/Edit) */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl rounded-l-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5 bg-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900">
            {selectedClient ? "Edit Client" : "Add New Client"}
          </h2>
          <FiX
            className="text-gray-500 cursor-pointer hover:text-red-500"
            size={22}
            onClick={() => setIsDrawerOpen(false)}
          />
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {["name", "company", "email", "phone", "address", "notes"].map(
              (field) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-800 mb-1 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={formData[field] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    placeholder={`Enter ${field}`}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
              )
            )}

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-bold"
            >
              {selectedClient ? "Save Changes" : "Add Client"}
            </button>
          </form>
        </div>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-40">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-[380px] text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">
                {selectedClient?.name}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
