import React, { useContext } from "react";
import adminLogo from "../assets/assets_admin/admin_logo.svg";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const navigate = useNavigate();

  const logout = () => {
    // Admin logout
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }

    // Doctor logout
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }

    navigate("/");
  };

  return (
    <div className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-3">
        <img src={adminLogo} alt="Logo" className="h-8 w-auto" />
        <p className="text-lg font-semibold text-gray-800">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>

      {/* Right */}
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-1.5 rounded-md text-sm font-medium
                   hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
