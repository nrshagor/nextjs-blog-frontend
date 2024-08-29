"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import "../style/navbar.scss";
import LogoutButton from "./LogoutButton";
import { usePathname } from "next/navigation";
import { getCookie } from "cookie-handler-pro";

const Navbar = () => {
  const token = getCookie("token");
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  }, [path]);
  return (
    <div className="navbar">
      <Link href="/">Home</Link>
      {!token ? (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">register</Link>
        </>
      ) : (
        <>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/profile">Profile</Link>
          <LogoutButton />
        </>
      )}
    </div>
  );
};

export default Navbar;
