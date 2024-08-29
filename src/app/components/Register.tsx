"use client";
import CustomModal from "@/app/components/CustomModal";
import axios from "axios";
import { setCookie } from "cookie-handler-pro";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Register = () => {
  const router = useRouter();
  const [emailRegistration, setEmailRegistration] = useState(true);

  const [errors, setErrors] = useState("");

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
    if (name == "password") {
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

      const token = loginResponse.data.token;
      console.log("token", token);

      // Set the token in cookies
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
    try {
      const payload = {
        name: formData.name,
        email: emailRegistration ? formData.email : undefined,
        phone: emailRegistration ? undefined : formData.phone,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        role: "user", // Ensure role is passed correctly
      };

      // Register the user
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

      // Try to login after registration
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
    }
  };

  console.log(formData); // Log form data to check input values
  return (
    <div>
      <div>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="First Name"
            onChange={handleInputChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
          />
          {errors && <p style={{ color: "red" }}>{errors}</p>}
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            onChange={handleInputChange}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
