import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import profilePic from "../../assets/assets_admin/upload_area.svg";
import uploadIcon from "../../assets/assets_admin/upload_area.svg";

import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } =
    useContext(DoctorContext);

  const { backendUrl, currency } = useContext(AppContext);

  const [isEdit, setEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [backupData, setBackupData] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  /* ================= SAFE ADDRESS ================= */
  const safeAddress =
    typeof profileData.address === "string"
      ? profileData.address
      : profileData.address?.line1 || "";

  /* ================= EDIT ================= */
  const handleEdit = () => {
    setBackupData(JSON.parse(JSON.stringify(profileData)));
    setEdit(true);
  };

  const handleCancel = () => {
    setProfileData(backupData);
    setImage(null);
    setEdit(false);
  };

  /* ================= UPDATE PROFILE ================= */
  const updateDoctorProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("name", profileData.name);
      formData.append("fees", profileData.fees);
      formData.append("experience", profileData.experience);
      formData.append("about", profileData.about || "");
      formData.append("address", JSON.stringify({ line1: safeAddress }));

      if (image) formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
          },
        },
      );

      if (data.success) {
        toast.success("Profile updated successfully");
        setEdit(false);
        setImage(null);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  /* ================= AVAILABILITY ================= */
  const toggleAvailability = async () => {
    try {
      setLoadingAvailability(true);

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/change-availability`,
        {},
        { headers: { Authorization: `Bearer ${dToken}` } },
      );

      if (data.success) {
        setProfileData((prev) => ({
          ...prev,
          available: data.available,
        }));
      }
    } catch {
      toast.error("Failed to update availability");
    } finally {
      setLoadingAvailability(false);
    }
  };

  return (
    <div className="w-full px-6 lg:px-16 py-10 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm p-6 lg:p-10">
        {/* ================= TOP ================= */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* IMAGE */}
          <div className="flex-shrink-0">
            {isEdit ? (
              <label htmlFor="image" className="cursor-pointer relative">
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : profileData.image || profilePic
                  }
                  className="w-36 h-36 rounded-xl object-cover"
                />
                <img
                  src={uploadIcon}
                  className="absolute bottom-2 right-2 w-7"
                />
                <input
                  hidden
                  type="file"
                  id="image"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            ) : (
              <img
                src={profileData.image || profilePic}
                className="w-36 h-36 rounded-xl object-cover"
              />
            )}
          </div>

          {/* INFO */}
          <div className="flex-1">
            {isEdit ? (
              <input
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="text-3xl font-semibold border px-3 py-1 w-full max-w-md"
              />
            ) : (
              <h2 className="text-3xl font-semibold">{profileData.name}</h2>
            )}

            <p className="text-gray-500 mt-1">{profileData.email}</p>

            {/* AVAILABILITY */}
            <div className="flex items-center gap-4 mt-4">
              <span className="font-medium">Available</span>
              <input
                type="checkbox"
                checked={profileData.available}
                disabled={loadingAvailability}
                onChange={toggleAvailability}
                className="w-5 h-5 accent-green-600 cursor-pointer"
              />
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  profileData.available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {profileData.available ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        <hr className="my-8" />

        {/* ABOUT */}
        <div className="mb-6">
          <p className="font-medium text-gray-600 mb-1">About</p>
          {isEdit ? (
            <textarea
              rows="4"
              value={profileData.about || ""}
              onChange={(e) =>
                setProfileData({ ...profileData, about: e.target.value })
              }
              className="border px-3 py-2 w-full rounded-md"
            />
          ) : (
            <p>{profileData.about || "—"}</p>
          )}
        </div>

        {/* ADDRESS */}
        <div className="mb-6">
          <p className="font-medium text-gray-600 mb-1">Address</p>
          {isEdit ? (
            <textarea
              rows="2"
              value={safeAddress}
              onChange={(e) =>
                setProfileData({
                  ...profileData,
                  address: { line1: e.target.value },
                })
              }
              className="border px-3 py-2 w-full rounded-md"
            />
          ) : (
            <p>{safeAddress || "—"}</p>
          )}
        </div>

        {/* FEES */}
        <div className="mb-6">
          <p className="font-medium text-gray-600 mb-1">Consultation Fee</p>
          {isEdit ? (
            <input
              value={profileData.fees}
              onChange={(e) =>
                setProfileData({ ...profileData, fees: e.target.value })
              }
              className="border px-3 py-1 w-32"
            />
          ) : (
            <p>
              {currency}
              {profileData.fees}
            </p>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-8">
          {!isEdit ? (
            <button
              onClick={handleEdit}
              className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-400 text-gray-600 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={updateDoctorProfile}
                className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
