import { useEffect, useState } from "react";
import axios from "axios";
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
  FiEdit,
  FiEye,
  FiTrash2,
} from "react-icons/fi";

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");

  // Drawer controls
  const [drawerType, setDrawerType] = useState(""); // "add" | "edit" | "view"
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // New/edit invoice data
  const [invoiceData, setInvoiceData] = useState({
    client: "",
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    amount: "",
    status: "Pending",
  });

  // ✅ Fetch all invoices
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data } = await axios.get(
        "https://core-sphere-backend.vercel.app/api/invoices/getInvoices"
      );
      if (data.success) setInvoices(data.invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  // ✅ Handle add invoice
  const handleAddInvoice = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://core-sphere-backend.vercel.app/api/invoices/addInvoice",
        invoiceData
      );
      if (data.success) {
        setInvoices((prev) => [data.invoice, ...prev]);
        closeDrawer();
      }
    } catch (error) {
      console.error("Error adding invoice:", error);
    }
  };

  // ✅ Handle update invoice
  const handleUpdateInvoice = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `https://core-sphere-backend.vercel.app/api/invoices/updateInvoice/${selectedInvoice._id}`,
        invoiceData
      );
      if (data.success) {
        setInvoices((prev) =>
          prev.map((inv) => (inv._id === data.invoice._id ? data.invoice : inv))
        );
        closeDrawer();
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  // ✅ Handle delete
  const handleDeleteInvoice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const { data } = await axios.delete(
        `https://core-sphere-backend.vercel.app/api/invoices/deleteInvoice/${id}`
      );
      if (data.success) {
        setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  // ✅ Filter
  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.status.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Drawer control helpers
  const openDrawer = (type, invoice = null) => {
    setDrawerType(type);
    setSelectedInvoice(invoice);

    if (invoice) {
      setInvoiceData({
        client: invoice.client,
        invoiceNumber: invoice.invoiceNumber,
        issueDate: invoice.issueDate.split("T")[0],
        dueDate: invoice.dueDate.split("T")[0],
        amount: invoice.amount,
        status: invoice.status,
      });
    } else {
      setInvoiceData({
        client: "",
        invoiceNumber: "",
        issueDate: "",
        dueDate: "",
        amount: "",
        status: "Pending",
      });
    }
  };

  const closeDrawer = () => {
    setDrawerType("");
    setSelectedInvoice(null);
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
          onClick={() => openDrawer("add")}
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
              key={inv._id}
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
                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <FiUser className="text-sky-500" /> Client
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {inv.client}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <FiCalendar className="text-indigo-500" /> Issue
                  </span>
                  <span>{new Date(inv.issueDate).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between border-b pb-1">
                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <FiCalendar className="text-indigo-500" /> Due
                  </span>
                  <span>{new Date(inv.dueDate).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium flex items-center gap-2">
                    <FiDollarSign className="text-emerald-500" /> Amount
                  </span>
                  <span className="text-indigo-800 font-semibold">
                    ${inv.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 text-sm">
                <button
                  onClick={() => openDrawer("view", inv)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <FiEye /> View
                </button>
                <button
                  onClick={() => openDrawer("edit", inv)}
                  className="text-green-600 hover:text-green-800 flex items-center gap-1"
                >
                  <FiEdit /> Edit
                </button>
                <button
                  onClick={() => handleDeleteInvoice(inv._id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8 italic">
          No invoices found.
        </p>
      )}

      {/* 🟢 Add / Edit Drawer */}
      {(drawerType === "add" || drawerType === "edit") && (
        <>
          <div
            className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl rounded-l-2xl transform transition-transform duration-300 z-50 overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b px-6 py-5 bg-indigo-50">
              <h2 className="text-xl font-bold text-indigo-900">
                {drawerType === "add" ? "Add New Invoice" : "Edit Invoice"}
              </h2>
              <FiX
                className="text-gray-500 cursor-pointer hover:text-red-500 transition"
                size={22}
                onClick={closeDrawer}
              />
            </div>

            <div className="p-6">
              <form
                onSubmit={
                  drawerType === "add" ? handleAddInvoice : handleUpdateInvoice
                }
                className="space-y-5"
              >
                <input
                  type="text"
                  placeholder="Client name"
                  value={invoiceData.client}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, client: e.target.value })
                  }
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Invoice Number"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      invoiceNumber: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={invoiceData.issueDate}
                    onChange={(e) =>
                      setInvoiceData({
                        ...invoiceData,
                        issueDate: e.target.value,
                      })
                    }
                    className="border rounded-xl px-3 py-2 text-sm"
                  />
                  <input
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) =>
                      setInvoiceData({
                        ...invoiceData,
                        dueDate: e.target.value,
                      })
                    }
                    className="border rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Amount"
                  value={invoiceData.amount}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, amount: e.target.value })
                  }
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                />
                <select
                  value={invoiceData.status}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, status: e.target.value })
                  }
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>

                <button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold"
                >
                  {drawerType === "add" ? "Save Invoice" : "Update Invoice"}
                </button>
              </form>
            </div>
          </div>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={closeDrawer}
          ></div>
        </>
      )}

      {/* 🔵 View Drawer */}
      {drawerType === "view" && selectedInvoice && (
        <>
          <div className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl rounded-l-2xl z-50 overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-5 bg-indigo-50">
              <h2 className="text-xl font-bold text-indigo-900">
                Invoice Details
              </h2>
              <FiX
                className="text-gray-500 cursor-pointer hover:text-red-500 transition"
                size={22}
                onClick={closeDrawer}
              />
            </div>
            <div className="p-6 space-y-4 text-sm">
              <p>
                <strong>Client:</strong> {selectedInvoice.client}
              </p>
              <p>
                <strong>Invoice No:</strong> {selectedInvoice.invoiceNumber}
              </p>
              <p>
                <strong>Issue Date:</strong>{" "}
                {new Date(selectedInvoice.issueDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Due Date:</strong>{" "}
                {new Date(selectedInvoice.dueDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Amount:</strong> ${selectedInvoice.amount}
              </p>
              <p>
                <strong>Status:</strong> {selectedInvoice.status}
              </p>
            </div>
          </div>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={closeDrawer}
          ></div>
        </>
      )}
    </div>
  );
}
