import Image from "next/image";
import BlogPost from "./components/BlogPost";
import BlogPostView from "./components/BlogPostView";
import { Button } from "@nextui-org/react";
import TopUsers from "./components/TopUsers";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <TopUsers />
      <BlogPostView />
    </main>
  );
}
