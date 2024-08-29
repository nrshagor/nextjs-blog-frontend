"use client";
import axios from "axios";
import { getCookie } from "cookie-handler-pro";
import React, { useState, useEffect } from "react";

interface BlogPostProps {
  postId: number;
}

const Page = ({ params }: { params: { id: number } }) => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });
  const [errors, setErrors] = useState("");

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.id}`;

        const response = await axios.get(url);

        setFormData({
          title: response.data.title,
          body: response.data.body,
        });
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
    fetchPostData();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.id}`;
      const token = getCookie("token");

      // update blog post
      await axios.patch(url, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Post updated successfully!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrors("Failed to update the post. Please try again.");
      }
    }
  };

  return (
    <div>
      <h1>Edit Blog Post {params.id}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          placeholder="title"
          onChange={handleInputChange}
        />
        {errors && <p style={{ color: "red" }}>{errors}</p>}
        <input
          type="text"
          name="body"
          value={formData.body}
          placeholder="body"
          onChange={handleInputChange}
        />
        {errors && <p style={{ color: "red" }}>{errors}</p>}
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};

export default Page;
