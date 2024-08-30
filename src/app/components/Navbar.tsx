"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import React, { useEffect } from "react";
import "../style/navbar.scss";
import LogoutButton from "./LogoutButton";
import { usePathname } from "next/navigation";
import { getCookie } from "cookie-handler-pro";
import Link from "next/link";

const Navbars = () => {
  const token = getCookie("token");
  const path = usePathname();

  const menuItems = [
    // { name: "All Blog", path: "/blog" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <>
      <Navbar disableAnimation isBordered>
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarContent className="sm:hidden pr-3" justify="center">
          <NavbarBrand>
            <Link color="foreground" href="/">
              <p className="font-bold text-inherit">Blog Pro</p>
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarBrand>
            <Link color="foreground" href="/">
              <p className="font-bold text-inherit">Blog Pro</p>
            </Link>
          </NavbarBrand>
          {/* <NavbarItem isActive={path === "/blog"}>
            <Link href="/blog" aria-current="page" color="warning">
              All Blog
            </Link>
          </NavbarItem> */}
        </NavbarContent>

        <NavbarContent justify="end">
          {!token ? (
            <>
              <NavbarItem>
                <Link href="/login">Login</Link>
              </NavbarItem>
              <NavbarItem>
                <Button
                  as={Link}
                  color="warning"
                  href="/register"
                  variant="flat"
                >
                  Sign Up
                </Button>
              </NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem>
                <Link href="/dashboard">Dashboard</Link>
              </NavbarItem>
              <LogoutButton />
            </>
          )}
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <Link
                className="w-full"
                color={item.name === "Dashboard" ? "warning" : "foreground"}
                href={item.path}
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
          {!token && (
            <>
              <NavbarMenuItem>
                <Link className="w-full" href="/login">
                  Login
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link className="w-full" href="/register">
                  Sign Up
                </Link>
              </NavbarMenuItem>
            </>
          )}
          {token && (
            <NavbarMenuItem>
              <Link className="w-full" href="#">
                <LogoutButton />
              </Link>
            </NavbarMenuItem>
          )}
        </NavbarMenu>
      </Navbar>
    </>
  );
};

export default Navbars;
