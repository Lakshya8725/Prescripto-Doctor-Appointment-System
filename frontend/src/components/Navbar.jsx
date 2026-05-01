import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/assets_frontend/logo.svg";
import profilePic from "../assets/assets_frontend/profile_pic.png";
import dropDownIcon from "../assets/assets_frontend/dropdown_icon.svg";
import menuIcon from "../assets/assets_frontend/menu_icon.svg";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);

  const [showMenu, setShowMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setShowProfileMenu(false);
    navigate("/login");
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 border-b relative">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={logo}
        alt="logo"
        className="w-36 cursor-pointer"
      />

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-8 font-medium">
        <NavLink to="/">HOME</NavLink>
        <NavLink to="/doctors">ALL DOCTORS</NavLink>
        <NavLink to="/about">ABOUT</NavLink>
        <NavLink to="/contact">CONTACT</NavLink>
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {token && userData ? (
          <>
            {/* Profile */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={userData.image}
                alt="profile"
              />
              <img className="w-3" src={dropDownIcon} alt="dropdown" />
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-12 bg-white border rounded-md shadow-md w-40 text-sm z-50">
                <p
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/my-profile");
                  }}
                >
                  My Profile
                </p>
                <p
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/my-appointments");
                  }}
                >
                  My Appointments
                </p>
                <p
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                  onClick={logout}
                >
                  Logout
                </p>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            Create Account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          src={menuIcon}
          alt="menu"
          className="w-6 cursor-pointer md:hidden"
          onClick={() => setShowMenu(!showMenu)}
        />
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="absolute top-16 left-0 w-full bg-white border-t shadow-md md:hidden z-40">
          <ul className="flex flex-col gap-4 px-6 py-4 font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              HOME
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              ALL DOCTORS
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              ABOUT
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              CONTACT
            </NavLink>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
