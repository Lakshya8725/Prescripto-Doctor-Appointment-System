import React, { useContext, useState } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext.jsx";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext.jsx";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setDToken } = useContext(DoctorContext);
  const { setAToken, backendUrl } = useContext(AdminContext);
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Login successful 🎉");
        } else {
          toast.error(data.message || "Login failed");
        }
      } else {
        // doctor login
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          console.log("Doctor token:", data.token);
          toast.success("Login successful 🎉");
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-screen flex items-center justify-center bg-gray-100"
    >
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <p className="text-2xl font-semibold text-center mb-6">
          <span className="text-blue-600">{state}</span> Login
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>

        {state === "Admin" ? (
          <p className="text-center mt-4">
            Doctor Login?
            <span
              onClick={() => setState("Doctor")}
              className="text-blue-600 cursor-pointer ml-1"
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="text-center mt-4">
            Admin Login?
            <span
              onClick={() => setState("Admin")}
              className="text-blue-600 cursor-pointer ml-1"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
