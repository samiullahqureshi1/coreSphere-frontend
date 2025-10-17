// import { useState, useEffect } from "react";
// import Sidebar from "../component/Sidebar";
// import {
//   FiCheckCircle,
//   FiClock,
//   FiDollarSign,
//   FiList,
//   FiX,
// } from "react-icons/fi";

// export default function ManagerApprovals() {
//   const [activeTab, setActiveTab] = useState("leaves");
//   const [approvals, setApprovals] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // === Fetch approvals based on tab ===
//   useEffect(() => {
//     const fetchApprovals = async () => {
//       setLoading(true);
//       try {
//         // 👇 Replace these APIs with your actual endpoints
//         const endpoints = {
//           leaves: "http://localhost:5000/api/leave/pendingForManager/123",
//           expenses: "http://localhost:5000/api/expense/pendingForManager/123",
//           timesheets: "http://localhost:5000/api/timesheet/pending/123",
//           tasks: "http://localhost:5000/api/task/pendingForApproval/123",
//         };

//         const res = await fetch(endpoints[activeTab]);
//         const data = await res.json();

//         if (data.success) setApprovals(data.items || []);
//         else setApprovals([]);
//       } catch (err) {
//         console.error("Error fetching approvals:", err);
//         setApprovals([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApprovals();
//   }, [activeTab]);

//   const handleAction = async (id, actionType) => {
//     // Here you'd call PATCH API like /approve or /reject
//     alert(`Request ${id} ${actionType}ed successfully!`);
//     setApprovals((prev) => prev.filter((item) => item._id !== id));
//   };

//   const tabs = [
//     { key: "leaves", label: "Leaves", icon: <FiClock /> },
//     { key: "expenses", label: "Expenses", icon: <FiDollarSign /> },
//     { key: "timesheets", label: "Timesheets", icon: <FiList /> },
//     { key: "tasks", label: "Tasks", icon: <FiCheckCircle /> },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar />

//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="flex items-center justify-between bg-white shadow-sm px-8 py-5 border-b border-gray-100">
//           <div>
//             <h1 className="text-2xl font-bold text-indigo-900">
//               Manager Approvals
//             </h1>
//             <p className="text-gray-500 text-sm">
//               Review and approve requests from your team.
//             </p>
//           </div>
//         </header>

//         {/* Tabs */}
//         <div className="flex gap-3 bg-indigo-50 px-8 py-4 border-b border-gray-100">
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setActiveTab(tab.key)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
//                 activeTab === tab.key
//                   ? "bg-sky-600 text-white shadow-md"
//                   : "bg-white text-indigo-900 hover:bg-sky-50"
//               }`}
//             >
//               {tab.icon}
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <main className="p-8 overflow-y-auto">
//           <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
//             <h2 className="text-xl font-bold text-indigo-900 mb-6 capitalize">
//               {activeTab} Approvals
//             </h2>

//             {loading ? (
//               <p className="text-gray-500 text-center py-6">
//                 Loading {activeTab}...
//               </p>
//             ) : approvals.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm border-collapse">
//                   <thead>
//                     <tr className="bg-indigo-50 text-indigo-800 font-semibold text-left">
//                       <th className="p-3 border-b">Employee</th>
//                       <th className="p-3 border-b">
//                         {activeTab === "expenses"
//                           ? "Amount"
//                           : activeTab === "timesheets"
//                           ? "Hours"
//                           : "Details"}
//                       </th>
//                       <th className="p-3 border-b text-center">Date</th>
//                       <th className="p-3 border-b text-center">Status</th>
//                       <th className="p-3 border-b text-center">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {approvals.map((a, i) => (
//                       <tr
//                         key={i}
//                         className="border-b hover:bg-sky-50 transition duration-200"
//                       >
//                         <td className="p-3 font-semibold text-gray-800">
//                           {a.employeeName || "—"}
//                         </td>
//                         <td className="p-3 text-gray-700">
//                           {a.details || a.amount || a.hours || "—"}
//                         </td>
//                         <td className="p-3 text-center text-gray-600">
//                           {a.date
//                             ? new Date(a.date).toLocaleDateString()
//                             : "—"}
//                         </td>
//                         <td className="p-3 text-center">
//                           <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
//                             Pending
//                           </span>
//                         </td>
//                         <td className="p-3 text-center flex justify-center gap-2">
//                           <button
//                             onClick={() => handleAction(a._id, "approve")}
//                             className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-200 transition"
//                           >
//                             Approve
//                           </button>
//                           <button
//                             onClick={() => handleAction(a._id, "reject")}
//                             className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-200 transition"
//                           >
//                             Reject
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <p className="text-gray-500 text-center py-6">
//                 No pending {activeTab} approvals.
//               </p>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiList,
} from "react-icons/fi";

