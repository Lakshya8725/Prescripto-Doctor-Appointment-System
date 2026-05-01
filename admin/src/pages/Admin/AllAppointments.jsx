import React, { useEffect, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import cancelIcon from "../../assets/assets_admin/cancel_icon.svg";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);

  const { calculateAge, formatDateVerbose, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken, getAllAppointments]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm w-full">
      <p className="text-2xl font-semibold text-gray-800 mb-6">
        All Appointments
      </p>

      <div className="w-full overflow-x-auto">
        {/* TABLE HEADER */}
        <div
          className="
            grid grid-cols-7
            min-w-[900px]
            items-center
            bg-gray-50
            px-6 py-4
            rounded-lg
            border
            text-sm
            font-semibold
            text-gray-600
          "
        >
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p className="text-center">Actions</p>
        </div>

        {/* TABLE ROWS */}
        {appointments.map((item, index) => (
          <div
            key={item._id}
            className="
              grid grid-cols-7
              min-w-[900px]
              items-center
              px-6 py-4
              border-b
              text-sm
              text-gray-700
              hover:bg-gray-50
              transition
            "
          >
            {/* Index */}
            <p>{index + 1}</p>

            {/* Patient */}
            <div className="flex items-center gap-3">
              <img
                src={item.userData?.image || "/default-user.png"}
                alt="Patient"
                className="w-9 h-9 rounded-full object-cover"
              />
              <p className="font-medium">{item.userData?.name}</p>
            </div>

            {/* Age */}
            <p>{calculateAge(item.userData?.dob)}</p>

            {/* Date & Time */}
            <p>
              {formatDateVerbose(item.slotDate)}, {item.slotTime}
            </p>

            {/* Doctor */}
            <div className="flex items-center gap-3">
              <img
                src={item.docData?.image || "/default-doctor.png"}
                alt="Doctor"
                className="w-9 h-9 rounded-full object-cover"
              />
              <p className="font-medium">{item.docData?.name}</p>
            </div>

            {/* Fees */}
            <p className="font-medium">
              {currency}
              {item.amount}
            </p>

            {/* Actions */}
            <div className="flex justify-center">
              {item.cancelled ? (
                <span
                  className="
                    px-3 py-1
                    text-xs font-semibold
                    text-red-600
                    bg-red-100
                    rounded-full
                    cursor-not-allowed
                  "
                >
                  Cancelled
                </span>
              ) : (
                <img
                  src={cancelIcon}
                  alt="Cancel"
                  onClick={() => cancelAppointment(item._id)}
                  className="
                    w-5 h-5
                    cursor-pointer
                    transition
                    hover:scale-110
                    hover:opacity-80
                  "
                />
              )}
            </div>
          </div>
        ))}

        {appointments.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No appointments found
          </p>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
