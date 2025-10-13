import { useState } from "react";

export default function EmployeeLeaveForm() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/Leave/addLeave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          employeeId: user._id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Leave request submitted successfully!");
        setForm({ leaveType: "", startDate: "", endDate: "", reason: "" });
      } else {
        alert(data.message || "Failed to submit leave request");
      }
    } catch (error) {
      alert("Error submitting leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Apply for Leave</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="leaveType"
          value={form.leaveType}
          onChange={(e) => setForm({ ...form, leaveType: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
          required
        >
          <option value="">Select Leave Type</option>
          <option value="Vacation">Vacation</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Maternity">Maternity</option>
        </select>

        <div className="flex gap-4">
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
            required
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
            required
          />
        </div>

        <textarea
          name="reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          placeholder="Reason for leave..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Leave Request"}
        </button>
      </form>
    </div>
  );
}
