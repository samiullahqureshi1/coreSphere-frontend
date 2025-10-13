// import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
// import Sidebar from "../component/Sidebar";
// import {
//   FiClipboard,
//   FiDollarSign,
//   FiUsers,
//   FiCheckCircle,
//    FiBell, FiSearch
// } from "react-icons/fi";
// // React Icons

// export default function Dashboard() {
//   const dealsData = [
//     { stage: "Lead", value: 1 },
//     { stage: "Qualified", value: 2 },
//     { stage: "Proposal", value: 1 },
//     { stage: "Negotiation", value: 1 },
//     { stage: "Closed", value: 1 },
//   ];

//   const tasksData = [
//     { name: "In Progress", value: 40, fill: "#4285F4" },
//     { name: "Completed", value: 30, fill: "#FBBC05" },
//     { name: "Pending", value: 20, fill: "#34A853" },
//     { name: "Cancelled", value: 10, fill: "#5F6368" },
//   ];

//  // ✅ Updated with React Icons
//   const stats = [
//     {
//       title: "Open Tasks",
//       value: "7",
//       subtext: "Tasks currently in progress or to-do",
//       icon: <FiClipboard className="text-gray-400" size={20} />,
//     },
//     {
//       title: "Pipeline Value",
//       value: "$235,000",
//       subtext: "Total value of all active deals",
//       icon: <FiDollarSign className="text-gray-400" size={20} />,
//     },
//     {
//       title: "Total Employees",
//       value: "4",
//       subtext: "Active members in your organization",
//       icon: <FiUsers className="text-gray-400" size={20} />,
//     },
//     {
//       title: "Deals Won",
//       value: "1",
//       subtext: "Deals closed this cycle",
//       icon: <FiCheckCircle className="text-gray-400" size={20} />,
//     },
//   ];


//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar />

//       {/* Main Section */}
//       <div className="flex-1 flex flex-col">
//         {/* Top Navbar */}
//         <header className="flex justify-between items-center bg-white px-6 py-3 shadow-sm">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//             <p className="text-gray-500 text-sm">Welcome back! Here's a snapshot of your business.</p>
//           </div>

//           <div className="flex items-center gap-4">
//             <FiSearch className="text-gray-600 cursor-pointer" size={18} />
//             <FiBell className="text-gray-600 cursor-pointer" size={18} />
//             <img
//               src="https://randomuser.me/api/portraits/men/32.jpg"
//               alt="Profile"
//               className="w-9 h-9 rounded-full object-cover"
//             />
//           </div>
//         </header>

//         {/* Dashboard Content */}
//         <main className="p-6 overflow-y-auto">
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
//             {stats.map((item) => (
//               <div
//                 key={item.title}
//                 className="bg-white shadow-sm rounded-xl p-5 border border-gray-200"
//               >
//                 <div className="flex justify-between items-start mb-2">
//                   <h3 className="text-gray-600 text-sm font-medium">{item.title}</h3>
//                   <span className="text-gray-400 text-lg">{item.icon}</span>
//                 </div>
//                 <p className="text-2xl font-bold text-gray-900">{item.value}</p>
//                 <p className="text-sm text-gray-500 mt-1">{item.subtext}</p>
//               </div>
//             ))}
//           </div>

//           {/* Charts Section */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Bar Chart */}
//             <div className="bg-white shadow-sm rounded-xl p-5 border border-gray-200">
//               <h3 className="text-md font-semibold text-gray-800 mb-3">Deals by Stage</h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <BarChart data={dealsData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="stage" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="value" fill="#1E90FF" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Pie Chart */}
//             <div className="bg-white shadow-sm rounded-xl p-5 border border-gray-200">
//               <h3 className="text-md font-semibold text-gray-800 mb-3">Tasks by Status</h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <PieChart>
//                   <Pie
//                     data={tasksData}
//                     dataKey="value"
//                     nameKey="name"
//                     outerRadius={90}
//                     label
//                   />
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
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
} from "recharts";
import EmployeeLeaveForm from "../component/EmployeeLeaveForm"; // 👈 Import leave form

export default function Dashboard() {
  const [user, setUser] = useState(null);

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

  const isAdmin = user.role === "admin"; 

  const dealsData = [
    { stage: "Lead", value: 1 },
    { stage: "Qualified", value: 2 },
    { stage: "Proposal", value: 1 },
    { stage: "Negotiation", value: 1 },
    { stage: "Closed", value: 1 },
  ];

  const tasksData = [
    { name: "In Progress", value: 40, fill: "#4285F4" },
    { name: "Completed", value: 30, fill: "#FBBC05" },
    { name: "Pending", value: 20, fill: "#34A853" },
    { name: "Cancelled", value: 10, fill: "#5F6368" },
  ];

  const stats = [
    {
      title: "Open Tasks",
      value: "7",
      subtext: "Tasks currently in progress or to-do",
      icon: <FiClipboard className="text-gray-400" size={20} />,
    },
    {
      title: "Pipeline Value",
      value: "$235,000",
      subtext: "Total value of all active deals",
      icon: <FiDollarSign className="text-gray-400" size={20} />,
    },
    {
      title: "Total Employees",
      value: "4",
      subtext: "Active members in your organization",
      icon: <FiUsers className="text-gray-400" size={20} />,
    },
    {
      title: "Deals Won",
      value: "1",
      subtext: "Deals closed this cycle",
      icon: <FiCheckCircle className="text-gray-400" size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white px-6 py-3 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isAdmin ? "Admin Dashboard" : "Employee Dashboard"}
            </h1>
            <p className="text-gray-500 text-sm">
              {isAdmin
                ? "Welcome back! Here's a snapshot of your organization."
                : "Apply for leave and view your leave history."}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <FiSearch className="text-gray-600 cursor-pointer" size={18} />
            <FiBell className="text-gray-600 cursor-pointer" size={18} />
            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name || "User"
                )}&background=random`
              }
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover"
            />
          </div>
        </header>

        <main className="p-6 overflow-y-auto">
          {isAdmin && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                {stats.map((item) => (
                  <div
                    key={item.title}
                    className="bg-white shadow-sm rounded-xl p-5 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-gray-600 text-sm font-medium">
                        {item.title}
                      </h3>
                      <span className="text-gray-400 text-lg">{item.icon}</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {item.value}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.subtext}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-white shadow-sm rounded-xl p-5 border border-gray-200">
                  <h3 className="text-md font-semibold text-gray-800 mb-3">
                    Deals by Stage
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dealsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#1E90FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white shadow-sm rounded-xl p-5 border border-gray-200">
                  <h3 className="text-md font-semibold text-gray-800 mb-3">
                    Tasks by Status
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={tasksData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={90}
                        label
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* === Employee View === */}
          {!isAdmin && (
            <div className="max-w-xl mx-auto">
              <EmployeeLeaveForm />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
