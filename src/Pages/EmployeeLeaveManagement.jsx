import React, { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import { jwtDecode } from "jwt-decode";
import {
  FiCalendar,
  FiPlus,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

export default function EmployeeLeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newLeave, setNewLeave] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        if (!employeeId) return;

        const res = await fetch(
          `http://localhost:5000/Leave/getByEmployee/${employeeId}`
        );
        const data = await res.json();

        if (data.success) {
          setLeaves(data.leaves.reverse());
        } else {
          console.error("Error fetching leaves:", data.message);
        }
      } catch (err) {
        console.error("Error fetching leaves:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, [employeeId]);

  const handleApplyLeave = async () => {
    if (
      !newLeave.leaveType.trim() ||
      !newLeave.startDate ||
      !newLeave.endDate ||
      !newLeave.reason.trim()
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/Leave/addLeave",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId,
            leaveType: newLeave.leaveType,
            startDate: newLeave.startDate,
            endDate: newLeave.endDate,
            reason: newLeave.reason,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setLeaves((prev) => [data.leave, ...prev]);
        setShowModal(false);
        setNewLeave({ leaveType: "", startDate: "", endDate: "", reason: "" });
        alert("✅ Leave submitted successfully!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error applying leave:", err);
      alert("❌ Failed to apply for leave");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white px-8 py-5 shadow-md border-b">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-indigo-900">
              <FiCalendar className="text-sky-600" size={24} />
              My Leaves
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View your leave requests and apply for new leave
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md transition"
          >
            <FiPlus size={18} /> Apply Leave
          </button>
        </header>

        <main className="p-8 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
              Loading leaves...
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-lg">No leave records found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
              <h2 className="text-lg font-bold text-indigo-900 mb-4">
                Leave History
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-indigo-50 text-indigo-800 font-semibold text-left">
                      <th className="p-3 border-b">Leave Type</th>
                      <th className="p-3 border-b">From</th>
                      <th className="p-3 border-b">To</th>
                      <th className="p-3 border-b text-center">Days</th>
                      <th className="p-3 border-b text-center">Status</th>
                      <th className="p-3 border-b">Reason</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaves.map((l, i) => {
                      const start = new Date(l.startDate);
                      const end = new Date(l.endDate);
                      const days =
                        Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

                      return (
                        <tr
                          key={i}
                          className="border-b hover:bg-sky-50 transition duration-200"
                        >
                          <td className="p-3 font-medium text-gray-700">
                            {l.leaveType}
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
                            {l.status === "Approved" ? (
                              <span className="flex items-center justify-center gap-1 text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                <FiCheckCircle /> Approved
                              </span>
                            ) : l.status === "Rejected" ? (
                              <span className="flex items-center justify-center gap-1 text-red-700 bg-red-100 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                <FiXCircle /> Rejected
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-1 text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                <FiClock /> Pending
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-gray-600">{l.reason}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-indigo-900">
                Apply for Leave
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
                  Leave Type
                </label>
                <select
                  value={newLeave.leaveType}
                  onChange={(e) =>
                    setNewLeave({ ...newLeave, leaveType: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Maternity">Maternity</option>
                  <option value="Paternity">Paternity</option>
                  <option value="Annual Leave">Annual Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={newLeave.startDate}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, startDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    value={newLeave.endDate}
                    onChange={(e) =>
                      setNewLeave({ ...newLeave, endDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  rows={3}
                  value={newLeave.reason}
                  onChange={(e) =>
                    setNewLeave({ ...newLeave, reason: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                  placeholder="Write the reason for your leave..."
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
                  onClick={handleApplyLeave}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
