import { useState } from "react";
import {
  FiPlus,
  FiSend,
  FiUsers,
  FiTrendingUp,
  FiXCircle,
  FiFileText,
  FiDollarSign,
  FiUser,
} from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function ProposalsDeals() {
  const [columns, setColumns] = useState({
    proposals: [
      { id: "1", title: "Website Revamp", client: "BrightTech", value: 3000 },
      { id: "2", title: "CRM Integration", client: "FinGrow", value: 5000 },
    ],
    negotiation: [
      { id: "3", title: "Marketing Automation", client: "CodeNova", value: 2500 },
    ],
    won: [
      { id: "4", title: "SaaS Portal", client: "TechEase", value: 7500 },
    ],
    lost: [],
  });

  const columnsInfo = [
    {
      key: "proposals",
      title: "Proposal Sent",
      color: "text-sky-600",
      bg: "bg-sky-50",
      icon: <FiSend />,
    },
    {
      key: "negotiation",
      title: "In Negotiation",
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: <FiUsers />,
    },
    {
      key: "won",
      title: "Won Deals",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      icon: <FiTrendingUp />,
    },
    {
      key: "lost",
      title: "Lost Deals",
      color: "text-red-600",
      bg: "bg-red-50",
      icon: <FiXCircle />,
    },
  ];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: "",
    client: "",
    value: "",
    status: "proposals",
  });

  // Handle drag
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const start = source.droppableId;
    const end = destination.droppableId;

    const item = columns[start][source.index];
    if (start === end) {
      const newItems = Array.from(columns[start]);
      newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, item);
      setColumns({ ...columns, [start]: newItems });
    } else {
      const startItems = Array.from(columns[start]);
      startItems.splice(source.index, 1);
      const endItems = Array.from(columns[end]);
      endItems.splice(destination.index, 0, item);
      setColumns({ ...columns, [start]: startItems, [end]: endItems });
    }
  };

  const handleAddDeal = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now().toString(),
      title: newDeal.title,
      client: newDeal.client,
      value: parseFloat(newDeal.value),
    };

    setColumns((prev) => ({
      ...prev,
      [newDeal.status]: [...prev[newDeal.status], newEntry],
    }));

    setNewDeal({ title: "", client: "", value: "", status: "proposals" });
    setIsDrawerOpen(false);
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
            <FiFileText className="text-sky-600" /> Proposals & Deals
          </h2>
          <p className="text-gray-500 text-sm">
            Track proposals, negotiations, and deal outcomes.
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md transition"
        >
          <FiPlus size={16} />
          Add Deal
        </button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {columnsInfo.map((col) => (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${col.bg} rounded-2xl border border-gray-200 p-4 shadow-sm min-h-[400px] transition-all ${
                    snapshot.isDraggingOver
                      ? "ring-2 ring-sky-400 shadow-lg scale-[1.02]"
                      : ""
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`font-semibold ${col.color} flex items-center gap-2 text-lg`}
                    >
                      {col.icon}
                      {col.title}
                    </h3>
                    <span className="text-xs bg-white text-gray-600 px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                      {columns[col.key].length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3">
                    {columns[col.key].map((deal, index) => (
                      <Draggable
                        key={deal.id}
                        draggableId={deal.id}
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
                          >
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-semibold text-gray-800">
                                {deal.title}
                              </h4>
                              <span className="text-sm font-bold text-indigo-700 flex items-center gap-1">
                                <FiDollarSign />${deal.value.toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <FiUser className="text-sky-500" />
                              {deal.client}
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columns[col.key].length === 0 && (
                      <p className="text-center text-gray-400 text-sm py-6 italic">
                        Drop deals here
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Add Deal Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl rounded-l-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5 bg-sky-50">
          <h2 className="text-xl font-bold text-sky-900">Add New Deal</h2>
          <FiXCircle
            className="text-gray-500 cursor-pointer hover:text-red-500 transition"
            size={22}
            onClick={() => setIsDrawerOpen(false)}
          />
        </div>

        <div className="p-6">
          <form onSubmit={handleAddDeal} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Proposal Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newDeal.title}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, title: e.target.value })
                }
                placeholder="Enter proposal or deal title"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={newDeal.client}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, client: e.target.value })
                }
                placeholder="Enter client name"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Deal Value (USD)
              </label>
              <input
                type="number"
                value={newDeal.value}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, value: e.target.value })
                }
                placeholder="Enter estimated value"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
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
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              >
                <option value="proposals">Proposal Sent</option>
                <option value="negotiation">In Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-bold transition shadow-lg"
            >
              Save Deal
            </button>
          </form>
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        ></div>
      )}
    </div>
  );
}
