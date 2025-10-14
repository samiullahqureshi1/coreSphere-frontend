import { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import {
  FiBriefcase,
  FiCheckSquare,
  FiUsers,
  FiUser,
  FiClock,
  FiBarChart2,
  FiPlus,
  FiSearch,
  FiX,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";
import TaskBoard from "./TaskBoard";

export default function ProjectManagement() {
  const [activeTab, setActiveTab] = useState("projects");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    startDate: "",
    deadline: "",
    budget: "",
    status: "",
    description: "",
  });

  const primaryBlue = "sky-600";
  const primaryBlueHover = "sky-700";
  const darkIndigo = "indigo-900";
  const lightBg = "bg-gray-50";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          "https://core-sphere-backend.vercel.app/Project/getProjects"
        );
        const data = await res.json();
        if (data.success) {
          setProjects(data.projects);
        } else {
          console.error("Failed to load projects:", data.message);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.client) {
      alert("Please fill in required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://core-sphere-backend.vercel.app/Project/addProject",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.success) {
        setProjects((prev) => [...prev, data.project]);
        alert("✅ Project added successfully!");
        setIsDrawerOpen(false);
        setFormData({
          name: "",
          client: "",
          startDate: "",
          deadline: "",
          budget: "",
          status: "",
          description: "",
        });
      } else {
        alert(data.message || "Failed to add project");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Error adding project");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      const res = await fetch(
        `https://core-sphere-backend.vercel.app/Project/deleteProject/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
        alert("Project deleted successfully!");
      } else {
        alert(data.message || "Failed to delete project");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Error deleting project");
    }
  };
const [employees, setEmployees] = useState([]);
useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const res = await fetch("https://core-sphere-backend.vercel.app/Employee/getEmployee");
      const data = await res.json();
      if (data.success) {
        setEmployees(data.employees);
      } else {
        console.error("Failed to load employees:", data.message);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  fetchEmployees();
}, []);

  return (
    <div className={`flex h-screen ${lightBg} relative overflow-hidden`}>
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* === Header === */}
        <header className="flex justify-between items-center bg-white px-8 py-5 shadow-lg z-10">
          <div>
            <h1 className={`text-3xl font-extrabold text-${darkIndigo}`}>
              CoreSphere Project Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage projects, tasks, teams, clients, and reports.
            </p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`flex items-center gap-2 bg-${primaryBlue} hover:bg-${primaryBlueHover} text-white px-5 py-2.5 rounded-xl transition font-semibold shadow-md`}
          >
            <FiPlus size={16} /> Add Project
          </button>
        </header>

        {/* === Tab Navigation === */}
        <div className="flex flex-wrap items-center justify-between px-8 py-4 border-b border-gray-100 bg-indigo-50 shadow-sm">
          <div className="flex gap-2 flex-wrap py-3">
            {[
              { key: "projects", label: "Projects", icon: <FiBriefcase /> },
              { key: "tasks", label: "Tasks", icon: <FiCheckSquare /> },
              { key: "teams", label: "Teams", icon: <FiUsers /> },
              { key: "clients", label: "Clients", icon: <FiUser /> },
              {
                key: "timeTracking",
                label: "Time Tracking",
                icon: <FiClock />,
              },
              { key: "reports", label: "Reports", icon: <FiBarChart2 /> },
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

          {/* Search Bar */}
          <div className="flex items-center border border-gray-200 bg-white px-3 py-2 rounded-xl w-64 shadow-sm focus-within:ring-2 focus-within:ring-sky-600 transition">
            <FiSearch className="text-sky-600 mr-2" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* === Main Content === */}
        <main className="p-8 overflow-y-auto">
          {/* === Projects === */}
          {activeTab === "projects" && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <h2 className="text-xl font-bold text-indigo-900 mb-4">
                Project List
              </h2>

              {projects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-indigo-50 text-indigo-800 font-semibold text-left">
                        <th className="p-3 border-b">Project Name</th>
                        <th className="p-3 border-b">Client</th>
                        <th className="p-3 border-b">Start Date</th>
                        <th className="p-3 border-b">Deadline</th>
                        <th className="p-3 border-b text-right">Budget</th>
                        <th className="p-3 border-b text-center">Status</th>
                        <th className="p-3 border-b text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p, i) => (
                        <tr
                          key={i}
                          className="border-b hover:bg-sky-50 transition duration-200"
                        >
                          <td className="p-3 font-semibold text-gray-800">
                            {p.name}
                          </td>
                          <td className="p-3 text-gray-700">{p.client}</td>
                          <td className="p-3 text-gray-700">
                            {new Date(p.startDate).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-gray-700">
                            {new Date(p.deadline).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-right text-indigo-900 font-bold">
                            ${p.budget?.toLocaleString()}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                p.status === "Completed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : p.status === "In Progress"
                                  ? "bg-sky-100 text-sky-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteProject(p._id)}
                              className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-200 transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">
                  No projects found.
                </p>
              )}
            </div>
          )}

          {/* === Tasks === */}
          {activeTab === "tasks" && (
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-md">
              <TaskBoard />
            </div>
          )}

         {activeTab === "teams" && (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
    <h2 className="text-xl font-bold text-indigo-900 mb-3">Project Teams</h2>
    <p className="text-gray-500 text-sm mb-4">
      Manage project team members and roles.
    </p>

    {employees.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-indigo-50 text-indigo-800 font-semibold text-left">
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Role</th>
              <th className="p-3 border-b">Department</th>
              <th className="p-3 border-b text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <tr
                key={i}
                className="border-b hover:bg-sky-50 transition duration-200"
              >
                <td className="p-3 font-semibold text-gray-800">{emp.name}</td>
                <td className="p-3 text-gray-700">{emp.email}</td>
                <td className="p-3 text-gray-700">{emp.role}</td>
                <td className="p-3 text-gray-700">{emp.department}</td>
                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                      emp.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {emp.status}
                  </span>
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


          {/* === Clients === */}
          {activeTab === "clients" && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-indigo-900 mb-3">
                Client Directory
              </h2>
              <p className="text-gray-500 text-sm">
                Track and manage all project clients.
              </p>
            </div>
          )}

          {/* === Time Tracking === */}
          {activeTab === "timeTracking" && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-indigo-900 mb-3">
                Time Tracking
              </h2>
              <p className="text-gray-500 text-sm">
                Monitor employee timesheets and work logs.
              </p>
            </div>
          )}

          {/* === Reports === */}
          {activeTab === "reports" && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-indigo-900 mb-3">
                Reports & Analytics
              </h2>
              <p className="text-gray-500 text-sm">
                Generate insights on performance, timelines, and budgets.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* === Add Project Drawer === */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl rounded-l-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5 bg-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900">Add Project</h2>
          <FiX
            className="text-gray-500 cursor-pointer hover:text-red-500 transition"
            size={22}
            onClick={() => setIsDrawerOpen(false)}
          />
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter project name"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1">
                Client <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={(e) =>
                  setFormData({ ...formData, client: e.target.value })
                }
                placeholder="Enter client name"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1">
                Budget
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                placeholder="Enter budget"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              >
                <option value="">Select Status</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter project details"
                rows="3"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-bold transition disabled:opacity-50 shadow-lg`}
            >
              {loading ? "Saving..." : "Save Project"}
            </button>
          </form>
        </div>
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
