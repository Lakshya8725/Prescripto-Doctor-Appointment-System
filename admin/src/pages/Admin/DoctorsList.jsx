import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="w-full flex justify-center px-4 py-6">
      {/* CONTAINER */}
      <div className="w-full max-w-7xl">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Doctors List
        </h1>

        {/* GRID */}
        <div
          className="
            grid
            gap-6
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >
          {doctors?.map((item) => (
            <div
              key={item._id}
              className="
                bg-white
                border
                rounded-xl
                shadow-sm
                hover:shadow-md
                transition
                overflow-hidden
              "
            >
              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-44 object-cover"
              />

              {/* CONTENT */}
              <div className="p-4">
                <p className="text-lg font-semibold text-gray-800">
                  {item.name}
                </p>

                <p className="text-sm text-gray-500 mb-4">{item.speciality}</p>

                {/* AVAILABILITY */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={() => changeAvailability(item._id)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Available</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {doctors?.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No doctors found</p>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
