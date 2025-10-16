import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../component/Sidebar";
import {
  FiClipboard,
  FiDollarSign,
  FiUsers,
  FiCheckCircle,
  FiBell,
  FiSearch,
  FiUserCheck,
  FiCalendar,
  FiTrendingUp,
  FiBarChart2,
} from "react-icons/fi";
import {
  BarChart,
  PieChart,
  Pie,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Line, // Import Cell for custom Pie chart colors
  LineChart,
} from "recharts";
import { FaTasks, FaProjectDiagram, FaStar } from "react-icons/fa";
import { BsCalendarCheck } from "react-icons/bs";
import EmployeeLeaveForm from "../component/EmployeeLeaveForm";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const [announcements, setAnnouncements] = useState([
    {
      title: "Holiday Notice",
      message: "Office will remain closed on 15th October for maintenance.",
      date: "2025-10-10",
    },
    {
      title: "New Policy Update",
      message: "All employees must update their contact info by next week.",
      date: "2025-10-08",
    },
  ]);
  const employeePerformanceData = [
    { month: "Jan", score: 70 },
    { month: "Feb", score: 75 },
    { month: "Mar", score: 80 },
    { month: "Apr", score: 85 },
    { month: "May", score: 90 },
    { month: "Jun", score: 88 },
  ];

  const [checkedIn, setCheckedIn] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(null);

  const fetchAttendanceStatus = async () => {
    const token = localStorage.getItem("token");
    const employeeId = localStorage.getItem("userid");

    const res = await fetch(
      `https://core-sphere-backend.vercel.app/Employee/getCheckInStatus/68ece7fad0fa337d518f5a0c`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setAttendanceStatus(data.status);
  };
  useEffect(() => {
    fetchAttendanceStatus();
  }, []);
  const handleCheckInOut = async () => {
    try {
      const userId = localStorage.getItem("userid");
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://core-sphere-backend.vercel.app/Employee/updateCheckin/68ece7fad0fa337d518f5a0c`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        if (data.status === "checked-in") setCheckedIn(true);
        else if (data.status === "checked-out") setCheckedIn(false);
      } else {
        alert(data.message || "Error processing request");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (err) {
      console.error("Invalid token:", err);
      setUser(null);
    }
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  const role = user.role?.toLowerCase(); // admin | employee | hr | manager

  // ===== Theme Colors (Consistent with Sidebar) =====
  const primaryColor = "text-sky-500";
  const darkTextColor = "text-indigo-900";
  const lightBg = "bg-gray-50"; // Main page background

  // ===== Sample Data with Theme Colors =====
  const dealsData = [
    { stage: "Lead", value: 1, fill: "#3b82f6" }, // Blue-500
    { stage: "Qualified", value: 2, fill: "#f97316" }, // Orange-500
    { stage: "Proposal", value: 1, fill: "#10b981" }, // Emerald-500
    { stage: "Negotiation", value: 1, fill: "#a855f7" }, // Purple-500
    { stage: "Closed", value: 1, fill: "#06b6d4" }, // Cyan-500
  ];

  const tasksData = [
    { name: "In Progress", value: 40, fill: "#3b82f6" }, // Blue
    { name: "Completed", value: 30, fill: "#10b981" }, // Emerald (Success)
    { name: "Pending", value: 20, fill: "#f97316" }, // Orange (Warning)
    { name: "Cancelled", value: 10, fill: "#ef4444" }, // Red (Danger)
  ];

  const pieColors = tasksData.map((item) => item.fill);

  // ===== Shared Top Bar Stats (Icons updated to use Primary Color) =====
  const stats = {
    admin: [
      {
        title: "Open Tasks",
        value: "7",
        icon: <FiClipboard className={primaryColor} size={20} />,
      },
      {
        title: "Pipeline Value",
        value: "$235,000",
        icon: <FiDollarSign className={primaryColor} size={20} />,
      },
      {
        title: "Total Employees",
        value: "4",
        icon: <FiUsers className={primaryColor} size={20} />,
      },
      {
        title: "Deals Won",
        value: "1",
        icon: <FiCheckCircle className="text-emerald-500" size={20} />,
      },
    ],
    hr: [
      {
        title: "Active Employees",
        value: "42",
        icon: <FiUsers className={primaryColor} size={20} />,
      },
      {
        title: "Pending Leaves",
        value: "5",
        icon: <FiCalendar className="text-amber-500" size={20} />,
      },
      {
        title: "New Hires",
        value: "3",
        icon: <FiUserCheck className="text-emerald-500" size={20} />,
      },
      {
        title: "Resignations",
        value: "1",
        icon: <FiClipboard className="text-red-500" size={20} />,
      },
    ],
    manager: [
      {
        title: "Team Members",
        value: "8",
        icon: <FiUsers className={primaryColor} size={20} />,
      },
      {
        title: "Active Projects",
        value: "5",
        icon: <FiTrendingUp className="text-emerald-500" size={20} />,
      },
      {
        title: "Tasks In Progress",
        value: "14",
        icon: <FiClipboard className="text-amber-500" size={20} />,
      },
      {
        title: "Completed Tasks",
        value: "9",
        icon: <FiCheckCircle className="text-emerald-500" size={20} />,
      },
    ],
    employee: [
      {
        title: "Tasks Completed",
        value: 42,
        icon: <FaTasks className="text-blue-600 text-xl" />,
      },
      {
        title: "Attendance",
        value: "95%",
        icon: <BsCalendarCheck className="text-green-600 text-xl" />,
      },
      {
        title: "Projects",
        value: 3,
        icon: <FaProjectDiagram className="text-purple-600 text-xl" />,
      },
      {
        title: "Performance Score",
        value: "88%",
        icon: <FaStar className="text-yellow-500 text-xl" />,
      },
    ],
  };
  const recentTasks = [
    {
      id: 1,
      title: "UI Design Update",
      project: "Website Revamp",
      status: "Completed",
      deadline: "Oct 12",
    },
    {
      id: 2,
      title: "Client Report",
      project: "Q3 Insights",
      status: "In Progress",
      deadline: "Oct 18",
    },
    {
      id: 3,
      title: "Bug Fixes",
      project: "CRM App",
      status: "Pending",
      deadline: "Oct 20",
    },
  ];

  const upcomingMeetings = [
    {
      id: 1,
      title: "Team Standup",
      date: "Oct 16",
      time: "10:00 AM",
      location: "Zoom",
    },
    {
      id: 2,
      title: "Client Review",
      date: "Oct 18",
      time: "3:00 PM",
      location: "Meeting Room 2",
    },
    {
      id: 3,
      title: "HR Check-in",
      date: "Oct 20",
      time: "11:30 AM",
      location: "Google Meet",
    },
  ];
  return (
    <div className={`flex h-screen ${lightBg} overflow-hidden`}>
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* ===== HEADER (Refined) ===== */}
        <header className="flex justify-between items-center bg-white px-8 py-5 shadow-lg z-10">
          <div>
            <h1
              className={`text-3xl font-extrabold ${darkTextColor} capitalize`}
            >
              {role} Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {role === "admin"
                ? "Company-wide performance and system oversight."
                : role === "hr"
                ? "Manage human capital, recruitment, and compliance."
                : role === "manager"
                ? "Monitor team output and project progress."
                : "Your personal tasks, announcements, and leave portal."}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {role === "employee" && (
              <button
                onClick={handleCheckInOut}
                className={`${
                  attendanceStatus === "checked-in"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-sky-500 hover:bg-sky-600"
                } text-white font-semibold px-4 py-2 rounded-lg shadow-md transition`}
              >
                {attendanceStatus === "checked-in" ? "Check Out" : "Check In"}
              </button>
            )}

            <button className="p-2 rounded-full hover:bg-gray-100 transition">
              <FiSearch className="text-gray-500" size={20} />
            </button>

            <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
              <FiBell className="text-gray-500" size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name || "User"
                )}&background=1e3a8a&color=ffffff`
              }
              alt="Profile"
              className="w-11 h-11 rounded-full border-2 border-sky-400 object-cover shadow-md cursor-pointer"
            />
          </div>
        </header>

        {/* ===== MAIN CONTENT (Padded and Themed) ===== */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* ===== ADMIN VIEW ===== */}
          {role === "admin" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.admin.map((item) => (
                  <div
                    key={item.title}
                    // Updated card style
                    className="bg-white shadow-lg transition duration-300 hover:shadow-xl rounded-2xl p-6 border-t-4 border-sky-400"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wider">
                        {item.title}
                      </h3>
                      {/* Icon already styled in stats object */}
                      <span className="text-gray-400 p-2 bg-sky-100 rounded-full">
                        {item.icon}
                      </span>
                    </div>
                    <p className={`text-3xl font-extrabold ${darkTextColor}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                  <h3 className={`text-xl font-bold mb-6 ${darkTextColor}`}>
                    Deals by Stage
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dealsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="stage" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e3a8a",
                          border: "none",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#0ea5e9"
                        radius={[4, 4, 0, 0]}
                      />{" "}
                      {/* Sky-500 */}
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                  <h3 className={`text-xl font-bold mb-6 ${darkTextColor}`}>
                    Tasks by Status
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={tasksData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                        innerRadius={60} // Added inner radius for a donut effect
                        paddingAngle={5}
                        cornerRadius={5}
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {tasksData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e3a8a",
                          border: "none",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#fff" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* ===== HR VIEW ===== */}
          {role === "hr" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.hr.map((item) => (
                  <div
                    key={item.title}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border-l-4 border-indigo-400"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wider">
                        {item.title}
                      </h3>
                      <span className="p-2 bg-indigo-100 rounded-full">
                        {item.icon}
                      </span>
                    </div>
                    <p className={`text-3xl font-extrabold ${darkTextColor}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className={`text-xl font-bold mb-4 ${darkTextColor}`}>
                    Pending Leave Requests 📝
                  </h3>
                  <div className="h-[280px] overflow-y-auto">
                    <p className="text-gray-500 text-sm">
                      This section will list all pending leave requests (connect
                      your API here). Placeholder content: Jane Doe (5 days),
                      Mark Smith (2 days), Sarah Lee (3 days).
                    </p>
                    {/* Add a simple list structure for visual representation */}
                    <ul className="mt-4 space-y-2">
                      <li className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                        <span className="font-medium text-red-700">
                          Jane Doe
                        </span>
                        <span className="text-red-500 text-sm">
                          5 days (Vacation)
                        </span>
                        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                          Review
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className={`text-xl font-bold mb-4 ${darkTextColor}`}>
                    Employee Attendance Overview
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dealsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="stage" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e3a8a",
                          border: "none",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#fff" }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />{" "}
                      {/* Emerald-500 */}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ===== MANAGER VIEW ===== */}
          {role === "manager" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.manager.map((item) => (
                  <div
                    key={item.title}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border-t-4 border-amber-400"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wider">
                        {item.title}
                      </h3>
                      <span className="p-2 bg-amber-100 rounded-full">
                        {item.icon}
                      </span>
                    </div>
                    <p className={`text-3xl font-extrabold ${darkTextColor}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className={`text-xl font-bold mb-4 ${darkTextColor}`}>
                  Team Performance Chart
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dealsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="stage" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e3a8a",
                        border: "none",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />{" "}
                    {/* Amber-500 */}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ===== EMPLOYEE VIEW (Refined) ===== */}
          {role === "employee" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className={`text-xl font-bold mb-4 ${darkTextColor}`}>
                  Attendance Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-gray-500 font-semibold">
                      Total Working Days
                    </p>
                    <p className="text-3xl font-bold text-blue-600">22</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold">Days Present</p>
                    <p className="text-3xl font-bold text-green-600">20</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold">Leaves</p>
                    <p className="text-3xl font-bold text-red-600">2</p>
                  </div>
                </div>
              </div>
              {/* 🔹 Employee Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats?.employee?.map((item) => (
                  <div
                    key={item.title}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border-t-4 border-blue-500"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-gray-600 text-sm font-semibold uppercase tracking-wider">
                        {item.title}
                      </h3>
                      <span className="p-2 bg-blue-100 rounded-full">
                        {item.icon}
                      </span>
                    </div>
                    <p className={`text-3xl font-extrabold ${darkTextColor}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* 🔹 Performance Progress Chart */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className={`text-xl font-bold mb-4 ${darkTextColor}`}>
                  Your Performance Progress
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={employeePerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e3a8a",
                        border: "none",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#3b82f6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </main>
      </div>

      {showLeaveForm && (
        <div className="fixed inset-0 bg-indigo-900 bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl relative transform transition-all duration-300 scale-100 opacity-100">
            <button
              onClick={() => setShowLeaveForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-indigo-900 transition text-2xl font-bold p-1"
            >
              ×
            </button>
            <EmployeeLeaveForm />
          </div>
        </div>
      )}
    </div>
  );
}
