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
import AnnouncementPage from "./Pages/AnnouncementPage";
import EmployeeAttendance from "./Pages/EmployeeAttendance";
import EmployeePayroll from "./Pages/EmployeePayroll";
import EmployeeLeaveManagement from "./Pages/EmployeeLeaveManagement";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/human-resources" element={<HumanResources />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/employee/tasks" element={<TaskBoard />} />
        <Route path="/employee/announcements" element={<AnnouncementPage />} />
        <Route path="/employee/attendance" element={<EmployeeAttendance />} />
        <Route path="/employee/payroll" element={<EmployeePayroll />} />
        <Route path="/employee/leave-management" element={<EmployeeLeaveManagement />} />

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
