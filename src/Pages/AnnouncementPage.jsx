import { useState, useEffect } from "react";
import Sidebar from "../component/Sidebar"; // ✅ adjust path if needed
import {
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiUser,
  FiVolume2,
} from "react-icons/fi";

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/announcement/get");
        const data = await res.json();
        if (data.success) setAnnouncements(data.announcements.reverse());
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      return alert("Please fill in all fields.");
    }

    try {
      const res = await fetch("http://localhost:5000/api/announcement/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnouncement),
      });
      const data = await res.json();

      if (data.success) {
        setAnnouncements((prev) => [data.announcement, ...prev]);
        setShowModal(false);
        setNewAnnouncement({ title: "", content: "" });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/announcement/delete/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-white shadow-sm px-6 py-4 border-b border-gray-200">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-indigo-900">
              <FiVolume2 className="text-sky-600" size={24} />
              Announcements
            </h1>

            <p className="text-sm text-gray-500">
              Stay updated with the latest company news
            </p>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {announcements.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-lg">No announcements yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {announcements.map((a) => (
                <div
                  key={a._id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all p-5 relative group"
                >
                  {/* <FiTrash2
                    onClick={() => handleDelete(a._id)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 cursor-pointer transition"
                    size={18}
                  /> */}

                  <h2 className="text-xl font-bold text-indigo-900 mb-2 group-hover:text-sky-700 transition">
                    {a.title}
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {a.content.length > 150
                      ? a.content.slice(0, 150) + "..."
                      : a.content}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-2">
                    <span className="flex items-center gap-1">
                      <FiCalendar />{" "}
                      {new Date(a.createdAt).toLocaleDateString("en-GB")}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUser /> {a.author || "Admin"}
                    </span>
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
