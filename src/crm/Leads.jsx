import { useState, useEffect } from "react";
import {
  FiPlus,
  FiUsers,
  FiPhone,
  FiCheckCircle,
  FiMail,
  FiUser,
  FiX,
} from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function LeadsBoard() {
  const API_URL = "https://core-sphere-backend.vercel.app/api/leads";

  const [columns, setColumns] = useState({
    newLeads: [],
    contacted: [],
    converted: [],
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newLead, setNewLead] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "",
    status: "newLeads",
    notes: "",
  });

  const columnsInfo = [
    {
      key: "newLeads",
      title: "New Leads",
      icon: <FiUsers />,
      color: "text-sky-600",
      border: "border-sky-200",
      bg: "bg-gradient-to-br from-sky-50 to-white",
    },
    {
      key: "contacted",
      title: "Contacted",
      icon: <FiPhone />,
      color: "text-amber-600",
      border: "border-amber-200",
      bg: "bg-gradient-to-br from-amber-50 to-white",
    },
    {
      key: "converted",
      title: "Converted",
      icon: <FiCheckCircle />,
      color: "text-emerald-600",
      border: "border-emerald-200",
      bg: "bg-gradient-to-br from-emerald-50 to-white",
    },
  ];

  // ✅ 1. Get all leads from backend
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data.success) setColumns(data.leads);
      } catch (err) {
        console.error("Error fetching leads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // ✅ 2. Add a new lead (POST)
  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
      const data = await res.json();

      if (data.success) {
        setColumns((prev) => ({
          ...prev,
          [newLead.status]: [...prev[newLead.status], data.lead],
        }));
      } else {
        alert("Failed to add lead: " + data.message);
      }
    } catch (err) {
      console.error("Error adding lead:", err);
    }

    setIsDrawerOpen(false);
    setNewLead({
      name: "",
      company: "",
      email: "",
      phone: "",
      source: "",
      status: "newLeads",
      notes: "",
    });
  };

  // ✅ 3. Move lead to another column (PATCH /move)
  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const start = source.droppableId;
    const end = destination.droppableId;
    const dragged = columns[start][source.index];
    if (!dragged) return;

    if (start === end) {
      const newItems = Array.from(columns[start]);
      newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, dragged);
      setColumns({ ...columns, [start]: newItems });
    } else {
      // Local update
      const startItems = Array.from(columns[start]);
      startItems.splice(source.index, 1);
      const endItems = Array.from(columns[end]);
      endItems.splice(destination.index, 0, dragged);
      setColumns({ ...columns, [start]: startItems, [end]: endItems });

      // Backend update
      try {
        await fetch(`${API_URL}/${dragged._id || dragged.id}/move`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: end }),
        });
      } catch (err) {
        console.error("Error moving lead:", err);
      }
    }
  };

  // ✅ 4. Delete Lead (optional feature)
  const handleDeleteLead = async (leadId, columnKey) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await fetch(`${API_URL}/${leadId}`, { method: "DELETE" });
      setColumns((prev) => ({
        ...prev,
        [columnKey]: prev[columnKey].filter((lead) => lead._id !== leadId),
      }));
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  // 🧱 UI Rendering
  return (
    <div className="relative p-8 bg-gradient-to-b from-indigo-50 to-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-extrabold text-indigo-900 tracking-tight">
            Leads Kanban Board
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track all leads through sales stages.
          </p>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md transition"
        >
          <FiPlus size={16} />
          Add Lead
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-gray-500 italic">Loading leads...</p>
      )}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columnsInfo.map((col) => (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${col.bg} rounded-2xl border ${col.border} p-4 shadow-sm min-h-[400px] transition-all duration-300 ${
                    snapshot.isDraggingOver
                      ? "ring-2 ring-sky-400 shadow-lg scale-[1.02]"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`font-semibold ${col.color} flex items-center gap-2 text-lg`}
                    >
                      {col.icon}
                      {col.title}
                    </h3>
                    <span className="text-xs bg-white text-gray-600 px-2 py-1 rounded-full shadow-sm border border-gray-200">
                      {columns[col.key]?.length || 0} Leads
                    </span>
                  </div>

                  <div className="space-y-3">
                    {columns[col.key]?.map((lead, index) => (
                      <Draggable
                        key={lead._id || lead.id}
                        draggableId={lead._id || lead.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm cursor-grab transition-all group ${
                              snapshot.isDragging
                                ? "rotate-[1deg] scale-[1.05] shadow-2xl ring-2 ring-sky-300"
                                : "hover:shadow-md hover:translate-y-[-2px]"
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                              transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-semibold text-gray-800 flex items-center gap-2">
                                  <FiUser className="text-sky-500" /> {lead.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {lead.company || "—"}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  handleDeleteLead(lead._id || lead.id, col.key)
                                }
                                className="text-gray-400 hover:text-red-500 transition"
                              >
                                <FiX size={14} />
                              </button>
                            </div>

                            <div className="text-xs text-gray-500">
                              <div className="flex items-center gap-2 mb-1">
                                <FiMail className="text-sky-500" />
                                {lead.email || "No email"}
                              </div>
                              <div className="flex items-center gap-2">
                                <FiPhone className="text-emerald-500" />
                                {lead.phone || "No phone"}
                              </div>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-all mt-3 flex justify-end">
                              <button className="text-xs px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg border border-sky-200 shadow-sm transition">
                                View Details
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columns[col.key]?.length === 0 && (
                      <p className="text-center text-gray-400 text-sm py-6 italic">
                        Drop leads here
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[440px] bg-white shadow-2xl rounded-l-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5 bg-sky-50">
          <h2 className="text-xl font-bold text-sky-900 flex items-center gap-2">
            <FiUser className="text-sky-600" /> Add New Lead
          </h2>
          <FiX
            className="text-gray-500 cursor-pointer hover:text-red-500 transition"
            size={22}
            onClick={() => setIsDrawerOpen(false)}
          />
        </div>

        <div className="p-6">
          <form onSubmit={handleAddLead} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Company
              </label>
              <input
                type="text"
                value={newLead.company}
                onChange={(e) =>
                  setNewLead({ ...newLead, company: e.target.value })
                }
                placeholder="Enter company name"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) =>
                    setNewLead({ ...newLead, email: e.target.value })
                  }
                  placeholder="e.g. ravi@company.com"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  pattern="[0-9]{10,15}"
                  value={newLead.phone}
                  onChange={(e) =>
                    setNewLead({ ...newLead, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
            </div>

            {/* Lead Source */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Lead Source
              </label>
              <select
                value={newLead.source}
                onChange={(e) =>
                  setNewLead({ ...newLead, source: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600 bg-white"
              >
                <option value="">Select Source</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Status
              </label>
              <select
                value={newLead.status}
                onChange={(e) =>
                  setNewLead({ ...newLead, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600 bg-white"
              >
                <option value="newLeads">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Notes
              </label>
              <textarea
                rows="3"
                maxLength={1000}
                value={newLead.notes}
                onChange={(e) =>
                  setNewLead({ ...newLead, notes: e.target.value })
                }
                placeholder="Add details or context about this lead..."
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600 resize-none"
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {newLead.notes?.length || 0}/1000 characters
              </p>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-bold transition shadow-lg"
            >
              Save Lead
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
