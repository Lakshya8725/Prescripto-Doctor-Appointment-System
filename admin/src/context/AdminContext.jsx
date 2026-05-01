import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [aToken, setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);

  /* 🔐 Persist admin token */
  useEffect(() => {
    if (aToken) {
      localStorage.setItem("aToken", aToken);
    } else {
      localStorage.removeItem("aToken");
    }
  }, [aToken]);

  /* 🩺 Get all doctors */
  const getAllDoctors = async () => {
    if (!aToken) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load doctors");
    }
  };

  /* 🔄 Change doctor availability */
  const changeAvailability = async (docId) => {
    if (!aToken) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { doctorId: docId }, // ✅ KEY FIX
        {
          headers: { Authorization: `Bearer ${aToken}` },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update availability",
      );
    }
  };

  /* 📅 Get all appointments */
  const getAllAppointments = async () => {
    if (!aToken) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load appointments");
    }
  };

  /* ❌ Cancel appointment (ADMIN) */
  const cancelAppointment = async (appointmentId) => {
    if (!aToken) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${aToken}` },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to cancel appointment",
      );
    }
  };

  /* 📊 Get dashboard data */
  const getDashData = async () => {
    if (!aToken) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${aToken}` },
      });

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load dashboard data",
      );
    }
  };

  /* 🚀 Auto-load admin data */
  useEffect(() => {
    if (aToken) {
      getAllDoctors();
      getAllAppointments();
      getDashData();
    } else {
      setDoctors([]);
      setAppointments([]);
      setDashData(null);
    }
  }, [aToken]);

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    appointments,
    dashData,
    getAllDoctors,
    getAllAppointments,
    getDashData,
    changeAvailability,
    cancelAppointment,
    setAppointments,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;
