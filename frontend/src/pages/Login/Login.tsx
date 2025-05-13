import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
interface FormData {
  email: string;
  password: string;
}
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  // :white_tick: Initialize token and axios config on mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
    const storedUser = localStorage.getItem("userData");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser: FormData = JSON.parse(storedUser);
        if (parsedUser.email) {
          setFormData((prev) => ({ ...prev, email: parsedUser.email }));
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(`/api/auth/login`, formData);
      const { token, user } = response.data;
      toast.success("Successfully logged in!");
      // :white_tick: Store and initialize token
      localStorage.setItem("accessToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("userData", JSON.stringify(user));
      setFormData({ email: "", password: "" });
      setTimeout(() => navigate("/homelayout"), 1500);
      
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md p-6 bg-base-100 shadow-2xl rounded-lg">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold">Log In</h1>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="form-control">
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              className="input input-bordered w-full"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="form-control">
            <button
              type="submit"
              className="btn btn-primary w-full bg-purple-900 border-purple-900 text-white hover:bg-purple-700 hover:border-purple-700"
            >
              Log In
            </button>
          </div>
          <div className="form-control">
            <button
              type="button"
              className="btn btn-secondary w-full"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
export default Login;