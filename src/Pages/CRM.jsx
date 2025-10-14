// import { useState } from "react";
// import Sidebar from "../component/Sidebar";
// import {
//   FiList,
//   FiBarChart2,
//   FiPlus,
//   FiUpload,
//   FiMoreVertical,
// } from "react-icons/fi";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
// } from "@hello-pangea/dnd";

// export default function CRM() {
//   const [activeTab, setActiveTab] = useState("pipeline");

//   const [pipeline, setPipeline] = useState({
//     Qualification: [
//       {
//         id: "1",
//         title: "SaaS Platform License",
//         company: "Tech Solutions LLC",
//         amount: "$50,000",
//         rep: "Alice Johnson",
//         avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//       },
//     ],
//     "Needs Analysis": [
//       {
//         id: "2",
//         title: "Enterprise Security Package",
//         company: "Global Corp",
//         amount: "$75,000",
//         rep: "Diana Miller",
//         avatar: "https://randomuser.me/api/portraits/men/47.jpg",
//       },
//     ],
//     Proposal: [
//       {
//         id: "3",
//         title: "Website Redesign Project",
//         company: "Creative Minds",
//         amount: "$15,000",
//         rep: "Alice Johnson",
//         avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//       },
//     ],
//     Negotiation: [
//       {
//         id: "4",
//         title: "API Development Contract",
//         company: "Data Systems",
//         amount: "$40,000",
//         rep: "Diana Miller",
//         avatar: "https://randomuser.me/api/portraits/men/47.jpg",
//       },
//     ],
//     "Closed-Won": [
//       {
//         id: "5",
//         title: "Hosting Renewal",
//         company: "BlueSky Tech",
//         amount: "$25,000",
//         rep: "Alice Johnson",
//         avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//       },
//       {
//         id: "6",
//         title: "Support Contract",
//         company: "NextGen Solutions",
//         amount: "$30,000",
//         rep: "Diana Miller",
//         avatar: "https://randomuser.me/api/portraits/men/47.jpg",
//       },
//     ],
//   });

//   const leads = [
//     {
//       name: "Malik Rehan",
//       company: "asdf",
//       email: "malikrehan@tabontech.com",
//       phone: "03325234579",
//       status: "New",
//       color: "bg-blue-100 text-blue-700",
//       owner: "Alice Johnson",
//       avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//     },
//     {
//       name: "Samiullah Qureshi",
//       company: "CoreDesk",
//       email: "samiullahqureshi669@gmail.com",
//       phone: "316005492",
//       status: "New",
//       color: "bg-blue-100 text-blue-700",
//       owner: "Diana Miller",
//       avatar: "https://randomuser.me/api/portraits/women/47.jpg",
//     },
//     {
//       name: "John Smith",
//       company: "Acme Corp",
//       email: "john@acme.com",
//       phone: "555-1234",
//       status: "New",
//       color: "bg-blue-100 text-blue-700",
//       owner: "Alice Johnson",
//       avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//     },
//     {
//       name: "Jane Doe",
//       company: "Beta Solutions",
//       email: "jane@beta.com",
//       phone: "555-5678",
//       status: "Contacted",
//       color: "bg-cyan-100 text-cyan-700",
//       owner: "Diana Miller",
//       avatar: "https://randomuser.me/api/portraits/women/47.jpg",
//     },
//     {
//       name: "Peter Jones",
//       company: "Gamma Tech",
//       email: "peter@gamma.com",
//       phone: "555-8765",
//       status: "Qualified",
//       color: "bg-green-100 text-green-700",
//       owner: "Alice Johnson",
//       avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//     },
//     {
//       name: "Mary Johnson",
//       company: "Delta Industries",
//       email: "mary@delta.com",
//       phone: "555-4321",
//       status: "Lost",
//       color: "bg-red-100 text-red-700",
//       owner: "Diana Miller",
//       avatar: "https://randomuser.me/api/portraits/women/47.jpg",
//     },
//     {
//       name: "David Lee",
//       company: "Epsilon Services",
//       email: "david@epsilon.com",
//       phone: "555-9999",
//       status: "New",
//       color: "bg-blue-100 text-blue-700",
//       owner: "Alice Johnson",
//       avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//     },
//   ];

