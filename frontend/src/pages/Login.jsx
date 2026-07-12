import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OTP_TIMER = 60;

const Login = () => {
  const { token, backendUrl, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [state, setState] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);
  const [phoneCooldown, setPhoneCooldown] = useState(0);
  const [devEmailOtp, setDevEmailOtp] = useState("");
  const [devPhoneOtp, setDevPhoneOtp] = useState("");
  const [loading, setLoading] = useState("");

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  useEffect(() => {
    if (emailCooldown <= 0) return;
    const t = setInterval(() => setEmailCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [emailCooldown]);

  useEffect(() => {
    if (phoneCooldown <= 0) return;
    const t = setInterval(() => setPhoneCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [phoneCooldown]);

  const resetVerification = () => {
    setEmailVerified(false);
    setPhoneVerified(false);
    setEmailOtp("");
    setPhoneOtp("");
    setDevEmailOtp("");
    setDevPhoneOtp("");
  };

  const sendEmailOtp = async () => {
    if (!email) return toast.error("Enter email first");
    setLoading("email-send");
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/send-email-otp`, {
        email,
        name,
      });
      if (data.success) {
        toast.success(data.message);
        setEmailCooldown(OTP_TIMER);
        if (data.devOtp) setDevEmailOtp(data.devOtp);
        setEmailVerified(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading("");
    }
  };

  const verifyEmailOtp = async () => {
    if (!emailOtp) return toast.error("Enter email OTP");
    setLoading("email-verify");
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/verify-email-otp`,
        { email, otp: emailOtp },
      );
      if (data.success) {
        toast.success("Email verified");
        setEmailVerified(true);
        setDevEmailOtp("");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading("");
    }
  };

  const sendPhoneOtp = async () => {
    if (!phone || phone.replace(/\D/g, "").length !== 10) {
      return toast.error("Enter valid 10-digit phone number");
    }
    setLoading("phone-send");
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/send-phone-otp`, {
        phone,
      });
      if (data.success) {
        toast.success(data.message);
        setPhoneCooldown(OTP_TIMER);
        if (data.devOtp) setDevPhoneOtp(data.devOtp);
        setPhoneVerified(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading("");
    }
  };

  const verifyPhoneOtp = async () => {
    if (!phoneOtp) return toast.error("Enter phone OTP");
    setLoading("phone-verify");
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/verify-phone-otp`,
        { phone, otp: phoneOtp },
      );
      if (data.success) {
        toast.success("Phone verified");
        setPhoneVerified(true);
        setDevPhoneOtp("");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading("");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!backendUrl) {
      return toast.error("Backend URL missing. Check frontend/.env file.");
    }
    if (!email || !password) {
      return toast.error("Email and password are required");
    }

    try {
      if (state === "signup") {
        if (!name) return toast.error("Name is required");
        if (password.length < 8) {
          return toast.error("Password must be at least 8 characters");
        }
        if (!emailVerified) {
          return toast.error("Verify your email with OTP first");
        }
        if (!phoneVerified) {
          return toast.error("Verify your phone number with OTP first");
        }

        setLoading("register");
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
          phone,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Account created successfully");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Login successful");
        } else {
          toast.error(data.message || "Invalid credentials");
        }
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          (err.message === "Network Error"
            ? "Cannot reach backend. Is it running on http://localhost:4000?"
            : err.message),
      );
    } finally {
      setLoading("");
    }
  };

  const canSignup = emailVerified && phoneVerified && !loading;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md border border-gray-200 rounded-xl p-8 bg-white shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          {state === "signup" ? "Create Account" : "Login"}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {state === "signup"
            ? "Verify email and phone with OTP before creating account"
            : "Login to book appointments"}
        </p>

        {state === "signup" && (
          <>
            <div className="mb-4">
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-md"
                required
              />
            </div>

            {/* Email + OTP */}
            <div className="mb-4 p-4 border rounded-lg bg-gray-50">
              <label className="text-sm font-medium text-gray-700">
                Email {emailVerified && <span className="text-green-600">✓ Verified</span>}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  resetVerification();
                }}
                className="w-full mt-1 px-4 py-2 border rounded-md bg-white"
                required
              />
              {!emailVerified && (
                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={sendEmailOtp}
                    disabled={emailCooldown > 0 || loading === "email-send"}
                    className="text-sm text-blue-600 disabled:text-gray-400"
                  >
                    {emailCooldown > 0
                      ? `Resend in ${emailCooldown}s`
                      : "Send OTP to Email"}
                  </button>
                  {devEmailOtp && (
                    <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                      Dev OTP: <strong>{devEmailOtp}</strong>
                    </p>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6-digit OTP"
                      value={emailOtp}
                      onChange={(e) =>
                        setEmailOtp(e.target.value.replace(/\D/g, ""))
                      }
                      className="flex-1 px-3 py-2 border rounded-md bg-white"
                    />
                    <button
                      type="button"
                      onClick={verifyEmailOtp}
                      disabled={loading === "email-verify"}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Phone + OTP */}
            <div className="mb-4 p-4 border rounded-lg bg-gray-50">
              <label className="text-sm font-medium text-gray-700">
                Phone {phoneVerified && <span className="text-green-600">✓ Verified</span>}
              </label>
              <div className="flex mt-1">
                <span className="px-3 py-2 border border-r-0 rounded-l-md bg-gray-100 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ""));
                    setPhoneVerified(false);
                    setPhoneOtp("");
                    setDevPhoneOtp("");
                  }}
                  placeholder="10-digit mobile"
                  className="flex-1 px-4 py-2 border rounded-r-md bg-white"
                  required
                />
              </div>
              {!phoneVerified && (
                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={sendPhoneOtp}
                    disabled={phoneCooldown > 0 || loading === "phone-send"}
                    className="text-sm text-blue-600 disabled:text-gray-400"
                  >
                    {phoneCooldown > 0
                      ? `Resend in ${phoneCooldown}s`
                      : "Send OTP to Phone"}
                  </button>
                  {devPhoneOtp && (
                    <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                      Dev OTP: <strong>{devPhoneOtp}</strong>
                    </p>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6-digit OTP"
                      value={phoneOtp}
                      onChange={(e) =>
                        setPhoneOtp(e.target.value.replace(/\D/g, ""))
                      }
                      className="flex-1 px-3 py-2 border rounded-md bg-white"
                    />
                    <button
                      type="button"
                      onClick={verifyPhoneOtp}
                      disabled={loading === "phone-verify"}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {state === "login" && (
          <div className="mb-4">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-md"
              required
            />
          </div>
        )}

        <div className="mb-6">
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={state === "signup" ? 8 : undefined}
            placeholder={state === "signup" ? "Min 8 characters" : "Password"}
            className="w-full mt-1 px-4 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={state === "signup" && !canSignup}
          className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading === "register"
            ? "Creating account..."
            : state === "signup"
              ? "Create Account"
              : "Login"}
        </button>

        {state === "signup" && !canSignup && (
          <p className="text-xs text-center text-gray-500 mt-2">
            Verify email and phone to enable signup
          </p>
        )}

        <p className="text-sm text-gray-600 text-center mt-4">
          {state === "signup" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setState("login");
                  resetVerification();
                }}
                className="text-blue-600 cursor-pointer"
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
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
