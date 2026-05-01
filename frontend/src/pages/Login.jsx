import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { token, backendUrl, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [state, setState] = useState("signup"); // signup | login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "signup") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Account created");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Login successful");
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md border border-gray-200 rounded-xl p-8 bg-white shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          {state === "signup" ? "Create Account" : "Login"}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Please {state === "signup" ? "sign up" : "login"} to book appointment
        </p>

        {state === "signup" && (
          <div className="mb-4">
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700"
        >
          {state === "signup" ? "Create Account" : "Login"}
        </button>

        <p className="text-sm text-gray-600 text-center mt-4">
          {state === "signup" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("login")}
                className="text-blue-600 cursor-pointer"
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setState("signup")}
                className="text-blue-600 cursor-pointer"
              >
                Create one
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
