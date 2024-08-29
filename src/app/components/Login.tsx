"use client";
import CustomModal from "@/app/components/CustomModal";
import axios from "axios";
import { setCookie } from "cookie-handler-pro";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const router = useRouter();
  const [email, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setIdentifier(value);
    if (name === "password") setPassword(value);
  };

  const handleLogin = async () => {
    try {
      const loginPayload = {
        email,
        password,
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

      // Set the token in cookies
      setCookie("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV !== "development",
        expires: 3, // 3 days
      });
      // Redirect to the home route after successful login
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error response:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleLogin();
  };
  // passowrd show and hide
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div className="mb-4 relative">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600 focus:outline-none"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Login
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link href="/register" className="text-blue-500 hover:underline">
            Don&apos;t have an account? Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