export default function ManagerApprovals() {
  const [activeTab, setActiveTab] = useState("leaves");
  const [approvals, setApprovals] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endpoints = {
          leaves: "http://localhost:5000/Leave/getLeaves",
          expenses:
            "http://localhost:5000/api/expense/pendingForManager/123",
          timesheets:
            "http://localhost:5000/api/timesheet/pending/123",
          tasks:
            "http://localhost:5000/api/task/pendingForApproval/123",
        };

        const res = await fetch(endpoints[activeTab]);
        const data = await res.json();

        if (data.success) {
          // ✅ correct mapping for leaves API
          if (activeTab === "leaves") setLeaves(data.leaves || []);
          else setApprovals(data.items || []);
        } else {
          if (activeTab === "leaves") setLeaves([]);
          else setApprovals([]);
        }
      } catch (err) {
        console.error("Error fetching approvals:", err);
        setLeaves([]);
        setApprovals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleStatusChange = (id, newStatus) => {
    alert(`Leave ${id} ${newStatus}!`);
    setLeaves((prev) =>
      prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l))
    );
  };

  const tabs = [
    { key: "leaves", label: "Leaves", icon: <FiClock /> },
    // { key: "expenses", label: "Expenses", icon: <FiDollarSign /> },
    { key: "timesheets", label: "Timesheets", icon: <FiList /> },
    { key: "tasks", label: "Tasks", icon: <FiCheckCircle /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow-sm px-8 py-5 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">
              Manager Approvals
            </h1>
            <p className="text-gray-500 text-sm">
              Review and approve requests from your team.
            </p>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-3 bg-indigo-50 px-8 py-4 border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-sky-600 text-white shadow-md"
                  : "bg-white text-indigo-900 hover:bg-sky-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="p-8 overflow-y-auto">
          {activeTab === "leaves" ? (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <h2 className="text-xl font-bold text-indigo-900 mb-4">
                Leave Requests
              </h2>

              {loading ? (
                <p className="text-gray-500 text-center py-6">
                  Loading leave requests...
                </p>
              ) : leaves.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-indigo-50 text-indigo-800 font-semibold text-left">
                        <th className="p-3 border-b">Employee Name</th>
                        <th className="p-3 border-b">Leave Type</th>
                        <th className="p-3 border-b">From</th>
                        <th className="p-3 border-b">To</th>
                        <th className="p-3 border-b text-center">Days</th>
                        <th className="p-3 border-b text-center">Status</th>
                        <th className="p-3 border-b text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {leaves.map((l, i) => {
                        const start = new Date(l.startDate);
                        const end = new Date(l.endDate);
                        const days = Math.ceil(
                          (end - start) / (1000 * 60 * 60 * 24) + 1
                        );

                        return (
                          <tr
                            key={i}
                            className="border-b hover:bg-sky-50 transition duration-200"
                          >
                            <td className="p-3 flex items-center gap-3">
                              <img
                                src={
                                  l.employeeId?.avatar ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    l.employeeId?.name || "User"
                                  )}&background=random`
                                }
                                alt={l.employeeId?.name}
                                className="w-9 h-9 rounded-full object-cover border border-sky-300"
                              />
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {l.employeeId?.name || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {l.employeeId?.role || "—"}
                                </p>
                              </div>
                            </td>

                            <td className="p-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                                  l.leaveType === "Sick Leave"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : l.leaveType === "Casual Leave"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-sky-100 text-sky-700"
                                }`}
                              >
                                {l.leaveType}
                              </span>
                            </td>

                            <td className="p-3 text-gray-700">
                              {start.toLocaleDateString()}
                            </td>
                            <td className="p-3 text-gray-700">
                              {end.toLocaleDateString()}
                            </td>

                            <td className="p-3 text-center font-semibold text-gray-800">
                              {days}
                            </td>

                            <td className="p-3 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                  l.status === "Approved"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : l.status === "Rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {l.status}
                              </span>
                            </td>

                            <td className="p-3 text-center">
                              <div className="flex justify-center gap-3">
                                <button
                                  onClick={() =>
                                    handleStatusChange(l._id, "Approved")
                                  }
                                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition duration-200 
                                    ${
                                      l.status === "Approved"
                                        ? "text-white bg-emerald-600 border-emerald-600"
                                        : "text-emerald-600 border-emerald-500 hover:bg-emerald-50"
                                    }`}
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() =>
                                    handleStatusChange(l._id, "Rejected")
                                  }
                                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition duration-200 
                                    ${
                                      l.status === "Rejected"
                                        ? "text-white bg-red-600 border-red-600"
                                        : "text-red-600 border-red-500 hover:bg-red-50"
                                    }`}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No leave requests found.
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-indigo-900 mb-6 capitalize">
                {activeTab} Approvals
              </h2>
              <p className="text-gray-500 text-center py-6">
                No pending {activeTab} approvals.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
