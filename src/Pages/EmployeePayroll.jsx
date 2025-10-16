import React, { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import { jwtDecode } from "jwt-decode";
import {
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

export default function EmployeePayroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decode employee ID from token
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const employeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    const fetchEmployeePayroll = async () => {
      try {
        if (!employeeId) return;

        const res = await fetch(
          `https://core-sphere-backend.vercel.app/Employee/getPayrollByEmployee/${employeeId}`
        );
        const data = await res.json();

        if (data.success) {
          setPayrolls(data.payrolls.reverse());
        } else {
          console.error("Error fetching payrolls:", data.message);
        }
      } catch (err) {
        console.error("Error fetching payrolls:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeePayroll();
  }, [employeeId]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* === Header === */}
        <header className="flex justify-between items-center bg-white px-8 py-5 shadow-md border-b">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-indigo-900">
              <FiDollarSign className="text-sky-600" size={24} />
              My Payroll
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View your salary details, payment status, and monthly records
            </p>
          </div>
        </header>

        {/* === Main Content === */}
        <main className="p-8 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
              Loading payroll details...
            </div>
          ) : payrolls.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-lg">No payroll records found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
              <h2 className="text-lg font-bold text-indigo-900 mb-4">
                Salary History
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-indigo-50 text-indigo-800 font-semibold text-left">
                      <th className="p-3 border-b">Month</th>
                      <th className="p-3 border-b text-right">Base Salary</th>
                      <th className="p-3 border-b text-right">Bonus</th>
                      <th className="p-3 border-b text-right">Deductions</th>
                      <th className="p-3 border-b text-right">Net Salary</th>
                      <th className="p-3 border-b text-center">Status</th>
                      <th className="p-3 border-b text-center">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {payrolls.map((p, i) => (
                      <tr
                        key={i}
                        className="border-b hover:bg-sky-50 transition duration-200"
                      >
                        <td className="p-3 text-gray-700 font-semibold">
                          {p.month}
                        </td>

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
                          {p.paymentStatus === "Paid" ? (
                            <span className="flex items-center justify-center gap-1 text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                              <FiCheckCircle />
                              Paid
                            </span>
                          ) : p.paymentStatus === "Pending" ? (
                            <span className="flex items-center justify-center gap-1 text-amber-700 bg-amber-100 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                              <FiCalendar />
                              Pending
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-1 text-red-700 bg-red-100 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                              <FiXCircle />
                              Failed
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-center text-gray-500">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
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