//   // Drag-and-drop functionality
//   const handleDragEnd = (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     const sourceCol = source.droppableId;
//     const destCol = destination.droppableId;
//     const draggedItem = pipeline[sourceCol][source.index];

//     const newSource = Array.from(pipeline[sourceCol]);
//     newSource.splice(source.index, 1);

//     const newDest = Array.from(pipeline[destCol]);
//     newDest.splice(destination.index, 0, draggedItem);

//     setPipeline({
//       ...pipeline,
//       [sourceCol]: newSource,
//       [destCol]: newDest,
//     });
//   };

//   const getTotal = (col) => {
//     return pipeline[col]
//       .reduce((acc, item) => acc + parseInt(item.amount.replace(/[^0-9]/g, "")), 0)
//       .toLocaleString();
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar />

//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="flex justify-between items-center bg-white px-6 py-4 shadow-sm">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">CRM</h1>
//             <p className="text-gray-500 text-sm">
//               Manage your leads and sales pipeline.
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition">
//               <FiUpload size={16} />
//               Import Leads
//             </button>
//             <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
//               <FiPlus size={16} />
//               Add Lead
//             </button>
//           </div>
//         </header>

//         {/* Tabs */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
//           <div className="flex gap-3">
//             <button
//               onClick={() => setActiveTab("pipeline")}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
//                 activeTab === "pipeline"
//                   ? "bg-white border border-gray-300 shadow-sm"
//                   : "text-gray-500 hover:bg-gray-100"
//               }`}
//             >
//               <FiBarChart2 size={16} />
//               Sales Pipeline
//             </button>
//             <button
//               onClick={() => setActiveTab("leads")}
//               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
//                 activeTab === "leads"
//                   ? "bg-white border border-gray-300 shadow-sm"
//                   : "text-gray-500 hover:bg-gray-100"
//               }`}
//             >
//               <FiList size={16} />
//               Leads
//             </button>
//           </div>
//         </div>

//         {/* Main Content */}
//         <main className="p-6 flex-1 overflow-x-auto overflow-y-auto">
//           {activeTab === "pipeline" ? (
//             <DragDropContext onDragEnd={handleDragEnd}>
//               <div className="flex gap-6 min-w-[1200px] pb-4">
//                 {Object.keys(pipeline).map((colKey) => (
//                   <Droppable droppableId={colKey} key={colKey}>
//                     {(provided) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.droppableProps}
//                         className="w-72 flex-shrink-0"
//                       >
//                         {/* Column Header */}
//                         <div className="flex justify-between items-center mb-1">
//                           <h3 className="text-gray-800 font-semibold text-sm flex items-center gap-2">
//                             {colKey}
//                             <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
//                               {pipeline[colKey].length}
//                             </span>
//                           </h3>
//                           <span className="text-gray-500 text-sm font-medium">
//                             ${getTotal(colKey)}
//                           </span>
//                         </div>

//                         <div className="border-t border-gray-200 mt-1 mb-3"></div>

//                         {/* Cards */}
//                         <div className="flex flex-col gap-3">
//                           {pipeline[colKey].map((lead, i) => (
//                             <Draggable
//                               draggableId={lead.id}
//                               index={i}
//                               key={lead.id}
//                             >
//                               {(provided, snapshot) => (
//                                 <div
//                                   ref={provided.innerRef}
//                                   {...provided.draggableProps}
//                                   {...provided.dragHandleProps}
//                                   className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition ${
//                                     snapshot.isDragging
//                                       ? "ring-2 ring-blue-300 shadow-lg"
//                                       : ""
//                                   }`}
//                                 >
//                                   <div className="flex justify-between items-start mb-2">
//                                     <div>
//                                       <h4 className="text-gray-800 font-semibold text-sm">
//                                         {lead.title}
//                                       </h4>
//                                       <p className="text-gray-500 text-xs">
//                                         {lead.company}
//                                       </p>
//                                     </div>
//                                     <FiMoreVertical
//                                       className="text-gray-400"
//                                       size={16}
//                                     />
//                                   </div>

