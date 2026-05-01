import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";

import homeIcon from "../assets/assets_admin/home_icon.svg";
import appointmentIcon from "../assets/assets_admin/appointment_icon.svg";
import addIcon from "../assets/assets_admin/add_icon.svg";
import peopleIcon from "../assets/assets_admin/people_icon.svg";
import { DoctorContext } from "../context/DoctorContext";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <div className="w-64 min-h-screen bg-white border-r shadow-sm">
      {aToken && (
        <ul className="py-6 space-y-2">
          <li>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium
     ${
       isActive
         ? "bg-blue-100 text-blue-600 border-r-4 border-blue-600"
         : "text-gray-600 hover:bg-gray-100"
     }`
              }
            >
              <img src={homeIcon} className="h-5 w-5" />
              <p>Dashboard</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/appointments"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium
                 ${
                   isActive
                     ? "bg-blue-100 text-blue-600 border-r-4 border-blue-600"
                     : "text-gray-600 hover:bg-gray-100"
                 }`
              }
            >
              <img src={appointmentIcon} className="h-5 w-5" />
              <p>Appointments</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/add-doctor"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium
                 ${
                   isActive
                     ? "bg-blue-100 text-blue-600 border-r-4 border-blue-600"
                     : "text-gray-600 hover:bg-gray-100"
                 }`
              }
            >
              <img src={addIcon} className="h-5 w-5" />
              <p>Add Doctor</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/doctor-list"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium
                 ${
                   isActive
                     ? "bg-blue-100 text-blue-600 border-r-4 border-blue-600"
                     : "text-gray-600 hover:bg-gray-100"
                 }`
              }
            >
              <img src={peopleIcon} className="h-5 w-5" />
              <p>Doctors List</p>
            </NavLink>
          </li>
        </ul>
      )}

      {dToken && (
        <ul className="py-6 space-y-2">
          <li>
            <NavLink
              to="/doctor"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium
     ${
       isActive
         ? "bg-blue-100 text-blue-600 border-r-4 border-blue-600"
         : "text-gray-600 hover:bg-gray-100"
     }`
              }
            >
              <img src={homeIcon} className="h-5 w-5" />
              <p>Dashboard</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/doctor/appointments"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium
                 ${
                   isActive
                     ? "bg-blue-100 text-blue-600 border-r-4 border-blue-600"
                     : "text-gray-600 hover:bg-gray-100"
                 }`
              }
            >
              <img src={appointmentIcon} className="h-5 w-5" />
              <p>Appointments</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/doctor/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium
                 ${
                   isActive
                     ? "bg-blue-100 text-blue-600 border-r-4 border-blue-600"
                     : "text-gray-600 hover:bg-gray-100"
                 }`
              }
            >
              <img src={peopleIcon} className="h-5 w-5" />
              <p>Profile</p>
            </NavLink>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
