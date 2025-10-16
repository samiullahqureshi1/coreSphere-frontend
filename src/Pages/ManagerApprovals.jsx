import { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiList,
  FiX,
} from "react-icons/fi";

export default function ManagerApprovals() {
  const [activeTab, setActiveTab] = useState("leaves");
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(false);

  // === Fetch approvals based on tab ===
  useEffect(() => {
    const fetchApprovals = async () => {
      setLoading(true);
      try {
        // 👇 Replace these APIs with your actual endpoints
        const endpoints = {
          leaves: "https://core-sphere-backend.vercel.app/api/leave/pendingForManager/123",
          expenses: "https://core-sphere-backend.vercel.app/api/expense/pendingForManager/123",
          timesheets: "https://core-sphere-backend.vercel.app/api/timesheet/pending/123",
          tasks: "https://core-sphere-backend.vercel.app/api/task/pendingForApproval/123",
        };

        const res = await fetch(endpoints[activeTab]);
        const data = await res.json();

        if (data.success) setApprovals(data.items || []);
        else setApprovals([]);
      } catch (err) {
        console.error("Error fetching approvals:", err);
        setApprovals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, [activeTab]);

  const handleAction = async (id, actionType) => {
    // Here you'd call PATCH API like /approve or /reject
    alert(`Request ${id} ${actionType}ed successfully!`);
    setApprovals((prev) => prev.filter((item) => item._id !== id));
  };

  const tabs = [
    { key: "leaves", label: "Leaves", icon: <FiClock /> },
    { key: "expenses", label: "Expenses", icon: <FiDollarSign /> },
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
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-indigo-900 mb-6 capitalize">
              {activeTab} Approvals
            </h2>

            {loading ? (
              <p className="text-gray-500 text-center py-6">
                Loading {activeTab}...
              </p>
            ) : approvals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-indigo-50 text-indigo-800 font-semibold text-left">
                      <th className="p-3 border-b">Employee</th>
                      <th className="p-3 border-b">
                        {activeTab === "expenses"
                          ? "Amount"
                          : activeTab === "timesheets"
                          ? "Hours"
                          : "Details"}
                      </th>
                      <th className="p-3 border-b text-center">Date</th>
                      <th className="p-3 border-b text-center">Status</th>
                      <th className="p-3 border-b text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvals.map((a, i) => (
                      <tr
                        key={i}
                        className="border-b hover:bg-sky-50 transition duration-200"
                      >
                        <td className="p-3 font-semibold text-gray-800">
                          {a.employeeName || "—"}
                        </td>
                        <td className="p-3 text-gray-700">
                          {a.details || a.amount || a.hours || "—"}
                        </td>
                        <td className="p-3 text-center text-gray-600">
                          {a.date
                            ? new Date(a.date).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                            Pending
                          </span>
                        </td>
                        <td className="p-3 text-center flex justify-center gap-2">
                          <button
                            onClick={() => handleAction(a._id, "approve")}
                            className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-green-200 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(a._id, "reject")}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-200 transition"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">
                No pending {activeTab} approvals.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
