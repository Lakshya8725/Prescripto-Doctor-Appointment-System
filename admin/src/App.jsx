import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AdminContext } from "./context/AdminContext.jsx";
import { DoctorContext } from "./context/DoctorContext.jsx";

import Login from "./pages/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

import Dashboard from "./pages/Admin/Dashboard.jsx";
import AllAppointments from "./pages/Admin/AllAppointments.jsx";
import AddDoctor from "./pages/Admin/AddDoctor.jsx";
import DoctorsList from "./pages/Admin/DoctorsList.jsx";

import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile.jsx";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  // 🔒 Not logged in
  if (!aToken && !dToken) {
    return (
      <>
        <ToastContainer />
        <Login />
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <Navbar />

      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar should know role internally */}
        <Sidebar />

        <Routes>
          {/* ================= ADMIN ROUTES ================= */}
          {aToken && (
            <>
              <Route path="/" element={<Navigate to="/admin" />} />
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/appointments" element={<AllAppointments />} />
              <Route path="/admin/add-doctor" element={<AddDoctor />} />
              <Route path="/admin/doctor-list" element={<DoctorsList />} />
            </>
          )}

          {/* ================= DOCTOR ROUTES ================= */}
          {dToken && (
            <>
              <Route path="/" element={<Navigate to="/doctor" />} />
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route
                path="/doctor/appointments"
                element={<DoctorAppointments />}
              />
              <Route path="/doctor/profile" element={<DoctorProfile />} />
            </>
          )}

          {/* 🚫 Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
