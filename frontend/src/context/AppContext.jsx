import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const currencySymbol = "$";

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem("token");
    return stored && stored !== "undefined" && stored !== "null" ? stored : "";
  });
  const [userData, setUserData] = useState(null);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) setDoctors(data.doctors);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`);
      if (data.success) setUserData(data.userData);
      else toast.error(data.message);
    } catch (err) {
      if (err.response?.status === 401) {
        setToken("");
        localStorage.removeItem("token");
        return;
      }
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    getDoctorsData();
  }, [backendUrl]);

  useEffect(() => {
    if (token) loadUserProfileData();
    else setUserData(null);
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        doctors,
        currencySymbol,
        backendUrl,
        getDoctorsData,
        token,
        setToken,
        userData,
        setUserData,
        loadUserProfileData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
