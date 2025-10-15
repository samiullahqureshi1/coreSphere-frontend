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
        const res = await fetch("https://core-sphere-backend.vercel.app/Project/getProjects");
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
      const res = await fetch("https://core-sphere-backend.vercel.app/Project/addProject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

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
  const [showModal, setShowModal] = useState(false);
  const [isTeamDrawerOpen, setIsTeamDrawerOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
    avatar: null,
  });
  const [teamLoading, setTeamLoading] = useState(false);

  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTeamMember = async (e) => {
    e.preventDefault();

    if (!teamForm.name || !teamForm.email) {
      alert("Please fill all required fields!");
      return;
    }

    setTeamLoading(true);

    try {
      const formData = new FormData();

      // Append basic fields
      formData.append("name", teamForm.name);
      formData.append("email", teamForm.email);
      formData.append("phone", teamForm.phone || "");
      formData.append("dob", teamForm.dob || "");
      formData.append("department", teamForm.department || "");
      formData.append("role", teamForm.role || "");
      formData.append("joiningDate", teamForm.joiningDate || "");
      formData.append("salary", teamForm.salary || "");

      // Avatar (single file)
      if (teamForm.avatar) {
        formData.append("avatar", teamForm.avatar);
      }

      // Documents (multiple files)
      if (teamForm.documents && teamForm.documents.length > 0) {
        teamForm.documents.forEach((file) => {
          formData.append("documents", file);
        });
      }

      // Send request
      const res = await fetch("https://core-sphere-backend.vercel.app/Employee/addEmployee", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setEmployees((prev) => [...prev, data.employee]);
        alert("✅ Team member added successfully!");
        setTeamForm({
          name: "",
          email: "",
          phone: "",
          dob: "",
          department: "",
          role: "",
          joiningDate: "",
          salary: "",
          avatar: null,
          documents: [],
        });
        setIsTeamDrawerOpen(false);
      } else {
        alert(data.message || "Failed to add team member");
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      alert("Error adding team member. Please try again.");
    } finally {
      setTeamLoading(false);
    }
  };

  const getButtonLabel = () => {
    switch (activeTab) {
      case "projects":
        return "Add Project";
      case "tasks":
        return "Add Task";
      case "teams":
        return "Add Team Member";
      case "clients":
        return "Add Client";
      case "timeTracking":
        return "Add Time Log";
      case "reports":
        return "Generate Report";
      default:
        return "Add";
    }
  };
  const [tasks, setTasks] = useState({
    backlog: [],
    todo: [],
    inprogress: [],
    done: [],
  });
  const handleAddClick = () => {
    if (activeTab === "projects") setIsDrawerOpen(true);
    else if (activeTab === "tasks") setShowModal(true);
    else if (activeTab === "teams") setIsTeamDrawerOpen(true);
    else alert(`Feature for "${getButtonLabel()}" coming soon!`);
  };

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignees: [],
    priority: "Medium",
  });
  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return alert("Please enter a task title.");

    try {
      const res = await fetch("https://core-sphere-backend.vercel.app/api/task/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          status: newTask.status, // default same as backend
          assignees: newTask.assignees,
          projectId: newTask.project, // 👈 important change here
        }),
      });

      const data = await res.json();

      if (data.success) {
        setTasks((prev) => ({
          ...prev,
          backlog: [...prev.backlog, data.task],
        }));

        setShowModal(false);
        setNewTask({
          title: "",
          description: "",
          assignees: [],
          priority: "Medium",
          project: "", // reset selected project too
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Something went wrong creating the task.");
    }
  };

  return (
    <div className={`flex h-screen ${lightBg} relative overflow-hidden`}>
      <Sidebar />

      <div className="flex-1 flex flex-col">
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
            onClick={handleAddClick}
            className={`flex items-center gap-2 bg-${primaryBlue} hover:bg-${primaryBlueHover} text-white px-5 py-2.5 rounded-xl transition font-semibold shadow-md`}
          >
            <FiPlus size={16} />
            {getButtonLabel()}
          </button>
        </header>

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

          <div className="flex items-center border border-gray-200 bg-white px-3 py-2 rounded-xl w-64 shadow-sm focus-within:ring-2 focus-within:ring-sky-600 transition">
            <FiSearch className="text-sky-600 mr-2" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <main className="p-8 overflow-y-auto">
          {activeTab === "projects" && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <h2 className="text-xl font-bold text-indigo-900 mb-6">
                Project Overview
              </h2>

              {projects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-indigo-50 text-indigo-800 font-semibold text-left">
                        <th className="p-3 border-b">Project Name</th>
                        <th className="p-3 border-b">Client</th>
                        <th className="p-3 border-b">Status</th>
                        <th className="p-3 border-b text-center">Start Date</th>
                        <th className="p-3 border-b text-center">Deadline</th>
                        <th className="p-3 border-b text-center">
                          Working Hours
                        </th>
                        <th className="p-3 border-b text-right">Budget</th>
                        <th className="p-3 border-b text-center">Team</th>
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
                            <div>
                              <p className="truncate">{p.name}</p>
                              {p.description && (
                                <p className="text-xs text-gray-500 truncate mt-1">
                                  {p.description}
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="p-3 text-gray-700">
                            {p.client || "—"}
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
                              {p.status || "Planning"}
                            </span>
                          </td>

                          <td className="p-3 text-center text-gray-600">
                            {p.startDate
                              ? new Date(p.startDate).toLocaleDateString()
                              : "—"}
                          </td>

                          <td className="p-3 text-center text-gray-600">
                            {p.deadline
                              ? new Date(p.deadline).toLocaleDateString()
                              : "—"}
                          </td>

                          <td className="p-3 text-center text-gray-700 font-medium">
                            {p.workingHours ? `${p.workingHours} hrs` : "—"}
                          </td>

                          <td className="p-3 text-right font-semibold text-indigo-900">
                            ${p.budget?.toLocaleString() || 0}
                          </td>

                          <td className="p-3 text-center">
                            <div className="flex justify-center -space-x-2">
                              {(p.teamMembers || [])
                                .slice(0, 4)
                                .map((member, i) => (
                                  <img
                                    key={i}
                                    src={
                                      member.avatar ||
                                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                        member.name
                                      )}&background=random`
                                    }
                                    alt={member.name}
                                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                                    title={member.name}
                                  />
                                ))}
                              {p.teamMembers && p.teamMembers.length > 4 && (
                                <div className="w-7 h-7 flex items-center justify-center text-[11px] font-semibold bg-sky-100 text-sky-700 rounded-full border-2 border-white">
                                  +{p.teamMembers.length - 4}
                                </div>
                              )}
                            </div>
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

          {activeTab === "tasks" && (
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-md">
              <TaskBoard />
            </div>
          )}

          {activeTab === "teams" && (
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-indigo-900 mb-3">
                Project Teams
              </h2>
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
                          <td className="p-3 font-semibold text-gray-800">
                            {emp.name}
                          </td>
                          <td className="p-3 text-gray-700">{emp.email}</td>
                          <td className="p-3 text-gray-700">{emp.role}</td>
                          <td className="p-3 text-gray-700">
                            {emp.department}
                          </td>
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
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-indigo-900">
                  Add New Task
                </h2>
                <p className="text-gray-500 text-sm">
                  Fill in task details below
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Project Selection */}
              {/* Project Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Project <span className="text-red-500">*</span>
                </label>

                {/* Selected Project Badge */}
                {newTask.project && (
                  <div className="flex items-center gap-2 mb-2">
                    {(() => {
                      const proj = projects.find(
                        (p) => p._id === newTask.project
                      );
                      if (!proj) return null;
                      return (
                        <div className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                          <span>{proj.name}</span>
                          <FiX
                            size={12}
                            className="cursor-pointer hover:text-red-500"
                            onClick={() =>
                              setNewTask({ ...newTask, project: "" })
                            }
                          />
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Dropdown (only show if no project selected) */}
                {!newTask.project && (
                  <select
                    onChange={(e) => {
                      const projId = e.target.value;
                      if (projId) {
                        setNewTask({ ...newTask, project: projId });
                      }
                      e.target.value = "";
                    }}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                  >
                    <option value="">Select Project...</option>
                    {projects.map((proj) => (
                      <option key={proj._id} value={proj._id}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Implement user authentication"
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  value={newTask.status || "backlog"}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Add task details..."
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </div>

              {/* Assignees */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Assign Employees
                </label>

                {/* Selected badges */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {newTask.assignees.map((empId) => {
                    const emp = employees.find((e) => e._id === empId);
                    if (!emp) return null;
                    return (
                      <div
                        key={emp._id}
                        className="flex items-center gap-1 bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                      >
                        <img
                          src={emp.avatar || "https://via.placeholder.com/32"}
                          alt={emp.name}
                          className="w-5 h-5 rounded-full border border-white object-cover"
                        />
                        <span>{emp.name}</span>
                        <FiX
                          size={12}
                          className="cursor-pointer hover:text-red-500"
                          onClick={() =>
                            setNewTask({
                              ...newTask,
                              assignees: newTask.assignees.filter(
                                (id) => id !== empId
                              ),
                            })
                          }
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Dropdown */}
                <select
                  onChange={(e) => {
                    const empId = e.target.value;
                    if (empId && !newTask.assignees.includes(empId)) {
                      setNewTask({
                        ...newTask,
                        assignees: [...newTask.assignees, empId],
                      });
                    }
                    e.target.value = "";
                  }}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                >
                  <option value="">Select employee to assign...</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} — {emp.role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              {/* Submit */}
              <button
                onClick={handleCreateTask}
                className={`w-full bg-${primaryBlue} hover:bg-${primaryBlueHover} text-white py-3 rounded-xl font-semibold shadow-md transition`}
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl rounded-l-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isTeamDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5 bg-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900">Add Team Member</h2>
          <FiX
            className="text-gray-500 cursor-pointer hover:text-red-500 transition"
            size={22}
            onClick={() => setIsTeamDrawerOpen(false)}
          />
        </div>

        {/* Form Body */}
        <div className="p-6">
          <form
            onSubmit={handleAddTeamMember}
            className="space-y-5"
            encType="multipart/form-data"
          >
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-indigo-900 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={teamForm.name}
                onChange={handleTeamChange}
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
                value={teamForm.email}
                onChange={handleTeamChange}
                type="email"
                placeholder="Enter email address"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600 transition"
                required
              />
            </div>

            {/* Phone + Date of Birth */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={teamForm.phone}
                  onChange={handleTeamChange}
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
                  value={teamForm.dob}
                  onChange={handleTeamChange}
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
                value={teamForm.department}
                onChange={handleTeamChange}
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
                <option value="Mobile Development">Mobile Development</option>
                <option value="QA & Testing">QA & Testing</option>
                <option value="DevOps">DevOps</option>
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
                  value={teamForm.role}
                  onChange={handleTeamChange}
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
                  value={teamForm.joiningDate}
                  onChange={handleTeamChange}
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
                value={teamForm.salary}
                onChange={handleTeamChange}
                type="number"
                placeholder="e.g. 80000"
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
                  setTeamForm({ ...teamForm, avatar: e.target.files[0] })
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
                  setTeamForm({
                    ...teamForm,
                    documents: [...(teamForm.documents || []), ...newFiles],
                  });
                }}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white 
          file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 
          file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition"
              />

              {teamForm.documents && teamForm.documents.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {teamForm.documents.map((file, index) => (
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
                          const updated = teamForm.documents.filter(
                            (_, i) => i !== index
                          );
                          setTeamForm({ ...teamForm, documents: updated });
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
              disabled={teamLoading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-bold transition disabled:opacity-50 shadow-lg"
            >
              {teamLoading ? "Saving..." : "Save Member"}
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
