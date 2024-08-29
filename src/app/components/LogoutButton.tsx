"use client";
import React from "react";
import { deleteCookie, getCookie } from "cookie-handler-pro";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import axios from "axios";

const LogoutButton = () => {
  const router = useRouter(); // Initialize the useRouter hook

  const handleLogout = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/logout`;
      const token = getCookie("token");

      if (!token) {
        throw new Error("No token found");
      }

      console.log("Token:", token);

      // post blog
      const response = await axios.post(
        url,
        {}, // Sending an empty object as the data
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Logout response:", response);

      // Delete the authentication cookie
      deleteCookie("token");
      deleteCookie("user_id");

      // Redirect to the login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
