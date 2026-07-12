import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { formatDateVerbose, formatAddress } from "../utils/format";
import {
  useAppointmentPagination,
  LoadMoreButton,
} from "../hooks/useAppointmentPagination.jsx";

const MyAppointments = () => {
  const { backendUrl, token, currencySymbol, getDoctorsData } =
    useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const { visible, hasMore, loadMore, total } =
    useAppointmentPagination(appointments);

  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: authHeader,
      });
      if (data.success) setAppointments(data.appointments);
      else toast.error(data.message);
    } catch {
      toast.error("Failed to load appointments");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: authHeader },
      );
      if (data.success) {
        toast.success(data.message);
        fetchAppointments();
        getDoctorsData();
      } else toast.error(data.message);
    } catch {
      toast.error("Failed to cancel appointment");
    }
  };

  const payForAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: authHeader },
      );
      if (!data.success) return toast.error(data.message);

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Prescripto",
        description: "Appointment Payment",
        order_id: data.order.id,
        handler: async (response) => {
          const verify = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            response,
            { headers: authHeader },
          );
          if (verify.data.success) {
            toast.success("Payment successful");
            fetchAppointments();
          } else {
            toast.error(verify.data.message);
          }
        },
        modal: { ondismiss: () => toast.info("Payment cancelled") },
      });
      rzp.open();
    } catch {
      toast.error("Failed to initiate payment");
    }
  };

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token, backendUrl]);

  const renderActions = (item) => {
    if (item.cancelled) {
      return (
        <span className="px-4 py-2 rounded-md bg-red-100 text-red-600 font-medium text-center">
          Cancelled
        </span>
      );
    }
    if (item.isCompleted) {
      return (
        <span className="px-4 py-2 rounded-md bg-green-100 text-green-600 font-medium text-center">
          Completed
        </span>
      );
    }
    return (
      <>
        {item.payment ? (
          <button disabled className="px-4 py-2 rounded-md bg-green-600 text-white font-medium cursor-not-allowed">
            Paid
          </button>
        ) : (
          <button
            onClick={() => payForAppointment(item._id)}
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Pay Online
          </button>
        )}
        <button
          onClick={() => cancelAppointment(item._id)}
          className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
        >
          Cancel
        </button>
      </>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">My Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments yet</p>
      ) : (
        <div className="space-y-6">
          {visible.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row gap-6 p-6 border rounded-lg bg-white"
            >
              <img
                src={item.docData.image}
                alt={item.docData.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1 space-y-1">
                <p className="text-lg font-semibold">{item.docData.name}</p>
                <p className="text-sm text-gray-600">{item.docData.speciality}</p>
                {item.docData.address && (
                  <p className="text-sm text-gray-600">
                    {formatAddress(item.docData.address)}
                  </p>
                )}
                <p className="text-sm">
                  {formatDateVerbose(item.slotDate)} · {item.slotTime}
                </p>
                <p className="text-sm font-medium">
                  Fee: {currencySymbol}{item.amount}
                </p>
              </div>
              <div className="flex flex-col gap-3 min-w-[180px]">
                {renderActions(item)}
              </div>
            </div>
          ))}
          <LoadMoreButton
            hasMore={hasMore}
            onClick={loadMore}
            loaded={visible.length}
            total={total}
          />
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
