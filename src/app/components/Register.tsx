"use client";
import CustomModal from "@/app/components/CustomModal";
import axios from "axios";
import { setCookie } from "cookie-handler-pro";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Register = () => {
  const router = useRouter();
  const [emailRegistration, setEmailRegistration] = useState(true);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "password") {
      if (formData.password.length < 5) {
        setErrors("Password must be at least 6 characters");
      } else {
        setErrors("");
      }
    }
  };

  const handleLogin = async () => {
    try {
      const loginPayload = {
        email: emailRegistration ? formData.email : formData.phone,
        password: formData.password,
      };

      console.log("Sending login request with payload:", loginPayload);

      const loginResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
        loginPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login response:", loginResponse.data);
      const { user, token } = loginResponse.data;
      setCookie("token", token);
      setCookie("user_id", user.id.toString());
      console.log("token", token);

      setCookie("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV !== "development",
        expires: 3, // 3 days
      });
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error response:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: emailRegistration ? formData.email : undefined,
        phone: emailRegistration ? undefined : formData.phone,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: "user", // Ensure role is passed correctly
      };

      const registerResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration successful:", registerResponse.data);

      await handleLogin();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Registration error response:",
          error.response?.data.message
        );
        const isArray = Array.isArray(error.response?.data.message);
        if (!isArray) {
          setErrors(error.response?.data.message);
        } else {
          setErrors(error.response?.data.message[0]);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen lg:min-w-[550px]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="First Name"
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
            {errors && <p className="text-red-500 text-sm mt-2">{errors}</p>}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password_confirmation"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {loading ? "Submitting..." : "  Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-blue-500 hover:underline">
            <p>Already have an account? Login</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
