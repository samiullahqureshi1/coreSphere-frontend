import React, { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import { jwtDecode } from "jwt-decode";
import { FiClock, FiCalendar, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function EmployeeAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const employeeId =  localStorage.getItem("employeeId"); 

  useEffect(() => {
    const fetchMyAttendance = async () => {
      try {
        if (!employeeId) return;
        const res = await fetch(
          `http://localhost:5000/Employee/getAttendanceByEmployee/${employeeId}`
        );
        const data = await res.json();

        if (data.success) {
          setAttendance(data.attendance.reverse());
        } else {
          console.error("Error fetching attendance:", data.message);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAttendance();
  }, [employeeId]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white px-8 py-5 shadow-md border-b">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-indigo-900">
              <FiClock className="text-sky-600" size={24} />
              My Attendance
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View your daily attendance records and worked hours
            </p>
          </div>
        </header>

        <main className="p-8 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
              Loading attendance...
            </div>
          ) : attendance.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-lg">No attendance records found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
              <h2 className="text-lg font-bold text-indigo-900 mb-4">
                Attendance History
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-indigo-50 text-indigo-800 font-semibold text-left">
                      <th className="p-3 border-b">Date</th>
                      <th className="p-3 border-b">Check In</th>
                      <th className="p-3 border-b">Check Out</th>
                      <th className="p-3 border-b text-center">
                        Worked Hours
                      </th>
                      <th className="p-3 border-b text-center">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendance.map((a, i) => {
                      const checkIn = a.checkIn
                        ? new Date(a.checkIn).toLocaleTimeString()
                        : "-";
                      const checkOut = a.checkOut
                        ? new Date(a.checkOut).toLocaleTimeString()
                        : "-";
                      const date = a.date
                        ? new Date(a.date).toLocaleDateString()
                        : "-";
                      const hours = a.workedHours || "-";
                      const status = a.status || "Not Marked";

                      return (
                        <tr
                          key={i}
                          className="border-b hover:bg-sky-50 transition duration-200"
                        >
                          <td className="p-3 text-gray-700">{date}</td>
                          <td className="p-3 text-gray-700">{checkIn}</td>
                          <td className="p-3 text-gray-700">{checkOut}</td>
                          <td className="p-3 text-center text-gray-800 font-medium">
                            {hours}
                          </td>
                          <td className="p-3 text-center">
                            {status === "Present" ? (
                              <span className="flex items-center justify-center gap-1 text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                <FiCheckCircle />
                                Present
                              </span>
                            ) : status === "Absent" ? (
                              <span className="flex items-center justify-center gap-1 text-red-700 bg-red-100 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                <FiXCircle />
                                Absent
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-1 text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                <FiClock />
                                {status}
                              </span>
                            )}
                          </td>
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
    </div>
  );
}
