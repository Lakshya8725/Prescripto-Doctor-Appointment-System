import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const RelatedDoctors = ({ docId, speciality }) => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const relatedDoctors = doctors.filter(
    (doc) => doc.speciality === speciality && doc._id !== docId,
  );

  return (
    <div className="mt-10">
      {/* Cards */}
      <div
        className="
          flex gap-6
          overflow-x-auto
          pb-4
          md:grid md:grid-cols-2 lg:grid-cols-4
          md:overflow-visible
        "
      >
        {relatedDoctors.slice(0, 5).map((doc) => (
          <div
            key={doc._id}
            onClick={() => navigate(`/appointment/${doc._id}`)}
            className="
              min-w-[240px] md:min-w-0
              cursor-pointer
              rounded-2xl
              bg-white
              border
              hover:shadow-lg
              transition
            "
          >
            {/* Image Section */}
            <div className="bg-indigo-50 rounded-t-2xl flex items-center justify-center h-52">
              <img
                src={doc.image}
                alt={doc.name}
                className="h-44 object-contain"
              />
            </div>

            {/* Info Section */}
            <div className="p-4">
              {/* Available */}
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <p className="text-green-600 text-sm font-medium">Available</p>
              </div>

              <p className="font-semibold text-gray-800">{doc.name}</p>

              <p className="text-sm text-gray-500">{doc.speciality}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedDoctors;
