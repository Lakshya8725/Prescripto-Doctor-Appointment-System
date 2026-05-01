import React, { useContext, useState } from "react";
import uploadArea from "../../assets/assets_admin/upload_area.svg";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (!docImg) {
        return toast.error("Image not selected");
      }
      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({
          line1: address1,
          line2: address2,
        }),
      );
      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName("");
        setEmail("");
        setPassword("");
        setAbout("");
        setDegree("");
        setExperience("1 Year");
        setFees("");
        setSpeciality("General physician");
        setAddress1("");
        setAddress2("");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="w-full p-6 bg-gray-50">
      <p className="text-xl font-semibold mb-6">Add Doctor</p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Upload image */}
        <div className="flex items-center gap-6 mb-8">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img
              src={docImg ? URL.createObjectURL(docImg) : uploadArea}
              alt="Upload"
              className="w-32 h-32 object-contain border-2 border-dashed rounded-lg p-3 hover:bg-gray-100"
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />

          <p className="text-sm text-gray-600">
            Upload doctor <br /> picture
          </p>
        </div>

        {/* Form grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Doctor name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Name"
                required
                className="input"
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Doctor email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                required
                className="input"
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Doctor password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
                className="input"
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="input"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`${i + 1} Year`}>
                    {i + 1} Year
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                type="number"
                placeholder="Fees"
                required
                className="input"
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Speciality</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="input"
              >
                <option>General physician</option>
                <option>Gynecologist</option>
                <option>Gastroenterologist</option>
                <option>Pediatricians</option>
                <option>Neurologist</option>
                <option>Dermatologist</option>
              </select>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Education</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                type="text"
                placeholder="Education"
                required
                className="input"
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                type="text"
                placeholder="Address 1"
                required
                className="input mb-2"
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                type="text"
                placeholder="Address 2"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="mt-6">
          <p className="text-sm font-medium mb-1">About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            placeholder="Write about doctor"
            rows={5}
            required
            className="input resize-none"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md font-medium
                     hover:bg-blue-700 transition"
        >
          Add doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
