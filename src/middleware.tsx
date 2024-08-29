import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  [key: string]: any;
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  console.log(token);

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard/profile",
    // "/dashboard/userlist",
    // "/dashboard/productlist",
  ],
};
