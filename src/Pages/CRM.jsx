import { useState } from "react";
import Sidebar from "../component/Sidebar";
import {
  FiList,
  FiBarChart2,
  FiPlus,
  FiUpload,
  FiMoreVertical,
} from "react-icons/fi";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

export default function CRM() {
  const [activeTab, setActiveTab] = useState("pipeline");

  const [pipeline, setPipeline] = useState({
    Qualification: [
      {
        id: "1",
        title: "SaaS Platform License",
        company: "Tech Solutions LLC",
        amount: "$50,000",
        rep: "Alice Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
    ],
    "Needs Analysis": [
      {
        id: "2",
        title: "Enterprise Security Package",
        company: "Global Corp",
        amount: "$75,000",
        rep: "Diana Miller",
        avatar: "https://randomuser.me/api/portraits/men/47.jpg",
      },
    ],
    Proposal: [
      {
        id: "3",
        title: "Website Redesign Project",
        company: "Creative Minds",
        amount: "$15,000",
        rep: "Alice Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
    ],
    Negotiation: [
      {
        id: "4",
        title: "API Development Contract",
        company: "Data Systems",
        amount: "$40,000",
        rep: "Diana Miller",
        avatar: "https://randomuser.me/api/portraits/men/47.jpg",
      },
    ],
    "Closed-Won": [
      {
        id: "5",
        title: "Hosting Renewal",
        company: "BlueSky Tech",
        amount: "$25,000",
        rep: "Alice Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        id: "6",
        title: "Support Contract",
        company: "NextGen Solutions",
        amount: "$30,000",
        rep: "Diana Miller",
        avatar: "https://randomuser.me/api/portraits/men/47.jpg",
      },
    ],
  });

  const leads = [
    {
      name: "Malik Rehan",
      company: "asdf",
      email: "malikrehan@tabontech.com",
      phone: "03325234579",
      status: "New",
      color: "bg-blue-100 text-blue-700",
      owner: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Samiullah Qureshi",
      company: "CoreDesk",
      email: "samiullahqureshi669@gmail.com",
      phone: "316005492",
      status: "New",
      color: "bg-blue-100 text-blue-700",
      owner: "Diana Miller",
      avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    },
    {
      name: "John Smith",
      company: "Acme Corp",
      email: "john@acme.com",
      phone: "555-1234",
      status: "New",
      color: "bg-blue-100 text-blue-700",
      owner: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Jane Doe",
      company: "Beta Solutions",
      email: "jane@beta.com",
      phone: "555-5678",
      status: "Contacted",
      color: "bg-cyan-100 text-cyan-700",
      owner: "Diana Miller",
      avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    },
    {
      name: "Peter Jones",
      company: "Gamma Tech",
      email: "peter@gamma.com",
      phone: "555-8765",
      status: "Qualified",
      color: "bg-green-100 text-green-700",
      owner: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Mary Johnson",
      company: "Delta Industries",
      email: "mary@delta.com",
      phone: "555-4321",
      status: "Lost",
      color: "bg-red-100 text-red-700",
      owner: "Diana Miller",
      avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    },
    {
      name: "David Lee",
      company: "Epsilon Services",
      email: "david@epsilon.com",
      phone: "555-9999",
      status: "New",
      color: "bg-blue-100 text-blue-700",
      owner: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ];

  // Drag-and-drop functionality
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    const draggedItem = pipeline[sourceCol][source.index];

    const newSource = Array.from(pipeline[sourceCol]);
    newSource.splice(source.index, 1);

    const newDest = Array.from(pipeline[destCol]);
    newDest.splice(destination.index, 0, draggedItem);

    setPipeline({
      ...pipeline,
      [sourceCol]: newSource,
      [destCol]: newDest,
    });
  };

  const getTotal = (col) => {
    return pipeline[col]
      .reduce((acc, item) => acc + parseInt(item.amount.replace(/[^0-9]/g, "")), 0)
      .toLocaleString();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-white px-6 py-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">CRM</h1>
            <p className="text-gray-500 text-sm">
              Manage your leads and sales pipeline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition">
              <FiUpload size={16} />
              Import Leads
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
              <FiPlus size={16} />
              Add Lead
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("pipeline")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "pipeline"
                  ? "bg-white border border-gray-300 shadow-sm"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FiBarChart2 size={16} />
              Sales Pipeline
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "leads"
                  ? "bg-white border border-gray-300 shadow-sm"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FiList size={16} />
              Leads
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6 flex-1 overflow-x-auto overflow-y-auto">
          {activeTab === "pipeline" ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex gap-6 min-w-[1200px] pb-4">
                {Object.keys(pipeline).map((colKey) => (
                  <Droppable droppableId={colKey} key={colKey}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="w-72 flex-shrink-0"
                      >
                        {/* Column Header */}
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="text-gray-800 font-semibold text-sm flex items-center gap-2">
                            {colKey}
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                              {pipeline[colKey].length}
                            </span>
                          </h3>
                          <span className="text-gray-500 text-sm font-medium">
                            ${getTotal(colKey)}
                          </span>
                        </div>

                        <div className="border-t border-gray-200 mt-1 mb-3"></div>

                        {/* Cards */}
                        <div className="flex flex-col gap-3">
                          {pipeline[colKey].map((lead, i) => (
                            <Draggable
                              draggableId={lead.id}
                              index={i}
                              key={lead.id}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition ${
                                    snapshot.isDragging
                                      ? "ring-2 ring-blue-300 shadow-lg"
                                      : ""
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h4 className="text-gray-800 font-semibold text-sm">
                                        {lead.title}
                                      </h4>
                                      <p className="text-gray-500 text-xs">
                                        {lead.company}
                                      </p>
                                    </div>
                                    <FiMoreVertical
                                      className="text-gray-400"
                                      size={16}
                                    />
                                  </div>

                                  <div className="flex justify-between items-center mt-2">
                                    <p className="text-green-600 font-semibold text-sm">
                                      {lead.amount}
                                    </p>
                                    <img
                                      src={lead.avatar}
                                      alt={lead.rep}
                                      className="w-7 h-7 rounded-full object-cover"
                                    />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          ) : (
            // === LEADS TABLE ===
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Owner
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {leads.map((lead, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {lead.company}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>{lead.email}</div>
                        <div className="text-xs text-gray-400">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${lead.color}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <img
                          src={lead.avatar}
                          alt={lead.owner}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-700">
                          {lead.owner}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
