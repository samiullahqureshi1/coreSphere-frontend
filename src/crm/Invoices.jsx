import { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiFileText,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";

export default function Invoices() {
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      client: "BrightTech",
      invoiceNumber: "INV-1001",
      issueDate: "2025-09-20",
      dueDate: "2025-10-05",
      amount: 2500,
      status: "Paid",
    },
    {
      id: 2,
      client: "FinGrow",
      invoiceNumber: "INV-1002",
      issueDate: "2025-09-25",
      dueDate: "2025-10-10",
      amount: 4200,
      status: "Pending",
    },
  ]);

  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    client: "",
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    amount: "",
    status: "Pending",
  });

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.status.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddInvoice = (e) => {
    e.preventDefault();
    const newEntry = { id: Date.now(), ...newInvoice };
    setInvoices((prev) => [...prev, newEntry]);
    setNewInvoice({
      client: "",
      invoiceNumber: "",
      issueDate: "",
      dueDate: "",
      amount: "",
      status: "Pending",
    });
    setIsDrawerOpen(false);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-100 text-emerald-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <FiCheckCircle className="text-emerald-600" />;
      case "Pending":
        return <FiClock className="text-amber-600" />;
      case "Overdue":
        return <FiAlertCircle className="text-red-600" />;
      default:
        return <FiFileText className="text-gray-600" />;
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
            <FiFileText className="text-sky-600" /> Invoices
          </h2>
          <p className="text-gray-500 text-sm">
            Manage client billing, due dates, and payment status.
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md transition"
        >
          <FiPlus size={16} />
          Add Invoice
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center border border-gray-200 bg-white px-3 py-2 rounded-xl w-72 shadow-sm mb-6 focus-within:ring-2 focus-within:ring-sky-600 transition">
        <FiSearch className="text-sky-600 mr-2" />
        <input
          type="text"
          placeholder="Search invoices..."
          className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Invoice Cards */}
      {filteredInvoices.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
                  <FiFileText className="text-sky-600" />
                  {inv.invoiceNumber}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 ${getStatusStyle(
                    inv.status
                  )}`}
                >
                  {getStatusIcon(inv.status)} {inv.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <FiUser className="text-sky-500" /> Client
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {inv.client}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <FiCalendar className="text-indigo-500" /> Issue Date
                  </span>
                  <span className="text-gray-700">
                    {new Date(inv.issueDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <FiCalendar className="text-indigo-500" /> Due Date
                  </span>
                  <span className="text-gray-700">
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <FiDollarSign className="text-emerald-500" /> Amount
                  </span>
                  <span className="text-indigo-800 font-semibold">
                    ${inv.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8 italic">
          No invoices found.
        </p>
      )}

      {/* Add Invoice Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl rounded-l-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5 bg-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900">Add New Invoice</h2>
          <FiX
            className="text-gray-500 cursor-pointer hover:text-red-500 transition"
            size={22}
            onClick={() => setIsDrawerOpen(false)}
          />
        </div>

        <div className="p-6">
          <form onSubmit={handleAddInvoice} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newInvoice.client}
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, client: e.target.value })
                }
                placeholder="Enter client name"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Invoice Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newInvoice.invoiceNumber}
                onChange={(e) =>
                  setNewInvoice({
                    ...newInvoice,
                    invoiceNumber: e.target.value,
                  })
                }
                placeholder="e.g. INV-2025"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={newInvoice.issueDate}
                  onChange={(e) =>
                    setNewInvoice({
                      ...newInvoice,
                      issueDate: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, dueDate: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Amount (USD)
              </label>
              <input
                type="number"
                value={newInvoice.amount}
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, amount: e.target.value })
                }
                placeholder="Enter amount"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Status
              </label>
              <select
                value={newInvoice.status}
                onChange={(e) =>
                  setNewInvoice({ ...newInvoice, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-bold transition shadow-lg"
            >
              Save Invoice
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
