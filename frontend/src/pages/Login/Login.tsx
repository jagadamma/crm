import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      navigate("/homelayout");
    }
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", formData);
      const { accessToken, refreshToken, user } = response.data;
      console.log("Logged in user ID:", user.id);

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem("userData", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      toast.success("Login successful!");

    navigate("/homelayout");
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-purple-50 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-purple-900">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-800">Welcome Back!</h1>
          <p className="text-sm text-gray-500 mt-1">Access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex items-center">
            <label className="w-32 text-sm font-medium text-gray-600" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900"
            />
          </div>

          <div className="flex items-center">
            <label className="w-32 text-sm font-medium text-gray-600" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold text-white bg-purple-700 hover:bg-purple-600"
          >
            Log In
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="ml-1 text-purple-700 font-medium hover:underline"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default Login;