//                                   <div className="flex justify-between items-center mt-2">
//                                     <p className="text-green-600 font-semibold text-sm">
//                                       {lead.amount}
//                                     </p>
//                                     <img
//                                       src={lead.avatar}
//                                       alt={lead.rep}
//                                       className="w-7 h-7 rounded-full object-cover"
//                                     />
//                                   </div>
//                                 </div>
//                               )}
//                             </Draggable>
//                           ))}
//                           {provided.placeholder}
//                         </div>
//                       </div>
//                     )}
//                   </Droppable>
//                 ))}
//               </div>
//             </DragDropContext>
//           ) : (
//             // === LEADS TABLE ===
//             <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                       Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                       Company
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                       Contact
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
//                       Owner
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-100">
//                   {leads.map((lead, idx) => (
//                     <tr key={idx} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4 text-sm font-medium text-gray-800">
//                         {lead.name}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-700">
//                         {lead.company}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         <div>{lead.email}</div>
//                         <div className="text-xs text-gray-400">{lead.phone}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`text-xs font-medium px-3 py-1 rounded-full ${lead.color}`}
//                         >
//                           {lead.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 flex items-center gap-2">
//                         <img
//                           src={lead.avatar}
//                           alt={lead.owner}
//                           className="w-7 h-7 rounded-full object-cover"
//                         />
//                         <span className="text-sm text-gray-700">
//                           {lead.owner}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }
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

  // ===== Theme Colors =====
  const primaryBlue = "sky-600";
  const primaryBlueHover = "sky-700";
  const darkIndigo = "indigo-900";
  const lightBg = "bg-gray-50";

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

  // Updated lead colors for better contrast and theme
  const leads = [
    {
      name: "Malik Rehan",
      company: "asdf",
      email: "malikrehan@tabontech.com",
      phone: "03325234579",
      status: "New",
      color: "bg-sky-100 text-sky-700", // Themed Blue/Cyan
      owner: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Samiullah Qureshi",
      company: "CoreDesk",
      email: "samiullahqureshi669@gmail.com",
      phone: "316005492",
      status: "New",
      color: "bg-sky-100 text-sky-700",
      owner: "Diana Miller",
      avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    },
    {
      name: "John Smith",
      company: "Acme Corp",
      email: "john@acme.com",
      phone: "555-1234",
      status: "Contacted",
      color: "bg-indigo-100 text-indigo-700", // Themed Indigo
      owner: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Jane Doe",
      company: "Beta Solutions",
      email: "jane@beta.com",
      phone: "555-5678",
      status: "Qualified",
      color: "bg-emerald-100 text-emerald-700", // Standard Green for Qualified
      owner: "Diana Miller",
      avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    },
    {
      name: "Peter Jones",
      company: "Gamma Tech",
      email: "peter@gamma.com",
      phone: "555-8765",
      status: "In Progress",
      color: "bg-yellow-100 text-yellow-700", // Standard Yellow for In Progress
      owner: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Mary Johnson",
      company: "Delta Industries",
      email: "mary@delta.com",
      phone: "555-4321",
      status: "Lost",
      color: "bg-red-100 text-red-700", // Standard Red for Lost
      owner: "Diana Miller",
      avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    },
    {
      name: "David Lee",
      company: "Epsilon Services",
      email: "david@epsilon.com",
      phone: "555-9999",
      status: "New",
      color: "bg-sky-100 text-sky-700",
      owner: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
  ];

  // Drag-and-drop functionality
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Check if the item was dropped in the same column at the same index
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

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
    <div className={`flex h-screen ${lightBg}`}>
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header (Themed) */}
        <header className="flex justify-between items-center bg-white px-8 py-5 shadow-lg z-10">
          <div>
            <h1 className={`text-3xl font-extrabold text-${darkIndigo}`}>CRM</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your leads and sales pipeline.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-xl transition font-medium shadow-sm">
              <FiUpload size={16} />
              Import Leads
            </button>
            <button className={`flex items-center gap-2 bg-${primaryBlue} hover:bg-${primaryBlueHover} text-white px-4 py-2 rounded-xl transition font-semibold shadow-md`}>
              <FiPlus size={16} />
              Add Lead
            </button>
          </div>
        </header>

        {/* Tabs (Themed) */}
        <div className={`flex items-center justify-between px-8 py-4 border-b border-gray-200 ${lightBg} sticky top-0 z-0`}>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("pipeline")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition shadow-sm ${
                activeTab === "pipeline"
                  ? `bg-white border-2 border-sky-400 text-${darkIndigo}`
                  : "text-gray-600 hover:bg-white"
              }`}
            >
              <FiBarChart2 size={16} />
              Sales Pipeline
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition shadow-sm ${
                activeTab === "leads"
                  ? `bg-white border-2 border-sky-400 text-${darkIndigo}`
                  : "text-gray-600 hover:bg-white"
              }`}
            >
              <FiList size={16} />
              Leads List
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-8 flex-1 overflow-x-auto overflow-y-auto">
          {activeTab === "pipeline" ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex gap-6 min-w-[1400px] pb-4 h-full">
                {Object.keys(pipeline).map((colKey) => (
                  <Droppable droppableId={colKey} key={colKey}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`w-80 flex-shrink-0 p-3 rounded-xl transition ${
                          snapshot.isDraggingOver ? "bg-sky-50" : lightBg
                        }`} // Highlight drop target
                      >
                        {/* Column Header */}
                        <div className="flex justify-between items-center mb-3 p-2 border-b border-sky-200">
                          <h3 className={`text-lg text-${darkIndigo} font-extrabold flex items-center gap-2`}>
                            {colKey}
                            <span className={`text-xs bg-sky-200 text-${darkIndigo} px-2 py-0.5 rounded-full font-medium`}>
                              {pipeline[colKey].length}
                            </span>
                          </h3>
                          <span className="text-gray-600 text-sm font-bold">
                            ${getTotal(colKey)}
                          </span>
                        </div>

                        {/* Cards */}
                        <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-250px)]">
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
                                  className={`bg-white border border-gray-200 rounded-xl p-4 shadow-md transition duration-200 cursor-grab ${
                                    snapshot.isDragging
                                      ? "ring-4 ring-sky-400 shadow-xl opacity-90"
                                      : "hover:shadow-lg"
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <h4 className={`text-lg text-${darkIndigo} font-semibold`}>
                                        {lead.title}
                                      </h4>
                                      <p className="text-gray-500 text-sm mt-0.5">
                                        {lead.company}
                                      </p>
                                    </div>
                                    <button className="p-1 text-gray-400 hover:text-sky-600 rounded-full transition">
                                        <FiMoreVertical size={18} />
                                    </button>
                                  </div>

                                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                    <p className="text-emerald-600 font-bold text-md">
                                      {lead.amount}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">{lead.rep}</span>
                                        <img
                                            src={lead.avatar}
                                            alt={lead.rep}
                                            className="w-8 h-8 rounded-full object-cover border-2 border-sky-400"
                                        />
                                    </div>
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
            // === LEADS TABLE (Themed) ===
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`bg-indigo-50 border-b border-indigo-100`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-bold text-${darkIndigo} uppercase tracking-wider`}>
                      Name
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-bold text-${darkIndigo} uppercase tracking-wider`}>
                      Company
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-bold text-${darkIndigo} uppercase tracking-wider`}>
                      Contact
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-bold text-${darkIndigo} uppercase tracking-wider`}>
                      Status
                    </th>
                    <th className={`px-6 py-4 text-left text-xs font-bold text-${darkIndigo} uppercase tracking-wider`}>
                      Owner
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {leads.map((lead, idx) => (
                    <tr key={idx} className="hover:bg-sky-50 transition">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {lead.company}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="text-gray-800">{lead.email}</div>
                        <div className="text-xs text-gray-500 mt-1">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${lead.color}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          src={lead.avatar}
                          alt={lead.owner}
                          className="w-8 h-8 rounded-full object-cover border-2 border-sky-300"
                        />
                        <span className="text-sm text-gray-700 font-medium">
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