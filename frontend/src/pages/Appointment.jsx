import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { AppContext } from "../context/AppContext";
import verifiedIcon from "../assets/assets_frontend/verified_icon.svg";
import infoIcon from "../assets/assets_frontend/info_icon.svg";
import RelatedDoctors from "../components/RelatedDoctors.jsx";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();

  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  /* ================= LOAD DOCTOR ================= */
  useEffect(() => {
    if (doctors.length) {
      const doctor = doctors.find((d) => d._id === docId);
      setDocInfo(doctor);
    }
  }, [doctors, docId]);

  /* ================= GENERATE SLOTS ================= */
  const getAvailableSlots = () => {
    const slotsArr = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let startTime = new Date(currentDate);
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        startTime.setHours(today.getHours() > 10 ? today.getHours() + 1 : 10);
        startTime.setMinutes(today.getMinutes() > 30 ? 30 : 0);
      } else {
        startTime.setHours(10, 0, 0, 0);
      }

      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const slotDateKey = `${day}-${month}-${year}`;

      const bookedSlots = docInfo?.slots_booked?.[slotDateKey] || [];
      const slots = [];

      while (startTime < endTime) {
        const hours = startTime.getHours();
        const minutes = startTime.getMinutes();
        const period = hours >= 12 ? "PM" : "AM";
        const displayHours = hours % 12 || 12;

        const time = `${displayHours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")} ${period}`;

        if (!bookedSlots.includes(time)) {
          slots.push({ time });
        }

        startTime.setMinutes(startTime.getMinutes() + 30);
      }

      slotsArr.push({ date: currentDate, slots });
    }

    setDocSlots(slotsArr);
  };

  /* ================= HANDLE AVAILABILITY ================= */
  useEffect(() => {
    if (docInfo && docInfo.available) {
      getAvailableSlots();
    } else {
      setDocSlots([]);
      setSlotTime("");
      setSlotIndex(0);
    }
  }, [docInfo]);

  /* ================= BOOK APPOINTMENT ================= */
  const handleBookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      toast.error("Please select a time slot");
      return;
    }

    try {
      const selectedDate = docSlots[slotIndex].date;
      const slotDate = `${selectedDate.getDate()}-${selectedDate.getMonth() + 1}-${selectedDate.getFullYear()}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success("Appointment booked successfully");
        await getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to book appointment");
      console.error(err);
    }
  };

  if (!docInfo) return null;

  return (
    <div className="px-4 md:px-10 py-10">
      {/* ================= DOCTOR INFO ================= */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 bg-indigo-500 rounded-2xl flex items-end justify-center overflow-hidden">
          <img src={docInfo.image} alt={docInfo.name} className="h-[90%]" />
        </div>

        <div className="md:w-2/3 border rounded-2xl p-8">
          <p className="text-3xl font-bold flex gap-3 items-center">
            {docInfo.name}
            <img src={verifiedIcon} alt="verified" className="w-6" />
          </p>

          <p className="text-gray-600 mt-2">
            {docInfo.degree} – {docInfo.speciality}
          </p>

          <span className="inline-block mt-3 px-4 py-1 text-sm bg-blue-100 rounded-full">
            {docInfo.experience}
          </span>

          <div className="mt-6">
            <div className="flex items-center gap-2">
              <p className="font-semibold">About</p>
              <img src={infoIcon} alt="info" className="w-4" />
            </div>
            <p className="text-gray-600 mt-1">{docInfo.about}</p>
          </div>

          <p className="mt-5 font-semibold">
            Fee: {currencySymbol}
            {docInfo.fees}
          </p>
        </div>
      </div>

      {/* ================= BOOKING SECTION ================= */}
      <div className="mt-10">
        <p className="text-center text-lg font-semibold mb-6">Booking slots</p>

        {docInfo.available ? (
          <>
            {/* DATE SELECTION */}
            <div className="flex gap-4 justify-center overflow-x-auto pb-4">
              {docSlots.map((d, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSlotIndex(i);
                    setSlotTime("");
                  }}
                  className={`min-w-[64px] h-24 rounded-full flex flex-col items-center justify-center cursor-pointer border transition-all
                    ${
                      slotIndex === i
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white hover:border-indigo-400"
                    }`}
                >
                  <p className="text-sm">{daysOfWeek[d.date.getDay()]}</p>
                  <p className="font-bold text-lg">{d.date.getDate()}</p>
                </div>
              ))}
            </div>

            {/* TIME SLOTS */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {docSlots[slotIndex]?.slots.length ? (
                docSlots[slotIndex].slots.map((slot, i) => (
                  <p
                    key={i}
                    onClick={() => setSlotTime(slot.time)}
                    className={`px-4 py-2 rounded-full cursor-pointer border transition-all
                      ${
                        slotTime === slot.time
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white hover:bg-blue-600 hover:text-white hover:border-blue-600"
                      }`}
                  >
                    {slot.time}
                  </p>
                ))
              ) : (
                <p className="text-gray-400 py-4">
                  No slots available for this date
                </p>
              )}
            </div>

            {/* BOOK BUTTON */}
            <div className="flex justify-center">
              <button
                onClick={handleBookAppointment}
                disabled={!slotTime}
                className={`mt-8 rounded-full px-8 py-3 font-semibold transition-all
                  ${
                    slotTime
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Book Appointment
              </button>
            </div>
          </>
        ) : (
          <div className="mt-10 text-center">
            <p className="text-red-500 font-semibold text-lg">
              This doctor is currently unavailable for booking.
            </p>
          </div>
        )}
      </div>

      {/* ================= RELATED DOCTORS ================= */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
