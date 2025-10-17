import { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar";
import {
  FiUsers,
  FiMail,
  FiUser,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

export default function TeamOverviewPage() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("http://localhost:5000/Employee/getEmployee");
        const data = await res.json();
        console.log("Team API Response:", data); // 👀 debug log

        if (data.success && Array.isArray(data.team)) {
          setTeam(data.team);
        } else if (data.success && Array.isArray(data.employees)) {
          setTeam(data.employees);
        } else {
          setTeam([]);
        }
      } catch (err) {
        console.error("Error fetching team data:", err);
        setTeam([]);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-white shadow-sm px-6 py-4 border-b border-gray-200">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-indigo-900">
              <FiUsers className="text-sky-600" size={24} />
              Team Overview
            </h1>
            <p className="text-sm text-gray-500">
              Manage your team and monitor performance
            </p>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {!Array.isArray(team) || team.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-lg">No team members found.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <div
                  key={member._id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-5"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xl">
                      {member.name ? member.name[0].toUpperCase() : "?"}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-indigo-900">
                        {member.name}
                      </h2>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FiUser size={14} /> {member.role || "Employee"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <FiMail className="text-gray-400" /> {member.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <FiCalendar className="text-gray-400" /> Joined:{" "}
                      {new Date(member.joiningDate).toLocaleDateString("en-GB")}
                    </p>
                    <p className="flex items-center gap-2">
                      <FiTrendingUp className="text-gray-400" /> Performance:{" "}
                      <span
                        className={`font-semibold ${
                          member.performance === "Excellent"
                            ? "text-green-600"
                            : member.performance === "Good"
                            ? "text-sky-600"
                            : member.performance === "Average"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {member.performance || "Not Rated"}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
