import Image from "next/image";
import BlogPost from "./components/BlogPost";
import BlogPostView from "./components/BlogPostView";
import { Button } from "@nextui-org/react";
import TopUsers from "./components/TopUsers";
import TopPosts from "./components/TopPosts";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-center  p-24">
      <BlogPostView />
      <TopPosts />
      <TopUsers />
    </main>
  );
}
