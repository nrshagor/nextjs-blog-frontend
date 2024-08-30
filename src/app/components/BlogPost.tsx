"use client";
import axios from "axios";
import { getCookie } from "cookie-handler-pro";
import React, { useState } from "react";
import { Input, Button, Textarea } from "@nextui-org/react";

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
      await axios.post(url, payload, {
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Write a Blog</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full"
          />
          {errors && <p className="text-red-500 text-sm mt-2">{errors}</p>}

          <Textarea
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            className="w-full"
          />
          {errors && <p className="text-red-500 text-sm mt-2">{errors}</p>}

          <Button color="secondary" type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BlogPost;
