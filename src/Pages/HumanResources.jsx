import { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiStar,
  FiBriefcase,
  FiSearch,
  FiPlus,
  FiX,
  FiPhone,
  FiMail,
  FiTrash2,
} from "react-icons/fi";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function HumanResources() {
  const [activeTab, setActiveTab] = useState("employees");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState("profile");

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    avatar: "",
  });
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });
const token = localStorage.getItem("token");
const decoded = token ? jwtDecode(token) : null;
const authorId = decoded?._id;
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("https://core-sphere-backend.vercel.app/api/announcement/get");
        const data = await res.json();
        if (data.success) setAnnouncements(data.announcements.reverse());
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async () => {
  if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
    return alert("Please fill in all fields.");
  }

  try {
    const payload = {
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      author: authorId, // ✅ added author here
    };

    const res = await fetch("https://core-sphere-backend.vercel.app/api/announcement/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      setAnnouncements((prev) => [data.announcement, ...prev]);
      setShowModal(false);
      setNewAnnouncement({ title: "", content: "" });
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error creating announcement:", error);
    alert("Failed to create announcement.");
  }
};


const [performanceData, setPerformanceData] = useState([]);
const [performanceLoading, setPerformanceLoading] = useState(false);



const fetchPerformanceData = async () => {
  try {
    setPerformanceLoading(true);
    const res = await fetch("https://core-sphere-backend.vercel.app/Employee/performance/all");
    const data = await res.json();

    if (data?.success && Array.isArray(data.performances)) {
      setPerformanceData(data.performances);
    } else {
      console.error("No performance data found:", data?.message);
      setPerformanceData([]);
    }
  } catch (err) {
    console.error("Error fetching performance data:", err);
    setPerformanceData([]);
  } finally {
    setPerformanceLoading(false);
  }
};

