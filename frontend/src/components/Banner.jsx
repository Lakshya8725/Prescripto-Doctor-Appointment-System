import React from "react";
import appointmentImage from "../assets/assets_frontend/appointment_img.png";
import { useNavigate } from "react-router-dom";
const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="px-6 md:px-16 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Blue banner */}
        <div className="bg-indigo-500 rounded-2xl px-14 py-10 flex justify-between items-center">
          {/* Left text */}
          <div className="text-white max-w-lg">
            <h2 className="text-4xl font-bold">Book Appointment</h2>
            <p className="text-2xl font-semibold mt-3">
              With 100+ Trusted Doctors
            </p>

            <button
              onClick={() => {
                navigate("/login");
                scrollTo(0, 0);
              }}
              className="
                mt-8
                bg-white text-indigo-600
                px-8 py-3
                rounded-full
                font-medium
                cursor-pointer
                transition
                hover:bg-gray-100
                hover:scale-105
                hover:shadow-md
                active:scale-95
              "
            >
              Create account
            </button>
          </div>

          {/* Right image */}
          <img
            src={appointmentImage}
            alt="Doctor"
            className="h-80 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
