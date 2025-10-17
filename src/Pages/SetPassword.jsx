import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function SetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing token. Please check your email link.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 6)
      return setError("Password must be at least 6 characters long.");
    if (password !== confirm) return setError("Passwords do not match.");

    try {
      setLoading(true);
      const res = await fetch("https://core-sphere-backend.vercel.app/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Password set successfully! You can now log in.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Failed to set password.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-indigo-900 text-center mb-2">
          Set Your Password
        </h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Create a password to activate your employee account.
        </p>

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4 text-sm">
            <FiAlertCircle size={16} />
            {error}
          </div>
        )}
        {message && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4 text-sm">
            <FiCheckCircle size={16} />
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-indigo-900 mb-1">
              New Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-600">
              <FiLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-indigo-900 mb-1">
              Confirm Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-600">
              <FiLock className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Re-enter password"
                className="w-full outline-none text-sm"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className={`w-full py-2.5 text-white font-semibold rounded-lg shadow-md transition ${
              loading
                ? "bg-sky-400 cursor-not-allowed"
                : "bg-sky-600 hover:bg-sky-700"
            }`}
          >
            {loading ? "Saving..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
