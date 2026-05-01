import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";

import earningIcon from "../../assets/assets_admin/earning_icon.svg";
import appointmentsIcon from "../../assets/assets_admin/appointments_icon.svg";
import patientsIcon from "../../assets/assets_admin/patients_icon.svg";
import listIcon from "../../assets/assets_admin/list_icon.svg";

const DoctorDashboard = () => {
  const { dToken, getDashboardData, dashboardData } = useContext(DoctorContext);

  useEffect(() => {
    if (dToken) {
      getDashboardData();
    }
  }, [dToken]);

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-12 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8">
        Doctor Dashboard
      </h1>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Earnings */}
        <div className="flex items-center gap-5 bg-white p-6 rounded-2xl shadow-sm">
          <div className="p-3 bg-green-50 rounded-xl">
            <img src={earningIcon} className="w-10 h-10" />
          </div>
          <div>
            <p className="text-3xl font-bold">₹{dashboardData.earnings}</p>
            <p className="text-gray-500 text-sm">Total Earnings</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="flex items-center gap-5 bg-white p-6 rounded-2xl shadow-sm">
          <div className="p-3 bg-blue-50 rounded-xl">
            <img src={appointmentsIcon} className="w-10 h-10" />
          </div>
          <div>
            <p className="text-3xl font-bold">{dashboardData.appointments}</p>
            <p className="text-gray-500 text-sm">Appointments</p>
          </div>
        </div>

        {/* Patients */}
        <div className="flex items-center gap-5 bg-white p-6 rounded-2xl shadow-sm">
          <div className="p-3 bg-purple-50 rounded-xl">
            <img src={patientsIcon} className="w-10 h-10" />
          </div>
          <div>
            <p className="text-3xl font-bold">{dashboardData.patients}</p>
            <p className="text-gray-500 text-sm">Patients</p>
          </div>
        </div>
      </div>

      {/* ===== LATEST APPOINTMENTS ===== */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="flex items-center gap-3 px-6 py-4 border-b">
          <img src={listIcon} className="w-5 h-5" />
          <p className="text-lg font-semibold text-gray-800">
            Latest Appointments
          </p>
        </div>

        {dashboardData.latestAppointments.length > 0 ? (
          dashboardData.latestAppointments.map((item) => (
            <div
              key={item._id}
              className="flex justify-between px-6 py-4 border-b"
            >
              <div>
                <p className="font-medium">
                  {item.userData?.name || "Patient"}
                </p>
                <p className="text-sm text-gray-500">
                  {item.slotDate} • {item.slotTime}
                </p>
              </div>

              {item.cancelled ? (
                <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full text-xs">
                  Cancelled
                </span>
              ) : item.isCompleted ? (
                <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs">
                  Completed
                </span>
              ) : (
                <span className="text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-xs">
                  Pending
                </span>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">
            No recent appointments
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
