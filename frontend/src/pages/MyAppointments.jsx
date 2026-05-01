import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendUrl, token, currencySymbol, getDoctorsData } =
    useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  /* ================= HELPERS ================= */

  const formatDateVerbose = (slotDate) => {
    if (!slotDate) return "";

    let d, m, y;
    if (slotDate instanceof Date) {
      d = slotDate.getDate();
      m = slotDate.getMonth() + 1;
      y = slotDate.getFullYear();
    } else {
      const parts = slotDate.split("-");
      d = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10);
      y = parseInt(parts[2], 10);
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const ordinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };

    return `${d}${ordinal(d)} ${months[m - 1]} ${y}`;
  };

  const formatAddress = (addr) => {
    if (!addr) return "";
    if (typeof addr === "string") return addr;
    return Object.values(addr).filter(Boolean).join(", ");
  };

  /* ================= API ================= */

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load appointments");
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel appointment");
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verifyRazorpay",
            response,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          if (data.success) {
            toast.success("Payment successful");
            getUserAppointments();
            navigate("/my-appointments");
          } else {
            toast.error(data.message);
          }
        } catch (err) {
          console.error(err);
          toast.error("Payment verification failed");
        }
      },
      modal: {
        ondismiss: () => toast.info("Payment cancelled"),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate payment");
    }
  };

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (!token) return;
    getUserAppointments();
  }, [token, backendUrl]);

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <p className="text-2xl font-semibold mb-6">My Appointments</p>

      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments yet</p>
      ) : (
        <div className="space-y-6">
          {appointments.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row gap-6 p-6 border rounded-lg bg-white"
            >
              {/* Doctor Image */}
              <img
                src={item.docData.image}
                alt={item.docData.name}
                className="w-20 h-20 rounded-full object-cover"
              />

              {/* Info */}
              <div className="flex-1 space-y-1">
                <p className="text-lg font-semibold">{item.docData.name}</p>
                <p className="text-sm text-gray-600">
                  {item.docData.speciality}
                </p>

                {item.docData.address && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Address:</span>{" "}
                    {formatAddress(item.docData.address)}
                  </p>
                )}

                <p className="text-sm mt-2">
                  <span className="font-medium">Date:</span>{" "}
                  {formatDateVerbose(item.slotDate)}
                </p>

                <p className="text-sm">
                  <span className="font-medium">Time:</span> {item.slotTime}
                </p>

                <p className="text-sm font-medium mt-1">
                  Fee: {currencySymbol}
                  {item.amount}
                </p>
              </div>

              {/* ACTIONS / STATUS */}
              <div className="flex flex-col gap-3 min-w-[180px]">
                {/* Cancelled by doctor */}
                {item.cancelled && (
                  <span className="px-4 py-2 rounded-md bg-red-100 text-red-600 font-medium text-center">
                    Cancelled
                  </span>
                )}

                {/* Completed */}
                {!item.cancelled && item.isCompleted && (
                  <span className="px-4 py-2 rounded-md bg-green-100 text-green-600 font-medium text-center">
                    Appointment Completed
                  </span>
                )}

                {/* Active */}
                {!item.cancelled && !item.isCompleted && (
                  <>
                    {item.payment ? (
                      <button
                        disabled
                        className="px-4 py-2 rounded-md bg-green-600 text-white font-medium cursor-not-allowed"
                      >
                        Paid
                      </button>
                    ) : (
                      <button
                        onClick={() => appointmentRazorpay(item._id)}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                      >
                        Pay Online
                      </button>
                    )}

                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="px-4 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
