import React from "react";
import { useNavigate } from "react-router-dom";
import { FaProjectDiagram, FaUsers, FaSuitcase } from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-16 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 rounded-full p-2">
            <span className="text-white font-bold text-lg">∞</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">CoreSphere</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-700 font-medium hover:text-blue-600"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center justify-center flex-grow px-6 md:px-0 mt-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          The All-In-One Platform <br />
          <span className="text-blue-600">to Run Your Business</span>
        </h2>
        <p className="text-gray-600 mt-6 max-w-xl">
          CoreSphere unifies project management, HR, CRM, and performance tracking
          into a single, collaborative workspace. Stop juggling tools and start
          building momentum.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold"
          >
            Get Started for Free
          </button>
          <button
            className="border border-gray-300 hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-md font-semibold"
          >
            Request a Demo
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-gray-900">
            One Platform, Endless Possibilities
          </h3>
          <p className="text-gray-600 mt-3 mb-12">
            Everything you need to manage your company, in one place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-xl p-6 text-left transition">
              <div className="bg-blue-100 inline-flex p-3 rounded-md mb-4">
                <FaProjectDiagram className="text-blue-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Project Management
              </h4>
              <p className="text-gray-600 text-sm">
                Visualize workflows with our intuitive Kanban boards, Gantt charts,
                and task lists.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-xl p-6 text-left transition">
              <div className="bg-blue-100 inline-flex p-3 rounded-md mb-4">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                HR Management
              </h4>
              <p className="text-gray-600 text-sm">
                Streamline employee profiles, leave tracking, and recruitment all
                in one place.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-xl p-6 text-left transition">
              <div className="bg-blue-100 inline-flex p-3 rounded-md mb-4">
                <FaSuitcase className="text-blue-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">CRM & Sales</h4>
              <p className="text-gray-600 text-sm">
                Manage leads and sales pipelines effortlessly to grow your
                business.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
