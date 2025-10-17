import { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiPhoneCall,
  FiMail,
  FiMessageSquare,
  FiCalendar,
  FiUser,
  FiClock,
  FiX,
} from "react-icons/fi";

export default function Communications() {
  const [communications, setCommunications] = useState([
    {
      id: 1,
      client: "BrightTech",
      type: "Email",
      subject: "Proposal follow-up",
      details: "Sent proposal follow-up regarding project redesign.",
      date: "2025-10-12T10:00",
    },
    {
      id: 2,
      client: "FinGrow",
      type: "Call",
      subject: "Budget discussion",
      details: "Had a quick call regarding project cost adjustments.",
      date: "2025-10-14T15:30",
    },
  ]);

  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newComm, setNewComm] = useState({
    client: "",
    type: "Email",
    subject: "",
    details: "",
    date: "",
  });

  const filteredComms = communications.filter(
    (c) =>
      c.client.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeIcon = (type) => {
    switch (type) {
      case "Call":
        return <FiPhoneCall className="text-emerald-600" />;
      case "Email":
        return <FiMail className="text-sky-600" />;
      case "Meeting":
        return <FiCalendar className="text-indigo-600" />;
      case "Message":
        return <FiMessageSquare className="text-purple-600" />;
      default:
        return <FiMessageSquare className="text-gray-500" />;
    }
  };

  const handleAddComm = (e) => {
    e.preventDefault();
    const newEntry = { id: Date.now(), ...newComm };
    setCommunications((prev) => [newEntry, ...prev]);
    setNewComm({
      client: "",
      type: "Email",
      subject: "",
      details: "",
      date: "",
    });
    setIsDrawerOpen(false);
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
            <FiPhoneCall className="text-sky-600" /> Communications
          </h2>
          <p className="text-gray-500 text-sm">
            Track emails, calls, meetings, and messages with your clients.
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md transition"
        >
          <FiPlus size={16} />
          Add Communication
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center border border-gray-200 bg-white px-3 py-2 rounded-xl w-72 shadow-sm mb-6 focus-within:ring-2 focus-within:ring-sky-600 transition">
        <FiSearch className="text-sky-600 mr-2" />
        <input
          type="text"
          placeholder="Search communications..."
          className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Communication Cards */}
      {filteredComms.length > 0 ? (
        <div className="space-y-4">
          {filteredComms.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-200"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(c.type)}
                  <h3 className="text-lg font-semibold text-indigo-900">
                    {c.subject}
                  </h3>
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <FiClock /> {new Date(c.date).toLocaleString()}
                </span>
              </div>

              <div className="text-sm text-gray-700 mb-3">
                {c.details || "No details provided."}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600 border-t border-gray-100 pt-2">
                <span className="flex items-center gap-2 font-medium">
                  <FiUser className="text-sky-500" /> {c.client}
                </span>
                <span className="font-semibold text-sky-700">{c.type}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8 italic">
          No communications found.
        </p>
      )}

      {/* Add Communication Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl rounded-l-2xl transform transition-transform duration-300 z-50 overflow-y-auto ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5 bg-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900">
            Add Communication
          </h2>
          <FiX
            className="text-gray-500 cursor-pointer hover:text-red-500 transition"
            size={22}
            onClick={() => setIsDrawerOpen(false)}
          />
        </div>

        <div className="p-6">
          <form onSubmit={handleAddComm} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newComm.client}
                onChange={(e) =>
                  setNewComm({ ...newComm, client: e.target.value })
                }
                placeholder="Enter client name"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Type
              </label>
              <select
                value={newComm.type}
                onChange={(e) =>
                  setNewComm({ ...newComm, type: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              >
                <option value="Email">Email</option>
                <option value="Call">Call</option>
                <option value="Meeting">Meeting</option>
                <option value="Message">Message</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={newComm.subject}
                onChange={(e) =>
                  setNewComm({ ...newComm, subject: e.target.value })
                }
                placeholder="Enter subject"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Details / Notes
              </label>
              <textarea
                rows={3}
                value={newComm.details}
                onChange={(e) =>
                  setNewComm({ ...newComm, details: e.target.value })
                }
                placeholder="Add details about this communication"
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={newComm.date}
                onChange={(e) =>
                  setNewComm({ ...newComm, date: e.target.value })
                }
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl text-sm font-bold transition shadow-lg"
            >
              Save Communication
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
