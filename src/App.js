// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import TaskBoard from "./Pages/TaskBoard";
import HumanResources from "./Pages/HumanResources";
import CRM from "./Pages/CRM";



const App = () => {
  return (
    <Router>
        {/* Sidebar */}

        {/* Main Content */}
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/taskbar" element={<TaskBoard />} />
                        <Route path="/human-resources" element={<HumanResources />} />
                        <Route path="/crm" element={<CRM />} />

            {/* <Route path="/crm" element={<CRM />} />
            <Route path="/hrm" element={<HRM />} />
            <Route path="/pms" element={<PMS />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} /> */}
            <Route path="*" element={<h1 className="text-center text-red-500">404 - Page Not Found</h1>} />
          </Routes>
        
    </Router>
  );
};

export default App;
