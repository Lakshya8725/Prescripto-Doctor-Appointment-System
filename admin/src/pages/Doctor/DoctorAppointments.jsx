import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import cancelIcon from "../../assets/assets_admin/cancel_icon.svg";
import AcceptIcon from "../../assets/assets_admin/tick_icon.svg";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleAccept = async (id) => {
    await completeAppointment(id);
  };

  const handleReject = async (id) => {
    await cancelAppointment(id);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 bg-gray-50 min-h-screen">
      <p className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5">
        All Appointments
      </p>

      {/* ================= MOBILE VIEW ================= */}
      <div className="space-y-4 md:hidden">
        {appointments.length === 0 && (
          <p className="text-center text-gray-500">No appointments found</p>
        )}

        {appointments.reverse().map((item, index) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-sm p-4 space-y-2"
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-800">
                {item.userData?.name}
              </p>
              <span className="text-xs text-gray-500">#{index + 1}</span>
            </div>

            <p className="text-sm text-gray-600">
              {item.slotDate}, {item.slotTime}
            </p>

            <p className="text-sm">
              Age:{" "}
              <span className="font-medium">
                {calculateAge(item.userData?.dob)}
              </span>
            </p>

            <div className="flex justify-between items-center text-sm">
              <p>
                Fees: <span className="font-medium">₹{item.amount}</span>
              </p>
              {item.payment ? (
                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">
                  Paid
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                  Cash
                </span>
              )}
            </div>

            {/* MOBILE ACTION / STATUS */}
            <div className="mt-3">
              {item.isCompleted ? (
                <span className="block text-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md">
                  Accepted
                </span>
              ) : item.cancelled ? (
                <span className="block text-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md">
                  Cancelled
                </span>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(item._id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-md text-sm hover:bg-green-700 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(item._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-md text-sm hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
        <div className="grid grid-cols-[40px_1.5fr_1fr_60px_1.5fr_80px_80px] min-w-[1000px] px-6 py-4 bg-gray-50 border-b text-sm font-semibold text-gray-600">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p className="text-center">Action</p>
        </div>

        {appointments.map((item, index) => (
          <div
            key={item._id}
            className="grid grid-cols-[40px_1.5fr_1fr_60px_1.5fr_80px_80px] min-w-[1000px] px-6 py-4 border-b text-sm text-gray-700 hover:bg-gray-50"
          >
            <p>{index + 1}</p>
            <p className="font-medium">{item.userData?.name}</p>

            <p>
              {item.payment ? (
                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">
                  Paid
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
                  Cash
                </span>
              )}
            </p>

            <p>{calculateAge(item.userData?.dob)}</p>

            <p className="whitespace-nowrap">
              {item.slotDate}, {item.slotTime}
            </p>

            <p className="font-medium">₹{item.amount}</p>

            {/* DESKTOP ACTION / STATUS */}
            <div className="flex justify-center">
              {item.isCompleted ? (
                <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  Accepted
                </span>
              ) : item.cancelled ? (
                <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                  Cancelled
                </span>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(item._id)}
                    className="p-2 bg-green-100 rounded hover:bg-green-200 transition"
                    title="Accept"
                  >
                    <img src={AcceptIcon} alt="Accept" className="w-4" />
                  </button>

                  <button
                    onClick={() => handleReject(item._id)}
                    className="p-2 bg-red-100 rounded hover:bg-red-200 transition"
                    title="Reject"
                  >
                    <img src={cancelIcon} alt="Reject" className="w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
