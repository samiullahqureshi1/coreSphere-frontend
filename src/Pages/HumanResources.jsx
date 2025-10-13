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
} from "react-icons/fi";

export default function HumanResources() {
  const [activeTab, setActiveTab] = useState("employees");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    avatar: "",
  });

  // === FETCH EMPLOYEES FROM API ===
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:5000/Employee/getEmployee");
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

      const res = await fetch("http://localhost:5000/Employee/addEmployee", {
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

  const leaves = [
    {
      name: "Bob Williams",
      role: "Frontend Developer",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      type: "Vacation",
      dates: "Aug 9, 2024 - Aug 14, 2024",
      status: "Approved",
      color: "bg-green-100 text-green-700",
    },
  ];

  const attendance = [
    { name: "John Smith", date: "Oct 12, 2025", status: "Present" },
    { name: "Mary Adams", date: "Oct 12, 2025", status: "Absent" },
  ];

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

  return (
    <div className="flex h-screen bg-gray-100 relative overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white px-6 py-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Human Resources
            </h1>
            <p className="text-gray-500 text-sm">
              Manage employees, leaves, attendance, payroll, and more.
            </p>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <FiPlus size={16} /> Add Employee
          </button>
        </header>

        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-2 flex-wrap py-4">
            {[
              { key: "employees", label: "Employees", icon: <FiUser /> },
              { key: "leave", label: "Leave Management", icon: <FiCalendar /> },
              { key: "attendance", label: "Attendance", icon: <FiClock /> },
              { key: "payroll", label: "Payroll", icon: <FiDollarSign /> },
              {
                key: "recruitment",
                label: "Recruitment",
                icon: <FiBriefcase />,
              },
              { key: "performance", label: "Performance", icon: <FiStar /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-white hover:shadow-sm border border-transparent"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 bg-white px-3 py-2 rounded-lg w-64 shadow-sm">
              <FiSearch className="text-gray-400 mr-2" />
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
                className="w-full text-sm outline-none"
              />
            </div>

            {activeTab === "employees" && (
              <select className="border border-gray-300 bg-white text-sm rounded-lg px-3 py-2 shadow-sm outline-none hover:border-blue-500">
                <option value="">All Departments</option>
                <option value="HR">HR</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
            )}

            {activeTab === "leave" && (
              <select className="border border-gray-300 bg-white text-sm rounded-lg px-3 py-2 shadow-sm outline-none hover:border-blue-500">
                <option value="">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            )}

            {activeTab === "attendance" && (
              <select className="border border-gray-300 bg-white text-sm rounded-lg px-3 py-2 shadow-sm outline-none hover:border-blue-500">
                <option value="">All Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Remote">Remote</option>
              </select>
            )}

            {activeTab === "payroll" && (
              <select className="border border-gray-300 bg-white text-sm rounded-lg px-3 py-2 shadow-sm outline-none hover:border-blue-500">
                <option value="">All Months</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="September">September</option>
                <option value="October">October</option>
              </select>
            )}

            {activeTab === "recruitment" && (
              <select className="border border-gray-300 bg-white text-sm rounded-lg px-3 py-2 shadow-sm outline-none hover:border-blue-500">
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Closed">Closed</option>
              </select>
            )}

            {activeTab === "performance" && (
              <select className="border border-gray-300 bg-white text-sm rounded-lg px-3 py-2 shadow-sm outline-none hover:border-blue-500">
                <option value="">All Ratings</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
              </select>
            )}
          </div>
        </div>

        <main className="p-6 overflow-y-auto">
          {activeTab === "employees" && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {employees.length ? (
                employees.map((emp, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center hover:shadow-md transition"
                  >
                    <img
                      src={
                        emp.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          emp.name
                        )}&background=random`
                      }
                      alt={emp.name}
                      className="w-20 h-20 rounded-full object-cover mb-4"
                    />
                    <h3 className="text-gray-800 font-semibold">{emp.name}</h3>
                    <p className="text-gray-500 text-sm">{emp.role}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-4">
                  No employees found.
                </p>
              )}
            </div>
          )}

          {activeTab === "leave" && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h2 className="font-semibold mb-3 text-gray-700">
                Leave Requests
              </h2>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 font-semibold">
                  <tr>
                    <th className="p-2 text-left">Employee</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Dates</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map((l, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2 flex items-center gap-3">
                        <img
                          src={l.avatar}
                          alt={l.name}
                          className="w-8 h-8 rounded-full"
                        />
                        {l.name}
                      </td>
                      <td className="p-2">{l.type}</td>
                      <td className="p-2">{l.dates}</td>
                      <td className="p-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${l.color}`}
                        >
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h2 className="font-semibold mb-3 text-gray-700">
                Attendance Records
              </h2>
              <ul className="divide-y divide-gray-100">
                {attendance.map((a, i) => (
                  <li key={i} className="py-2 flex justify-between">
                    <span>{a.name}</span>
                    <span className="text-gray-500">{a.date}</span>
                    <span
                      className={`${
                        a.status === "Present"
                          ? "text-green-600"
                          : "text-red-500"
                      } font-medium`}
                    >
                      {a.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "payroll" && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h2 className="font-semibold mb-3 text-gray-700">
                Payroll Summary
              </h2>
              {payroll.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between py-2 border-b text-sm"
                >
                  <span>{p.name}</span>
                  <span>{p.month}</span>
                  <span className="font-semibold text-gray-800">
                    {p.salary}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "recruitment" && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h2 className="font-semibold mb-3 text-gray-700">
                Open Positions
              </h2>
              {recruitment.map((r, i) => (
                <div
                  key={i}
                  className="py-2 border-b flex justify-between text-sm"
                >
                  <span>{r.position}</span>
                  <span className="text-gray-500">{r.status}</span>
                  <span className="font-semibold">
                    {r.applicants} applicants
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "performance" && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h2 className="font-semibold mb-3 text-gray-700">
                Performance Reviews
              </h2>
              {performance.map((p, i) => (
                <div
                  key={i}
                  className="py-2 border-b flex justify-between text-sm"
                >
                  <span>{p.name}</span>
                  <span className="text-gray-500">{p.rating}</span>
                  <span className="font-semibold text-blue-600">
                    {p.score}/10
                  </span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-800">Add Employee</h2>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            encType="multipart/form-data"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Enter full name"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter email address"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="+92 300 1234567"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  type="date"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role / Position
                </label>
                <input
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Joining Date
                </label>
                <input
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  type="date"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Salary (Monthly)
              </label>
              <input
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                type="number"
                placeholder="e.g. 50000"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture (Single)
              </label>
              <input
                name="avatar"
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.files[0] })
                }
                type="file"
                accept="image/*"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Documents (Multiple)
              </label>

              {/* Input Field */}
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
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white 
      file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 
      file:bg-green-50 file:text-green-600 hover:file:bg-green-100"
              />

              {formData.documents && formData.documents.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.documents.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-6 h-6 rounded-full mr-2 object-cover border"
                        />
                      ) : (
                        <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full mr-2">
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
                        className="ml-2 text-red-500 hover:text-red-700"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Employee"}
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
