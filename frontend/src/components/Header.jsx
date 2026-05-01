import React from "react";
import GroupProfile from "../assets/assets_frontend/group_profiles.png";
import ArrowIcon from "../assets/assets_frontend/arrow_icon.svg";
import HeaderImage from "../assets/assets_frontend/header_img.png";

const Header = () => {
  return (
    <div className="bg-blue-50 px-6 md:px-16 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10">
      {/* Left Side */}
      <div className="max-w-xl">
        <p className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
          Book Appointment <br /> With Trusted Doctors
        </p>

        <div className="flex items-center gap-4 mt-6">
          <img src={GroupProfile} alt="" className="w-24" />
          <p className="text-gray-600 text-sm">100+ Trusted Doctors</p>
        </div>

        <a
          href="#speciality"
          className="inline-flex items-center gap-2 mt-8 bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-blue-700 transition"
        >
          Book Appointment
          <img src={ArrowIcon} alt="" className="w-4" />
        </a>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img src={HeaderImage} alt="" className="w-full max-w-md" />
      </div>
    </div>
  );
};

export default Header;
