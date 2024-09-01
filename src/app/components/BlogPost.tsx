"use client";
import axios from "axios";
import { getCookie } from "../utils/cookies";
import React, { useState } from "react";
import { Input, Button, Textarea } from "@nextui-org/react";
import Toast from "./Toast"; // Import the Toast component

interface FormData {
  title: string;
  body: string;
  thumbnail: File | null; // Allow both File and null
}

const BlogPost: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    body: "",
    thumbnail: null, // Initialize with null
  });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, thumbnail: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("body", formData.body);

      if (formData.thumbnail) {
        payload.append("thumbnail", formData.thumbnail); // Use the file directly
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/posts`;
      const token = getCookie("token");

      await axios.post(url, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setToastVisible(true);
      setFormData({ title: "", body: "", thumbnail: null });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error details:", error.response?.data);
        setErrors(error.response?.data.message || "An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center  p-5">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Write a Blog</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full"
            placeholder="Title"
          />
          {errors && <p className="text-red-500 text-sm mt-2">{errors}</p>}

          <Textarea
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            className="w-full"
            placeholder="Body"
          />
          {errors && <p className="text-red-500 text-sm mt-2">{errors}</p>}

          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          <Button
            color="secondary"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
      <Toast
        message="Blog post successfully submitted!"
        show={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};

export default BlogPost;
