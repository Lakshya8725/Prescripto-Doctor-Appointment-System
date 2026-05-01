import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import profilePic from "../assets/assets_frontend/profile_pic.png";
import uploadIcon from "../assets/assets_frontend/upload_icon.png";
import { AppContext } from "../context/AppContext";

const MyProfile = () => {
  const [isEdit, setEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [backupData, setBackupData] = useState(null);

  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  if (!userData) {
    return (
      <div className="text-center mt-20 text-gray-500">Loading profile...</div>
    );
  }

  // ✅ SAFE address (handles object or string)
  const safeAddress =
    typeof userData.address === "string"
      ? userData.address
      : `${userData.address?.line1 || ""} ${userData.address?.line2 || ""}`.trim();

  const handleEdit = () => {
    setBackupData(userData);
    setEdit(true);
  };

  const handleCancel = () => {
    setUserData(backupData);
    setImage(null);
    setEdit(false);
  };

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone || "");
      formData.append("dob", userData.dob);
      formData.append("gender", userData.gender);
      formData.append(
        "address",
        JSON.stringify(userData.address || safeAddress),
      );

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success("Profile updated successfully");
        setEdit(false);
        setImage(null);
        loadUserProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md">
      {/* Profile Image */}
      <div className="flex gap-6 items-center mb-6">
        {isEdit ? (
          <label htmlFor="image" className="cursor-pointer relative">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : userData.image || profilePic
              }
              className="w-28 h-28 rounded-lg object-cover"
            />
            {!image && (
              <img src={uploadIcon} className="absolute bottom-1 right-1 w-6" />
            )}
            <input
              type="file"
              id="image"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        ) : (
          <img
            src={userData.image || profilePic}
            className="w-28 h-28 rounded-lg object-cover"
          />
        )}

        <div>
          {isEdit ? (
            <input
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              className="text-2xl font-semibold border px-2 py-1"
            />
          ) : (
            <h2 className="text-2xl font-semibold">{userData.name}</h2>
          )}
        </div>
      </div>

      <hr className="my-6" />

      {/* Contact Info */}
      <p className="text-sm text-gray-500 mb-4">CONTACT INFORMATION</p>

      <div className="space-y-3 text-sm">
        <p>
          <span className="font-medium">Email:</span>{" "}
          <span className="text-blue-500">{userData.email}</span>
        </p>

        <p>
          <span className="font-medium">Phone:</span>{" "}
          {isEdit ? (
            <input
              value={userData.phone || ""}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
              className="border px-2 py-1 ml-2"
            />
          ) : (
            userData.phone
          )}
        </p>

        <p>
          <span className="font-medium">Address:</span>{" "}
          {isEdit ? (
            <input
              value={safeAddress}
              onChange={(e) =>
                setUserData({ ...userData, address: e.target.value })
              }
              className="border px-2 py-1 ml-2 w-full"
            />
          ) : (
            safeAddress
          )}
        </p>
      </div>

      <hr className="my-6" />

      {/* Basic Info */}
      <p className="text-sm text-gray-500 mb-4">BASIC INFORMATION</p>

      <div className="space-y-3 text-sm">
        <p>
          <span className="font-medium">Gender:</span>{" "}
          {isEdit ? (
            <select
              value={userData.gender}
              onChange={(e) =>
                setUserData({ ...userData, gender: e.target.value })
              }
              className="border px-2 py-1 ml-2"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          ) : (
            userData.gender
          )}
        </p>

        <p>
          <span className="font-medium">Birthday:</span>{" "}
          {isEdit ? (
            <input
              type="date"
              value={userData.dob}
              onChange={(e) =>
                setUserData({ ...userData, dob: e.target.value })
              }
              className="border px-2 py-1 ml-2"
            />
          ) : (
            new Date(userData.dob).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          )}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        {!isEdit ? (
          <button
            onClick={handleEdit}
            className="px-6 py-2 border border-blue-400 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-400 text-gray-600 rounded-full hover:bg-gray-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              onClick={updateUserProfileData}
              className="px-6 py-2 border border-blue-400 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition"
            >
              Save information
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
