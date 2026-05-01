import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="px-4 md:px-10 py-12">
      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-semibold text-center">
        Top Doctors to Book
      </h1>

      <p className="text-gray-500 text-center mt-3 max-w-2xl mx-auto">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>

      {/* Doctors List */}
      <div
        className="
          mt-10
          flex gap-6
          overflow-x-auto
          pb-4
          md:grid md:grid-cols-2 lg:grid-cols-4
          md:overflow-visible
        "
      >
        {doctors.slice(0, 10).map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className="
              min-w-[220px] md:min-w-0
              cursor-pointer
              rounded-xl
              bg-white
              shadow-md
              hover:shadow-lg
              transition
              p-4
            "
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg"
            />

            <div className="mt-3">
              <span className="text-green-600 text-sm font-medium">
                Available
              </span>
              <p className="font-semibold text-gray-800 mt-1">{item.name}</p>
              <p className="text-sm text-gray-500">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      {/* More Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => {
            navigate("/doctors");
            window.scrollTo(0, 0);
          }}
          className="
            px-8 py-3
            rounded-full
            bg-blue-600
            text-white
            font-semibold
            hover:bg-blue-700
            transition
          "
        >
          More
        </button>
      </div>
    </div>
  );
};

export default TopDoctors;
