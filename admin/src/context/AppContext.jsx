import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  // ✅ READ BACKEND URL FROM .env
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const currency = "$";

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const today = new Date();
    const birthDate = new Date(dob);
    return today.getFullYear() - birthDate.getFullYear();
  };

  const formatDateVerbose = (slotDate) => {
    if (!slotDate) return "";

    let d, m, y;
    if (slotDate instanceof Date) {
      d = slotDate.getDate();
      m = slotDate.getMonth() + 1;
      y = slotDate.getFullYear();
    } else {
      const parts = slotDate.split("-");
      d = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10);
      y = parseInt(parts[2], 10);
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const ordinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };

    return `${d}${ordinal(d)} ${months[m - 1]} ${y}`;
  };

  // ✅ PROVIDE backendUrl
  const value = {
    backendUrl,
    currency,
    calculateAge,
    formatDateVerbose,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
