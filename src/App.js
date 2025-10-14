import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./Pages/Dashboard";
import TaskBoard from "./Pages/TaskBoard";
import HumanResources from "./Pages/HumanResources";
import CRM from "./Pages/CRM";
import LandingPage from "./component/LandingPage";
import Login from "./AuthForms";
import Signup from "./AuthSignUp";
import ProjectManagement from "./Pages/ProjectManagement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/taskbar" element={<ProjectManagement />} />
        <Route path="/human-resources" element={<HumanResources />} />
        <Route path="/crm" element={<CRM />} />

        <Route path="/home" element={<Navigate to="/dashboard" />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <h1 className="text-2xl font-semibold text-red-500">
                404 - Page Not Found
              </h1>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
