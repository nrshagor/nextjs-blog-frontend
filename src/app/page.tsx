import Image from "next/image";
import BlogPost from "./components/BlogPost";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>hello next</h1>
      <BlogPost />
    </main>
  );
}
