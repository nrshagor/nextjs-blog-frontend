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
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder={"Enter your email"}
          onChange={handleInputChange}
        />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
        />
        <button type="button" onClick={togglePasswordVisibility}>
          {showPassword ? "Hide" : "Show"}
        </button>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
