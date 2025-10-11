import { useState } from "react";
import Sidebar from "../component/Sidebar";
import { FiUser, FiCalendar, FiPlus, FiSearch } from "react-icons/fi";

export default function HumanResources() {
  const [activeTab, setActiveTab] = useState("employees");

  const employees = [
    {
      name: "Alice Johnson",
      role: "Project Manager",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Bob Williams",
      role: "Frontend Developer",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      name: "Charlie Brown",
      role: "Backend Developer",
      avatar: "https://randomuser.me/api/portraits/women/46.jpg",
    },
    {
      name: "Diana Miller",
      role: "UI/UX Designer",
      avatar: "https://randomuser.me/api/portraits/men/47.jpg",
    },
  ];

  const leaves = [
    {
      name: "Bob Williams",
      role: "Frontend Developer",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      type: "Vacation",
      dates: "Aug 9, 2024 - Aug 14, 2024",
      status: "Approved",
      color: "bg-green-100 text-green-700",
    },
    {
      name: "Charlie Brown",
      role: "Backend Developer",
      avatar: "https://randomuser.me/api/portraits/women/46.jpg",
      type: "Sick",
      dates: "Aug 11, 2024 - Aug 11, 2024",
      status: "Approved",
      color: "bg-green-100 text-green-700",
    },
    {
      name: "Diana Miller",
      role: "UI/UX Designer",
      avatar: "https://randomuser.me/api/portraits/men/47.jpg",
      type: "Personal",
      dates: "Aug 19, 2024 - Aug 21, 2024",
      status: "Pending",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      name: "Alice Johnson",
      role: "Project Manager",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      type: "Vacation",
      dates: "Aug 31, 2024 - Sep 4, 2024",
      status: "Pending",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      name: "Bob Williams",
      role: "Frontend Developer",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      type: "Sick",
      dates: "Jul 29, 2024 - Jul 29, 2024",
      status: "Rejected",
      color: "bg-red-100 text-red-700",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-white px-6 py-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Human Resources</h1>
            <p className="text-gray-500 text-sm">
              Manage your employees and their leave requests.
            </p>
          </div>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
            <FiPlus size={16} />
            Add Employee
          </button>
        </header>

        {/* Tabs */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("employees")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "employees"
                  ? "bg-white border border-gray-300 shadow-sm"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FiUser size={16} />
              Employees
            </button>
            <button
              onClick={() => setActiveTab("leave")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "leave"
                  ? "bg-white border border-gray-300 shadow-sm"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <FiCalendar size={16} />
              Leave Management
            </button>
          </div>

          <div className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-lg w-72">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full text-sm outline-none"
            />
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6 overflow-y-auto">
          {activeTab === "employees" ? (
            // === EMPLOYEES GRID ===
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {employees.map((emp, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center hover:shadow-md transition"
                >
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-20 h-20 rounded-full object-cover mb-4"
                  />
                  <h3 className="text-gray-800 font-semibold text-base">{emp.name}</h3>
                  <p className="text-gray-500 text-sm">{emp.role}</p>
                </div>
              ))}
            </div>
          ) : (
            // === LEAVE MANAGEMENT TABLE ===
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {leaves.map((leave, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                        <img
                          src={leave.avatar}
                          alt={leave.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{leave.name}</p>
                          <p className="text-xs text-gray-500">{leave.role}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {leave.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {leave.dates}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${leave.color}`}
                        >
                          {leave.status}
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
