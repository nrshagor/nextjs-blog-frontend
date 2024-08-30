import BlogPost from "@/app/components/BlogPost";
import BlogPostView from "@/app/components/BlogPostView";
import MyBlogPost from "@/app/components/MyBlogPost";
import React from "react";

const page = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <BlogPost />
      <MyBlogPost />
    </div>
  );
};

export default page;
