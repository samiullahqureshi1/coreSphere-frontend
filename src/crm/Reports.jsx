import { useState } from "react";
import {
  FiBarChart2,
  FiDollarSign,
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiTrendingUp,
  FiFilter,
} from "react-icons/fi";

export default function Reports() {
  const [filter, setFilter] = useState("monthly");

  const reportsData = {
    leads: 120,
    clients: 45,
    projects: 26,
    proposals: 78,
    revenue: 85000,
    conversionRate: 38,
    growth: 12,
  };

  const projectStats = [
    { name: "Website Revamp", client: "BrightTech", progress: 90, status: "Completed" },
    { name: "CRM Dashboard", client: "FinGrow", progress: 65, status: "In Progress" },
    { name: "Marketing Automation", client: "CodeNova", progress: 40, status: "In Progress" },
  ];

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
            <FiBarChart2 className="text-sky-600" /> Reports & Analytics
          </h2>
          <p className="text-gray-500 text-sm">
            Get insights on performance, revenue, and project progress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-indigo-50 p-4 rounded-xl text-center shadow">
          <p className="text-sm text-gray-600">Total Leads</p>
          <p className="text-2xl font-bold text-indigo-800">{reportsData.leads}</p>
        </div>
        <div className="bg-sky-50 p-4 rounded-xl text-center shadow">
          <p className="text-sm text-gray-600">Clients</p>
          <p className="text-2xl font-bold text-sky-800">{reportsData.clients}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl text-center shadow">
          <p className="text-sm text-gray-600">Projects</p>
          <p className="text-2xl font-bold text-emerald-800">{reportsData.projects}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl text-center shadow">
          <p className="text-sm text-gray-600">Proposals</p>
          <p className="text-2xl font-bold text-yellow-800">{reportsData.proposals}</p>
        </div>
        <div className="bg-pink-50 p-4 rounded-xl text-center shadow">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-pink-800">
            ${reportsData.revenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl text-center shadow">
          <p className="text-sm text-gray-600">Conversion Rate</p>
          <p className="text-2xl font-bold text-purple-800">
            {reportsData.conversionRate}%
          </p>
        </div>
      </div>

      {/* Graph-like Summary (Placeholder) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-sky-600" /> Growth Overview ({filter})
        </h3>
        <div className="h-36 bg-gradient-to-r from-sky-100 via-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-gray-500 italic">
          [Growth Chart Placeholder]
        </div>
        <p className="text-gray-600 text-sm mt-3">
          Your CRM metrics have grown by{" "}
          <span className="font-semibold text-emerald-700">
            {reportsData.growth}% this {filter}.
          </span>
        </p>
      </div>

      {/* Project Progress */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
          <FiBriefcase className="text-sky-600" /> Project Progress Overview
        </h3>

        {projectStats.map((proj, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <div className="flex justify-between items-center mb-1">
              <div>
                <p className="font-semibold text-gray-800">{proj.name}</p>
                <p className="text-sm text-gray-500">{proj.client}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold shadow-sm ${
                  proj.status === "Completed"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-sky-100 text-sky-700"
                }`}
              >
                {proj.status}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  proj.status === "Completed" ? "bg-emerald-500" : "bg-sky-500"
                }`}
                style={{ width: `${proj.progress}%` }}
              ></div>
            </div>
            <p className="text-right text-xs text-gray-500 mt-1">
              {proj.progress}% complete
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
