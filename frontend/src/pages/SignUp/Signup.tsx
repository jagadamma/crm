

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "tailwindcss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface FormData {
  username: string;
  email: string;
  password: string;
}
const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`api/auth/register`, formData);
      console.log(response.data.message);
      toast.success("User Registered Successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      if (error.response && error.response.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Registration failed. Try again.");
      }
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md p-6 bg-base-100 shadow-2xl rounded-lg">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold">Sign Up</h1>
        </div>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="form-control">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input input-bordered w-full"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
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
          <div className="form-control">
            <button
              type="submit"
              className="btn btn-primary w-full bg-purple-900 border-purple-900 text-white hover:bg-purple-700 hover:border-purple-700"
            >
              Sign Up
            </button>
          </div>
          <div className="form-control">
            <button
              type="button"
              className="btn btn-secondary w-full"
              onClick={() => navigate("/login")}
            >
              Already have an account? Log In
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};
export default Signup;