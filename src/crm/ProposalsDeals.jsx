import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiPlus,
  FiSend,
  FiUsers,
  FiTrendingUp,
  FiXCircle,
  FiFileText,
  FiDollarSign,
  FiUser,
  FiMessageSquare,
  FiTrash2,
  FiEdit2,
  FiX,
} from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function ProposalsDeals() {
  const API_URL = "https://core-sphere-backend.vercel.app/api/leads";

  const [columns, setColumns] = useState({
    proposals: [],
    negotiation: [],
    won: [],
    lost: [],
  });

  const [loading, setLoading] = useState(true);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedDeal, setSelectedDeal] = useState(null);
  const [dealToDelete, setDealToDelete] = useState(null);

  const [newDeal, setNewDeal] = useState({
    title: "",
    clientName: "",
    amount: "",
    status: "Proposal Sent",
    notes: "",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    clientName: "",
    amount: "",
    status: "",
    notes: "",
  });

  // ✅ Fetch all deals
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axios.get(`${API_URL}/getDeals`);
        if (res.data.success) {
          const deals = res.data.deals;
          const grouped = {
            proposals: deals
              .filter((d) => d.status?.toLowerCase().includes("proposal"))
              .map((d) => ({
                id: d._id,
                title: d.title,
                client: d.clientName || d.leadId?.name || "Unknown Client",
                value: d.amount || 0,
                notes: d.notes || "",
                status: d.status,
              })),
            negotiation: deals
              .filter((d) => d.status?.toLowerCase().includes("negotiation"))
              .map((d) => ({
                id: d._id,
                title: d.title,
                client: d.clientName || d.leadId?.name || "Unknown Client",
                value: d.amount || 0,
                notes: d.notes || "",
                status: d.status,
              })),
            won: deals
              .filter((d) => d.status?.toLowerCase().includes("won"))
              .map((d) => ({
                id: d._id,
                title: d.title,
                client: d.clientName || d.leadId?.name || "Unknown Client",
                value: d.amount || 0,
                notes: d.notes || "",
                status: d.status,
              })),
            lost: deals
              .filter((d) => d.status?.toLowerCase().includes("lost"))
              .map((d) => ({
                id: d._id,
                title: d.title,
                client: d.clientName || d.leadId?.name || "Unknown Client",
                value: d.amount || 0,
                notes: d.notes || "",
                status: d.status,
              })),
          };
          setColumns(grouped);
        }
      } catch (err) {
        console.error("Error fetching deals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  // ✅ Drag/Drop → Move deal status
  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const start = source.droppableId;
    const end = destination.droppableId;
    const item = columns[start][source.index];
    if (!item) return;

    const startItems = Array.from(columns[start]);
    startItems.splice(source.index, 1);
    const endItems = Array.from(columns[end]);
    endItems.splice(destination.index, 0, item);
    setColumns({ ...columns, [start]: startItems, [end]: endItems });

    const newStatus =
      end === "proposals"
        ? "Proposal Sent"
        : end === "negotiation"
        ? "In Negotiation"
        : end === "won"
        ? "Won"
        : "Lost";

    try {
      await axios.patch(`${API_URL}/${item.id}/Deal`, { status: newStatus });
    } catch (err) {
      console.error("Error moving deal:", err);
    }
  };

  // ✏️ Open Edit Drawer
  const openEditDrawer = (deal) => {
    setSelectedDeal(deal);
    setEditForm({
      title: deal.title,
      clientName: deal.client,
      amount: deal.value,
      status: deal.status,
      notes: deal.notes,
    });
    setIsEditDrawerOpen(true);
  };

  // ✅ Save Edited Deal
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: editForm.title,
        clientName: editForm.clientName,
        amount: parseFloat(editForm.amount) || 0,
        status: editForm.status,
        notes: editForm.notes,
      };
      await axios.put(`${API_URL}/${selectedDeal.id}/editDeals`, payload);
      setIsEditDrawerOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Error editing deal:", err);
    }
  };

  // ➕ Open Add Drawer
  const openAddDrawer = () => {
    setIsAddDrawerOpen(true);
  };

  // ✅ Add Deal
  const handleAddDeal = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: newDeal.title,
        clientName: newDeal.clientName,
        amount: parseFloat(newDeal.amount) || 0,
        status: newDeal.status,
        notes: newDeal.notes,
      };
      await axios.post(`${API_URL}/addDeals`, payload);
      setIsAddDrawerOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Error adding deal:", err);
    }
  };

  // 🗑 Open Delete Modal
  const openDeleteModal = (deal) => {
    setDealToDelete(deal);
    setIsDeleteModalOpen(true);
  };

  // ✅ Confirm Delete
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${dealToDelete.id}/deleteDeals`);
      setIsDeleteModalOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Error deleting deal:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-500">
        Loading deals...
      </div>
    );

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
          <FiFileText className="text-sky-600" /> Proposals & Deals
        </h2>
        <button
          onClick={openAddDrawer}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md"
        >
          <FiPlus size={16} /> Add Deal
        </button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.keys(columns).map((key) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 rounded-xl border border-gray-200 p-4 min-h-[400px]"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-700 capitalize">
                      {key}
                    </h3>
                    <span className="text-xs bg-white px-2 py-1 rounded-full border text-gray-600">
                      {columns[key].length}
                    </span>
                  </div>

                  {columns[key].map((deal, index) => (
                    <Draggable
                      key={deal.id}
                      draggableId={deal.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white rounded-xl border border-gray-200 p-4 mb-3 shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-800">
                              {deal.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditDrawer(deal)}
                                className="text-sky-600 hover:text-sky-800"
                              >
                                <FiEdit2 size={15} />
                              </button>
                              <button
                                onClick={() => openDeleteModal(deal)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FiTrash2 size={15} />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                            <FiUser className="text-sky-500" />
                            {deal.client}
                          </p>
                          {deal.notes && (
                            <p className="text-xs text-gray-500 flex items-start gap-2">
                              <FiMessageSquare className="text-gray-400 mt-0.5" />
                              {deal.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* ➕ Add Deal Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl rounded-l-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isAddDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5 bg-sky-50">
          <h2 className="text-xl font-bold text-sky-900 flex items-center gap-2">
            <FiPlus /> Add New Deal
          </h2>
          <FiX
            className="text-gray-500 cursor-pointer hover:text-red-500 transition"
            size={22}
            onClick={() => setIsAddDrawerOpen(false)}
          />
        </div>

        <div className="p-6">
          <form onSubmit={handleAddDeal} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newDeal.title}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={newDeal.clientName}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, clientName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={newDeal.amount}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, amount: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Status
              </label>
              <select
                value={newDeal.status}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
              >
                <option>Proposal Sent</option>
                <option>In Negotiation</option>
                <option>Won</option>
                <option>Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Notes
              </label>
              <textarea
                rows="3"
                value={newDeal.notes}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, notes: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-bold text-sm"
            >
              Save Deal
            </button>
          </form>
        </div>
      </div>

      {/* ✏️ Edit Deal Drawer (same style) */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl rounded-l-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isEditDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5 bg-sky-50">
          <h2 className="text-xl font-bold text-sky-900 flex items-center gap-2">
            <FiEdit2 /> Edit Deal
          </h2>
          <FiX
            className="text-gray-500 cursor-pointer hover:text-red-500 transition"
            size={22}
            onClick={() => setIsEditDrawerOpen(false)}
          />
        </div>

        <div className="p-6">
          <form onSubmit={handleSaveEdit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Title
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={editForm.clientName}
                onChange={(e) =>
                  setEditForm({ ...editForm, clientName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm({ ...editForm, amount: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Status
              </label>
              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
              >
                <option>Proposal Sent</option>
                <option>In Negotiation</option>
                <option>Won</option>
                <option>Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Notes
              </label>
              <textarea
                rows="3"
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm({ ...editForm, notes: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-600 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-bold text-sm"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>

      {/* 🗑 Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[380px] text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">
                {dealToDelete?.title}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium"
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
