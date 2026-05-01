import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const [filterDoc, setFilterDoc] = useState([]);

  const specialities = [
    "Gynecologist",
    "Gastroenterologist",
    "Pediatricians",
    "General physician",
    "Neurologist",
    "Dermatologist",
  ];

  // ✅ FILTER LOGIC (FIXED)
  useEffect(() => {
    if (!doctors || doctors.length === 0) return;

    if (speciality) {
      const filtered = doctors.filter(
        (doc) =>
          doc.speciality?.toLowerCase().trim() ===
          speciality.toLowerCase().trim(),
      );
      setFilterDoc(filtered);
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, speciality]);

  // ✅ LOADING STATE
  if (!doctors || doctors.length === 0) {
    return <p className="text-center mt-10">Loading doctors...</p>;
  }

  return (
    <div className="px-4 md:px-10 py-8">
      <p className="text-lg font-semibold mb-6">
        Browse through the doctors specialist
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT */}
        <div className="md:w-1/4">
          <button
            onClick={() => navigate("/doctors")}
            className="mb-6 w-full rounded-lg bg-gray-800 py-3 text-white"
          >
            All Doctors
          </button>

          <div className="flex flex-col gap-4">
            {specialities.map((item) => (
              <p
                key={item}
                onClick={() => navigate(`/doctors/${item}`)}
                className={`cursor-pointer rounded-md px-4 py-3 text-sm
                  ${
                    speciality === item
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-blue-600 hover:text-white"
                  }
                `}
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterDoc.length === 0 ? (
            <p>No doctors found for this speciality.</p>
          ) : (
            filterDoc.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/appointment/${item._id}`)}
                className="cursor-pointer rounded-xl bg-white shadow-md p-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg"
                />

                <div className="mt-3">
                  {item.available && (
                    <span className="text-green-600 text-sm font-medium">
                      Available
                    </span>
                  )}

                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.speciality}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
