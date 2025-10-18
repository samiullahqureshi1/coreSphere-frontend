import { useState } from "react";
import {
  FiUsers,
  FiList,
  FiBriefcase,
  FiFileText,
  FiDollarSign,
  FiPhoneCall,
  FiPieChart,
  FiSettings,
} from "react-icons/fi";
import Sidebar from "../component/Sidebar";
import Leads from "../crm/Leads";
import Clients from "../crm/Clients";
import CRMProjects from "../crm/Project";
import ProposalsDeals from "../crm/ProposalsDeals";
import Invoices from "../crm/Invoices";
import Communications from "../crm/Comunication";
import Reports from "../crm/Reports";



export default function CRM() {
  const [activeTab, setActiveTab] = useState("leads");

  const tabs = [
    { key: "leads", label: "Leads", icon: <FiList /> },
        { key: "proposals", label: "Proposals", icon: <FiFileText /> },

    { key: "clients", label: "Clients", icon: <FiUsers /> },
    { key: "projects", label: "Projects", icon: <FiBriefcase /> },
    { key: "invoices", label: "Invoices", icon: <FiDollarSign /> },
    { key: "communications", label: "Communications", icon: <FiPhoneCall /> },
    { key: "reports", label: "Reports", icon: <FiPieChart /> },
    { key: "settings", label: "Settings", icon: <FiSettings /> },
  ];

  // render selected tab component dynamically
  const renderContent = () => {
    switch (activeTab) {
      case "leads":
        return <Leads />;
      case "clients":
        return <Clients />;
      case "projects":
        return <CRMProjects />;
      case "proposals":
        return <ProposalsDeals />;
      case "invoices":
        return <Invoices />;
      case "communications":
        return <Communications />;
      case "reports":
        return <Reports />;
      // case "settings":
      //   return <Settings />;
      default:
        return <Leads />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700">CRM Module</h1>
          <p className="text-sm text-gray-500">
            Manage Clients • Leads • Projects • Billing
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-indigo-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Render Active Tab */}
        <div className="bg-white rounded-2xl p-6 shadow-md transition-all duration-300">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
