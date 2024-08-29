"use client";
import axios from "axios";
import { getCookie } from "cookie-handler-pro";
import React, { useState } from "react";

const BlogPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });
  const [errors, setErrors] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        body: formData.body,
      };
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/posts`;
      const token = getCookie("token");

      // post blog
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrors("The body field is required.");
      }
    }
  };
  return (
    <div>
      <h1>Write a Blog</h1>
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BlogPost;
