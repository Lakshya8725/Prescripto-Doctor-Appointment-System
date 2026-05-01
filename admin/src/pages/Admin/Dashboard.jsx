import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import doctorIcon from "../../assets/assets_admin/doctor_icon.svg";
import appointmentsIcon from "../../assets/assets_admin/appointments_icon.svg";
import patientsIcon from "../../assets/assets_admin/patients_icon.svg";
import listIcon from "../../assets/assets_admin/list_icon.svg";
import cancelIcon from "../../assets/assets_admin/cancel_icon.svg";

const Dashboard = () => {
  const { aToken, getDashData, dashData, cancelAppointment } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  if (!dashData) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-12 py-8">
      {/* Page Title */}
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 max-w-7xl mx-auto">
        Admin Dashboard
      </h1>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-10">
        {/* Doctors */}
        <div className="flex items-center gap-5 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="p-3 bg-blue-50 rounded-xl">
            <img src={doctorIcon} className="w-10 h-10" />
          </div>
          <div>
            <p className="text-3xl font-bold">{dashData.doctors}</p>
            <p className="text-gray-500 text-sm">Total Doctors</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="flex items-center gap-5 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="p-3 bg-green-50 rounded-xl">
            <img src={appointmentsIcon} className="w-10 h-10" />
          </div>
          <div>
            <p className="text-3xl font-bold">{dashData.appointments}</p>
            <p className="text-gray-500 text-sm">Appointments</p>
          </div>
        </div>

        {/* Patients */}
        <div className="flex items-center gap-5 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="p-3 bg-purple-50 rounded-xl">
            <img src={patientsIcon} className="w-10 h-10" />
          </div>
          <div>
            <p className="text-3xl font-bold">{dashData.patients}</p>
            <p className="text-gray-500 text-sm">Patients</p>
          </div>
        </div>
      </div>

      {/* ===== LATEST BOOKINGS HEADER ===== */}
      <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm border max-w-7xl mx-auto mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <img src={listIcon} className="w-5 h-5" />
        </div>
        <p className="text-lg font-semibold text-gray-800">Latest Bookings</p>
      </div>

      {/* ===== LATEST BOOKINGS LIST ===== */}
      <div className="bg-white rounded-xl shadow-sm border max-w-7xl mx-auto divide-y">
        {dashData.latestAppointments.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
          >
            {/* Doctor Info */}
            <div className="flex items-center gap-4">
              <img
                src={item.docData?.image}
                alt="Doctor"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {item.docData?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {item.slotDate} • {item.slotTime}
                </p>
              </div>
            </div>

            {/* Action */}
            {item.cancelled ? (
              <span className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                Cancelled
              </span>
            ) : (
              <img
                src={cancelIcon}
                alt="Cancel"
                onClick={() => cancelAppointment(item._id)}
                className="w-5 h-5 cursor-pointer hover:scale-110 transition"
              />
            )}
          </div>
        ))}

        {dashData.latestAppointments.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No recent appointments
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
