import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(() => {
    const stored = localStorage.getItem("dToken");
    return stored && stored !== "undefined" && stored !== "null" ? stored : "";
  });
  const [appointments, setAppointments] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const authHeader = {
    headers: {
      Authorization: `Bearer ${dToken}`,
    },
  };

  /* ================= GET APPOINTMENTS ================= */
  const getAppointments = async () => {
    if (!dToken) return;
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/appointments`,
        authHeader,
      );

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      if (err.response?.status === 401) setDToken("");
      toast.error(err.response?.data?.message || "Failed to load appointments");
    }
  };

  /* ================= COMPLETE APPOINTMENT ================= */
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        authHeader,
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashboardData();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to complete appointment",
      );
    }
  };

  /* ================= CANCEL APPOINTMENT ================= */
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        authHeader,
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashboardData();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to cancel appointment",
      );
    }
  };

  /* ================= DASHBOARD DATA ================= */
  const getDashboardData = async () => {
    if (!dToken) return;
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/dashboard`,
        authHeader,
      );

      if (data.success) {
        setDashboardData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      if (err.response?.status === 401) setDToken("");
      toast.error(
        err.response?.data?.message || "Failed to load dashboard data",
      );
    }
  };

  /* ================= PROFILE DATA ================= */
  const getProfileData = async () => {
    if (!dToken) return;
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/profile`,
        authHeader,
      );

      if (data.success) {
        setProfileData(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      if (err.response?.status === 401) setDToken("");
      toast.error(err.response?.data?.message || "Failed to load profile data");
    }
  };

  /* ================= TOKEN PERSIST ================= */
  useEffect(() => {
    if (dToken) {
      localStorage.setItem("dToken", dToken);
      getAppointments();
      getDashboardData();
    } else {
      localStorage.removeItem("dToken");
      setAppointments([]);
      setDashboardData(null);
      setProfileData(null);
    }
  }, [dToken]);

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    dashboardData,
    profileData,
    getAppointments,
    getDashboardData,
    getProfileData,
    setProfileData,
    setAppointments,
    setDashboardData,
    completeAppointment,
    cancelAppointment,
  };

  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