useEffect(() => {
  if (activeTab === "performance") {
    fetchPerformanceData();
  }
}, [activeTab]);



  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    try {
      const res = await fetch(
        `https://core-sphere-backend.vercel.app/api/announcement/delete/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleViewEmployee = async (id) => {
    try {
      const res = await fetch(
        `https://core-sphere-backend.vercel.app/Employee/getEmployeeById/${id}`
      );
      const data = await res.json();
      if (data.success) {
        setSelectedEmployee(data.employee);
        setIsViewOpen(true);
      } else {
        alert("Failed to fetch employee details");
      }
    } catch (err) {
      console.error("Error viewing employee:", err);
      alert("Error viewing employee details");
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      const res = await fetch(
        `https://core-sphere-backend.vercel.app/Employee/deleteEmployee/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        alert("Employee deleted successfully");
      } else {
        alert(data.message || "Failed to delete employee");
      }
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("Error deleting employee");
    }
  };
  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const res = await fetch(
          "https://core-sphere-backend.vercel.app/Employee/getAllPayrolls"
        );
        const data = await res.json();
        if (data.success) {
          setPayrolls(data.payrolls);
        } else {
          console.error("Failed to fetch payrolls:", data.message);
        }
      } catch (err) {
        console.error("Error fetching payrolls:", err);
      }
    };
    fetchPayrolls();
  }, []);

  const handlePayrollStatusChange = async (empId, payrollId, newStatus) => {
    try {
      const res = await fetch(
        `https://core-sphere-backend.vercel.app/Employee/updatePayrollStatus/${empId}/${payrollId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setPayrolls((prev) =>
          prev.map((p) =>
            p._id === payrollId ? { ...p, paymentStatus: newStatus } : p
          )
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating payroll status:", err);
      alert("Error updating payroll status");
    }
  };

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await fetch("https://core-sphere-backend.vercel.app/Leave/getLeaves");
        const data = await res.json();
        if (data.success) {
          setLeaves(data.leaves);
        } else {
          console.error("Failed to fetch leaves:", data.message);
        }
      } catch (err) {
        console.error("Error fetching leaves:", err);
      }
    };
    fetchLeaves();
  }, []);

  // === FETCH EMPLOYEES FROM API ===
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("https://core-sphere-backend.vercel.app/Employee/getEmployee");
        const data = await res.json();
        if (data.success) setEmployees(data.employees);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.role || !formData.email) {
      alert("Please fill all required fields!");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();

      // append all text fields
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone || "");
      form.append("dob", formData.dob || "");
      form.append("department", formData.department || "");
      form.append("role", formData.role || "");
      form.append("joiningDate", formData.joiningDate || "");
      form.append("salary", formData.salary || 0);

      // single avatar image
      if (formData.avatar) form.append("avatar", formData.avatar);

      // multiple documents
      if (formData.documents && formData.documents.length > 0) {
        for (let i = 0; i < formData.documents.length; i++) {
          form.append("documents", formData.documents[i]);
        }
      }

      const res = await fetch("https://core-sphere-backend.vercel.app/Employee/addEmployee", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        setEmployees([...employees, data.employee]);
        setIsDrawerOpen(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          dob: "",
          department: "",
          role: "",
          joiningDate: "",
          salary: "",
          avatar: "",
          documents: [],
        });
      } else {
        alert(data.message || "Failed to add employee");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error adding employee");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(
        `https://core-sphere-backend.vercel.app/Leave/updateLeaveStatus/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setLeaves((prev) =>
          prev.map((leave) =>
            leave._id === id ? { ...leave, status: newStatus } : leave
          )
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error updating status");
    }
  };

  const [attendance, setAttendance] = useState([]);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "https://core-sphere-backend.vercel.app/Employee/getAllEmployeeAttendence",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAttendance(data.attendance);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "attendance") fetchAttendance();
  }, [activeTab]);

  const payroll = [
    { name: "Alice Johnson", month: "September 2025", salary: "$4,500" },
    { name: "Bob Williams", month: "September 2025", salary: "$3,800" },
  ];

  const performance = [
    { name: "Evelyn Lee", rating: "Excellent", score: 9.5 },
    { name: "Jake Brown", rating: "Good", score: 8.2 },
  ];

  const recruitment = [
    { position: "UI Designer", status: "Interviewing", applicants: 8 },
    { position: "Backend Developer", status: "Open", applicants: 5 },
  ];
  const primaryBlue = "sky-600";
  const primaryBlueHover = "sky-700";
  const darkIndigo = "indigo-900";
  const lightBg = "bg-gray-50";
  return (
    <div className={`flex h-screen ${lightBg} relative overflow-hidden`}>
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white px-8 py-5 shadow-lg z-10">
          <div>
            <h1 className={`text-3xl font-extrabold text-${darkIndigo}`}>
              CoreSphere Human Resources
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage employees, leaves, and payroll.
            </p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`flex items-center gap-2 bg-${primaryBlue} hover:bg-${primaryBlueHover} text-white px-5 py-2.5 rounded-xl transition font-semibold shadow-md`}
          >
            <FiPlus size={16} /> Add Employee
          </button>
        </header>

        <div className="flex flex-wrap items-center justify-between px-8 py-4 border-b border-gray-100 bg-indigo-50 shadow-sm">
          {/* Tabs Section */}
          <div className="flex gap-2 flex-wrap py-3">
            {[
              { key: "employees", label: "Employees", icon: <FiUser /> },
              { key: "leave", label: "Leave Management", icon: <FiCalendar /> },
              { key: "attendance", label: "Attendance", icon: <FiClock /> },
              { key: "payroll", label: "Payroll", icon: <FiDollarSign /> },
              { key: "announcements", label: "Announcement", icon: <FiStar /> },
              { key: "performance", label: "Performance", icon: <FiStar /> },

              // {
              //   key: "recruitment",
              //   label: "Recruitment",
              //   icon: <FiBriefcase />,
              // },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm ${
                  activeTab === tab.key
                    ? "bg-sky-600 text-white shadow-md ring-2 ring-sky-300"
                    : "text-indigo-900 bg-white hover:bg-sky-50 border border-transparent"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search + Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Bar */}
            <div className="flex items-center border border-gray-200 bg-white px-3 py-2 rounded-xl w-64 shadow-sm focus-within:ring-2 focus-within:ring-sky-600 transition">
              <FiSearch className="text-sky-600 mr-2" />
              <input
                type="text"
                placeholder={
                  activeTab === "employees"
                    ? "Search employees..."
                    : activeTab === "leave"
                    ? "Search leaves..."
                    : activeTab === "attendance"
                    ? "Search attendance..."
                    : activeTab === "payroll"
                    ? "Search payroll..."
                    : activeTab === "recruitment"
                    ? "Search candidates..."
                    : "Search records..."
                }
                className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Dynamic Filter Dropdowns */}
            {activeTab === "employees" && (
              <select className="border border-gray-200 bg-white text-sm rounded-xl px-3 py-2 shadow-sm outline-none hover:border-sky-500 focus:ring-2 focus:ring-sky-600 transition">
                <option value="">All Departments</option>
                <option value="HR">HR</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            )}

            {activeTab === "leave" && (
              <select className="border border-gray-200 bg-white text-sm rounded-xl px-3 py-2 shadow-sm outline-none hover:border-sky-500 focus:ring-2 focus:ring-sky-600 transition">
                <option value="">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            )}

            {activeTab === "attendance" && (
              <select className="border border-gray-200 bg-white text-sm rounded-xl px-3 py-2 shadow-sm outline-none hover:border-sky-500 focus:ring-2 focus:ring-sky-600 transition">
                <option value="">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Remote">Remote</option>
              </select>
            )}

            {activeTab === "payroll" && (
              <select className="border border-gray-200 bg-white text-sm rounded-xl px-3 py-2 shadow-sm outline-none hover:border-sky-500 focus:ring-2 focus:ring-sky-600 transition">
                <option value="">All Months</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="September">September</option>
                <option value="October">October</option>
              </select>
            )}

            {activeTab === "recruitment" && (
              <select className="border border-gray-200 bg-white text-sm rounded-xl px-3 py-2 shadow-sm outline-none hover:border-sky-500 focus:ring-2 focus:ring-sky-600 transition">
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Closed">Closed</option>
              </select>
            )}

            {activeTab === "performance" && (
              <select className="border border-gray-200 bg-white text-sm rounded-xl px-3 py-2 shadow-sm outline-none hover:border-sky-500 focus:ring-2 focus:ring-sky-600 transition">
                <option value="">All Ratings</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
              </select>
            )}
          </div>
        </div>

        <main className="p-8 overflow-y-auto">
          {activeTab === "employees" && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <h2 className="text-xl font-bold text-indigo-900 mb-4">
                Employee Directory
              </h2>

              {employees.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-indigo-50 text-indigo-800 font-semibold text-left">
                        <th className="p-3 border-b">Profile</th>
                        <th className="p-3 border-b">Name</th>
                        <th className="p-3 border-b">Role</th>
                        <th className="p-3 border-b">Department</th>
                        <th className="p-3 border-b">Email</th>
                        <th className="p-3 border-b text-center">Status</th>
                        <th className="p-3 border-b text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp, idx) => (
                        <tr
                          key={idx}
                          className="border-b hover:bg-sky-50 transition duration-200"
                        >
                          <td className="p-3">
                            <img
                              src={
                                emp.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  emp.name
                                )}&background=random`
                              }
                              alt={emp.name}
                              className="w-10 h-10 rounded-full object-cover border border-sky-300"
                            />
                          </td>

                          <td className="p-3 font-semibold text-gray-800">
                            {emp.name || "-"}
                          </td>

                          <td className="p-3">
                            <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                              {emp.role || "—"}
                            </span>
                          </td>

                          <td className="p-3">
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                              {emp.department || "—"}
                            </span>
                          </td>

                          <td className="p-3 text-gray-600">
                            {emp.email || "—"}
                          </td>

                          <td className="p-3 text-center">
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                              Active
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => handleViewEmployee(emp._id)}
                                title="View Details"
                                className="flex items-center gap-1 bg-sky-100 text-sky-700 hover:bg-sky-200 px-3 py-1 rounded-full text-xs font-semibold transition duration-200"
                              >
                                <FiUser size={12} />
                                View
                              </button>

                              <button
                                onClick={() => handleDeleteEmployee(emp._id)}
                                title="Delete Employee"
                                className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-full text-xs font-semibold transition duration-200"
                              >
                                <FiX size={12} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No employees found.
                </p>
              )}
            </div>
          )}

          {/* === Leave Management === */}
          {activeTab === "leave" && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <h2 className="text-xl font-bold text-indigo-900 mb-4">
                Leave Requests
              </h2>

              {leaves.length > 0 ? (
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
                                  {l.employeeId?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {l.employeeId?.role}
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
                                    : l.leaveType === "Maternity"
                                    ? "bg-pink-100 text-pink-700"
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
          )}
          {activeTab === "attendance" && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <h2 className="text-xl font-bold text-indigo-900 mb-4">
                Employee Attendance
              </h2>

              {attendance.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-indigo-50 text-indigo-800 font-semibold text-left">
                        <th className="p-3 border-b">Employee Name</th>
                        <th className="p-3 border-b">Check-In</th>
                        <th className="p-3 border-b">Check-Out</th>
                        <th className="p-3 border-b text-center">
                          Worked Hours
                        </th>
                        <th className="p-3 border-b text-center">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendance.map((a, i) => (
                        <tr
                          key={i}
                          className="border-b hover:bg-sky-50 transition duration-200"
                        >
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={
                                a.employeeId?.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  a.name || "User"
                                )}&background=random`
                              }
                              alt={a.name}
                              className="w-9 h-9 rounded-full object-cover border border-sky-300"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">
                                {a.name}
                              </p>
                              <p className="text-xs text-gray-500">{a.email}</p>
                            </div>
                          </td>

                          <td className="p-3 text-gray-700">
                            {a.todayAttendance?.checkIn
                              ? new Date(
                                  a.todayAttendance.checkIn
                                ).toLocaleTimeString()
                              : "-"}
                          </td>
                          <td className="p-3 text-gray-700">
                            {a.todayAttendance?.checkOut
                              ? new Date(
                                  a.todayAttendance.checkOut
                                ).toLocaleTimeString()
                              : "-"}
                          </td>
                          <td className="p-3 text-center font-semibold text-gray-800">
                            {a.todayAttendance?.workedHours || "-"}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                a.todayAttendance?.status === "Present"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : a.todayAttendance?.status === "On Leave"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {a.todayAttendance?.status || "Not Checked In"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No attendance records found.
                </p>
              )}
            </div>
          )}

          {/* === Payroll Management === */}
          {activeTab === "payroll" && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <h2 className="text-xl font-bold text-indigo-900 mb-4">
                Payroll Management
              </h2>

              {payrolls.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-indigo-50 text-indigo-800 font-semibold text-left">
                        <th className="p-3 border-b">Employee</th>
                        <th className="p-3 border-b">Department</th>
                        <th className="p-3 border-b">Month</th>
                        <th className="p-3 border-b text-right">Base Salary</th>
                        <th className="p-3 border-b text-right">Bonus</th>
                        <th className="p-3 border-b text-right">Deductions</th>
                        <th className="p-3 border-b text-right">Net Salary</th>
                        <th className="p-3 border-b text-center">
                          Payment Status
                        </th>
                        <th className="p-3 border-b text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {payrolls.map((p, i) => (
                        <tr
                          key={i}
                          className="border-b hover:bg-sky-50 transition-colors duration-200"
                        >
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={
                                p.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  p.name
                                )}&background=random`
                              }
                              alt={p.name}
                              className="w-9 h-9 rounded-full object-cover border border-sky-300"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">
                                {p.name}
                              </p>
                              <p className="text-xs text-gray-500">{p.role}</p>
                            </div>
                          </td>

                          <td className="p-3 text-gray-700">
                            {p.department || "—"}
                          </td>
                          <td className="p-3 text-gray-700">{p.month}</td>

                          <td className="p-3 text-right text-gray-700">
                            ${p.baseSalary?.toLocaleString() || 0}
                          </td>
                          <td className="p-3 text-right text-emerald-600">
                            +${p.bonus?.toLocaleString() || 0}
                          </td>
                          <td className="p-3 text-right text-red-600">
                            -${p.deductions?.toLocaleString() || 0}
                          </td>
                          <td className="p-3 text-right font-bold text-indigo-900">
                            ${p.netSalary?.toLocaleString() || p.baseSalary}
                          </td>

                          <td className="p-3 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                p.paymentStatus === "Paid"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : p.paymentStatus === "Pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {p.paymentStatus}
                            </span>
                          </td>

                          <td className="p-3 text-center">
                            <select
                              value={p.paymentStatus}
                              onChange={(e) =>
                                handlePayrollStatusChange(
                                  p.employeeId,
                                  p._id,
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                              <option value="Failed">Failed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No payroll records found.
                </p>
              )}
            </div>
          )}

          {/* === Recruitment === */}
          {activeTab === "recruitment" && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <h2 className="text-xl font-bold text-indigo-900 mb-3">
                Open Positions
              </h2>
              {recruitment.map((r, i) => (
                <div
                  key={i}
                  className="py-2 border-b border-gray-100 flex justify-between text-sm hover:bg-sky-50 px-2 rounded transition"
                >
                  <span>{r.position}</span>
                  <span className="text-gray-500">{r.status}</span>
                  <span className="font-semibold text-indigo-900">
                    {r.applicants} applicants
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* === Performance === */}
   {activeTab === "performance" && (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
    <h2 className="text-xl font-bold text-indigo-900 mb-3">
      Performance Overview
    </h2>

    {performanceLoading ? (
      <p className="text-gray-500 text-center py-6 animate-pulse">
        Loading performance data...
      </p>
    ) : !performanceData || performanceData.length === 0 ? (
      <p className="text-gray-400 text-center py-6">
        No performance records found.
      </p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-indigo-50 text-indigo-800 font-semibold text-left">
              <th className="p-3 border-b">Employee</th>
              <th className="p-3 border-b">Role</th>
              <th className="p-3 border-b">Department</th>
              <th className="p-3 border-b text-center">Tasks</th>
              <th className="p-3 border-b text-center">Attendance</th>
              <th className="p-3 border-b text-center">Efficiency</th>
              <th className="p-3 border-b text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((emp, i) => (
              <tr
                key={i}
                className="border-b hover:bg-sky-50 transition duration-200"
              >
                {/* Employee Info */}
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={
                      emp.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        emp.name
                      )}&background=random`
                    }
                    alt={emp.name}
                    className="w-9 h-9 rounded-full object-cover border border-sky-300"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{emp.name}</p>
                    <p className="text-xs text-gray-500">{emp.employeeId}</p>
                  </div>
                </td>

                {/* Role / Dept */}
                <td className="p-3 text-gray-700">{emp.role}</td>
                <td className="p-3 text-gray-700">{emp.department}</td>

                {/* Task Completion */}
                <td className="p-3 text-center text-gray-700">
                  {emp.metrics?.taskCompletionRate || 0}%
                </td>

                {/* Attendance */}
                <td className="p-3 text-center text-gray-700">
                  {emp.metrics?.attendancePct || 0}%
                </td>

                {/* Efficiency */}
                <td className="p-3 text-center text-gray-700">
                  {emp.metrics?.timeEfficiency || 0}%
                </td>

                {/* Score */}
                <td className="p-3 text-center font-bold text-indigo-900">
                  {emp.score}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}



          {activeTab === "announcements" && (
            <main className="flex-1 p-6 overflow-y-auto">
              {/* === Header Row with Add Button === */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition"
                >
                  <FiPlus size={18} />
                  Add Announcement
                </button>
              </div>

              {/* === Announcement Cards === */}
              {announcements.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">
                  <p className="text-lg">No announcements yet.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {announcements.map((a) => (
                    <div
                      key={a._id}
                      className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all p-5 relative group"
                    >
                      {/* Delete Button */}
                      <FiTrash2
                        onClick={() => handleDelete(a._id)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 cursor-pointer transition"
                        size={18}
                      />

                      <h2 className="text-xl font-bold text-indigo-900 mb-2 group-hover:text-sky-700 transition">
                        {a.title}
                      </h2>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {a.content.length > 150
                          ? a.content.slice(0, 150) + "..."
                          : a.content}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-2">
                        <span className="flex items-center gap-1">
                          <FiCalendar />
                          {new Date(a.createdAt).toLocaleDateString("en-GB")}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiUser /> {a.author?.name || "Admin"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* === Add Announcement Modal === */}
              {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-indigo-900">
                        Add New Announcement
                      </h2>
                      <button
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-red-500 transition"
                      >
                        ✖
                      </button>
                    </div>

                    <div className="space-y-5">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={newAnnouncement.title}
                          onChange={(e) =>
                            setNewAnnouncement({
                              ...newAnnouncement,
                              title: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                          placeholder="Enter announcement title"
                        />
                      </div>

                      {/* Content */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Content
                        </label>
                        <textarea
                          rows={4}
                          value={newAnnouncement.content}
                          onChange={(e) =>
                            setNewAnnouncement({
                              ...newAnnouncement,
                              content: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                          placeholder="Write your announcement here..."
                        ></textarea>
                      </div>

                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateAnnouncement}
                          className="px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
                        >
                          Publish
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          )}
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-indigo-900">
                Add New Announcement
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                ✖
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      title: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  placeholder="Enter announcement title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  rows={4}
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      content: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                  placeholder="Write your announcement here..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAnnouncement}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl rounded-l-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5 bg-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900">Add Employee</h2>
          <FiX
            className="text-gray-500 cursor-pointer hover:text-red-500 transition"
            size={22}
            onClick={() => setIsDrawerOpen(false)}
          />
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            encType="multipart/form-data"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Enter full name"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600 transition"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter email address"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600 transition"
                required
              />
            </div>

            {/* Phone + DOB */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="+92 300 1234567"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">
                  Date of Birth
                </label>
                <input
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  type="date"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600 transition"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600 transition"
              >
                <option value="">Select Department</option>
                <option value="Frontend Development">
                  Frontend Development
                </option>
                <option value="Backend Development">Backend Development</option>
                <option value="Full Stack Development">
                  Full Stack Development
                </option>
                <option value="UI/UX Design">UI / UX Design</option>
                <option value="Mobile Development">
                  Mobile App Development
                </option>
                <option value="QA & Testing">QA & Testing</option>
                <option value="DevOps">DevOps / Infrastructure</option>
                <option value="Project Management">Project Management</option>
                <option value="Product Management">Product Management</option>
                <option value="Business Analysis">Business Analysis</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance & Accounts">Finance & Accounts</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            {/* Role + Joining Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">
                  Role / Position
                </label>
                <input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">
                  Joining Date
                </label>
                <input
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  type="date"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600 transition"
                />
              </div>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1">
                Salary (Monthly)
              </label>
              <input
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                type="number"
                placeholder="e.g. 50000"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600 transition"
              />
            </div>

            {/* Avatar Upload */}
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1">
                Profile Picture
              </label>
              <input
                name="avatar"
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.files[0] })
                }
                type="file"
                accept="image/*"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white 
            file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 
            file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 transition"
              />
            </div>

            {/* Documents Upload */}
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1">
                Upload Documents (Multiple)
              </label>

              <input
                name="documents"
                multiple
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files);
                  setFormData({
                    ...formData,
                    documents: [...(formData.documents || []), ...newFiles],
                  });
                }}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white 
            file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 
            file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition"
              />

              {formData.documents && formData.documents.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.documents.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-sky-50 text-sky-800 px-3 py-1 rounded-full text-xs font-medium border border-sky-100 shadow-sm"
                    >
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-6 h-6 rounded-full mr-2 object-cover border border-sky-200"
                        />
                      ) : (
                        <span className="bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full mr-2">
                          📄
                        </span>
                      )}

                      <span className="truncate max-w-[120px]">
                        {file.name}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.documents.filter(
                            (_, i) => i !== index
                          );
                          setFormData({ ...formData, documents: updated });
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 transition"
                        title="Remove file"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-bold transition disabled:opacity-50 shadow-lg`}
            >
              {loading ? "Saving..." : "Save Employee"}
            </button>
          </form>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl rounded-l-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isViewOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 sticky top-0 bg-indigo-50 z-10">
          <h2 className="text-xl font-bold text-indigo-900">
            Employee Profile
          </h2>
          <button
            onClick={() => setIsViewOpen(false)}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-white">
          {[
            { key: "profile", label: "Profile" },
            { key: "payroll", label: "Payroll" },
            { key: "documents", label: "Documents" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveViewTab(tab.key)}
              className={`flex-1 py-3 text-sm font-semibold transition ${
                activeViewTab === tab.key
                  ? "border-b-2 border-sky-600 text-sky-700 bg-sky-50"
                  : "text-gray-500 hover:text-sky-700 hover:bg-sky-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6">
          {selectedEmployee ? (
            <>
              {/* 🧍 Profile Tab */}
              {activeViewTab === "profile" && (
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={
                        selectedEmployee.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          selectedEmployee.name
                        )}&background=random`
                      }
                      alt={selectedEmployee.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-sky-200 mb-3 shadow-md"
                    />
                    <h3 className="text-lg font-bold text-indigo-900">
                      {selectedEmployee.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedEmployee.role}
                    </p>

                    <span
                      className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        selectedEmployee.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : selectedEmployee.status === "On Leave"
                          ? "bg-amber-100 text-amber-700"
                          : selectedEmployee.status === "Inactive"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedEmployee.status}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 px-3 py-2 rounded-lg shadow-sm">
                      <FiMail className="text-sky-600" />
                      <div className="text-xs text-gray-700 truncate">
                        <p className="font-semibold text-sky-700">Email</p>
                        <p>{selectedEmployee.email}</p>
                      </div>
                    </div>

                    {selectedEmployee.phone && (
                      <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 px-3 py-2 rounded-lg shadow-sm">
                        <FiPhone className="text-purple-600" />
                        <div className="text-xs text-gray-700">
                          <p className="font-semibold text-purple-700">Phone</p>
                          <p>{selectedEmployee.phone}</p>
                        </div>
                      </div>
                    )}

                    {selectedEmployee.department && (
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg shadow-sm">
                        <FiBriefcase className="text-emerald-600" />
                        <div className="text-xs text-gray-700">
                          <p className="font-semibold text-emerald-700">
                            Department
                          </p>
                          <p>{selectedEmployee.department}</p>
                        </div>
                      </div>
                    )}

                    {selectedEmployee.joiningDate && (
                      <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-lg shadow-sm">
                        <FiCalendar className="text-indigo-600" />
                        <div className="text-xs text-gray-700">
                          <p className="font-semibold text-indigo-700">
                            Joining Date
                          </p>
                          <p>
                            {new Date(
                              selectedEmployee.joiningDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedEmployee.salary && (
                      <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-2 rounded-lg shadow-sm">
                        <FiDollarSign className="text-amber-600" />
                        <div className="text-xs text-gray-700">
                          <p className="font-semibold text-amber-700">Salary</p>
                          <p>${selectedEmployee.salary.toLocaleString()}</p>
                        </div>
                      </div>
                    )}

                    {selectedEmployee.dob && (
                      <div className="flex items-center gap-2 bg-pink-50 border border-pink-100 px-3 py-2 rounded-lg shadow-sm">
                        <FiUser className="text-pink-600" />
                        <div className="text-xs text-gray-700">
                          <p className="font-semibold text-pink-700">
                            Date of Birth
                          </p>
                          <p>
                            {new Date(
                              selectedEmployee.dob
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Divider + Summary */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-sm font-bold text-indigo-900 mb-2">
                      Quick Summary
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <FiUser className="text-sky-600" />
                        <span>
                          <strong>Role:</strong> {selectedEmployee.role}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiBriefcase className="text-emerald-600" />
                        <span>
                          <strong>Department:</strong>{" "}
                          {selectedEmployee.department || "—"}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FiStar className="text-amber-600" />
                        <span>
                          <strong>Status:</strong> {selectedEmployee.status}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* 💰 Payroll Tab */}
              {activeViewTab === "payroll" && (
                <div>
                  {selectedEmployee.payrollHistory?.length > 0 ? (
                    <div className="space-y-3">
                      {selectedEmployee.payrollHistory.map((p, i) => (
                        <div
                          key={i}
                          className="border border-gray-100 rounded-xl p-3 flex justify-between items-center hover:bg-sky-50 transition shadow-sm"
                        >
                          <div>
                            <p className="font-semibold text-indigo-900">
                              {p.month}
                            </p>
                            <p className="text-xs text-gray-500">
                              Net Salary: ${p.netSalary}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                              p.paymentStatus === "Paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : p.paymentStatus === "Pending"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {p.paymentStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No payroll history available.
                    </p>
                  )}
                </div>
              )}

              {/* 📄 Documents Tab */}
              {activeViewTab === "documents" && (
                <div>
                  {selectedEmployee.documents?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {selectedEmployee.documents.map((doc, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center bg-sky-50 border border-sky-100 rounded-xl p-3 hover:shadow-md cursor-pointer transition"
                          onClick={() => setSelectedDoc(doc)}
                        >
                          <div className="w-12 h-12 bg-white flex items-center justify-center border rounded-lg mb-2 shadow-sm">
                            {doc.match(/\.(jpg|jpeg|png)$/i) ? (
                              <img
                                src={doc}
                                alt={`doc-${i}`}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <span className="text-lg text-sky-700">📄</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-700 text-center truncate w-full">
                            {decodeURIComponent(doc.split("/").pop())}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No documents uploaded.
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500">Loading employee details...</p>
          )}
        </div>

        {/* 📄 Document Preview Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center">
            <div className="bg-white w-[80%] h-[80%] rounded-2xl shadow-2xl relative p-4">
              <button
                onClick={() => setSelectedDoc(null)}
                className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-1"
              >
                <FiX size={18} />
              </button>

              {selectedDoc.match(/\.(jpg|jpeg|png)$/i) ? (
                <img
                  src={selectedDoc}
                  alt="Document Preview"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <iframe
                  src={selectedDoc}
                  title="Document"
                  className="w-full h-full rounded-lg"
                ></iframe>
              )}

              <div className="absolute bottom-3 right-3 flex gap-3">
                <a
                  href={selectedDoc}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md"
                >
                  Download
                </a>
                <button
                  onClick={() => window.print()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
        ></div>
      )}
    </div>
  );
}
