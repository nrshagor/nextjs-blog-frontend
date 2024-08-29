import Image from "next/image";
import BlogPost from "./components/BlogPost";
import BlogPostView from "./components/BlogPostView";
import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>hello next</h1>
      <Button>Click me</Button>
      <BlogPost />

      <BlogPostView />
    </main>
  );
}
