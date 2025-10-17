import { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiBriefcase,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiX,
} from "react-icons/fi";

export default function CRMProjects() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Website Redesign",
      client: "BrightTech",
      budget: 5000,
      startDate: "2025-09-01",
      deadline: "2025-11-15",
      status: "In Progress",
    },
    {
      id: 2,
      name: "Finance Dashboard",
      client: "FinGrow",
      budget: 8000,
      startDate: "2025-08-10",
      deadline: "2025-10-25",
      status: "Completed",
    },
  ]);

  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    startDate: "",
    deadline: "",
    budget: "",
    status: "Planning",
  });

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProject = (e) => {
    e.preventDefault();
    const newEntry = { id: Date.now(), ...newProject };
    setProjects((prev) => [...prev, newEntry]);
    setNewProject({
      name: "",
      client: "",
      startDate: "",
      deadline: "",
      budget: "",
      status: "Planning",
    });
    setIsDrawerOpen(false);
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
            <FiBriefcase className="text-sky-600" /> Projects
          </h2>
          <p className="text-gray-500 text-sm">
            Manage ongoing and planned client projects.
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md transition"
        >
          <FiPlus size={16} />
          Add Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center border border-gray-200 bg-white px-3 py-2 rounded-xl w-72 shadow-sm mb-6 focus-within:ring-2 focus-within:ring-sky-600 transition">
        <FiSearch className="text-sky-600 mr-2" />
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Projects Cards */}
      {filteredProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200"
            >
              {/* Project Title */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
                  <FiBriefcase className="text-sky-600" />
                  {p.name}
                </h3>
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
              </div>

              {/* Table-style key/value display */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <FiUser className="text-sky-500" /> Client
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {p.client}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <FiCalendar className="text-indigo-500" /> Start Date
                  </span>
                  <span className="text-gray-700">
                    {p.startDate
                      ? new Date(p.startDate).toLocaleDateString()
                      : "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <FiCalendar className="text-indigo-500" /> Deadline
                  </span>
                  <span className="text-gray-700">
                    {p.deadline
                      ? new Date(p.deadline).toLocaleDateString()
                      : "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <FiDollarSign className="text-emerald-500" /> Budget
                  </span>
                  <span className="text-indigo-800 font-semibold">
                    {p.budget ? `$${p.budget.toLocaleString()}` : "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8 italic">
          No projects found.
        </p>
      )}

      {/* Add Project Drawer */}
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
          <form onSubmit={handleAddProject} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                placeholder="Enter project title"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newProject.client}
                onChange={(e) =>
                  setNewProject({ ...newProject, client: e.target.value })
                }
                placeholder="Enter client name"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) =>
                    setNewProject({ ...newProject, startDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) =>
                    setNewProject({ ...newProject, deadline: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Budget (USD)
              </label>
              <input
                type="number"
                value={newProject.budget}
                onChange={(e) =>
                  setNewProject({ ...newProject, budget: e.target.value })
                }
                placeholder="Enter budget"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Status
              </label>
              <select
                value={newProject.status}
                onChange={(e) =>
                  setNewProject({ ...newProject, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-bold transition shadow-lg"
            >
              Save Project
            </button>
          </form>
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        ></div>
      )}
    </div>
  );
}
