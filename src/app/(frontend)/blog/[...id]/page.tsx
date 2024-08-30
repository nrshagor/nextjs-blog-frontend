"use client";
import axios from "axios";
import { getCookie } from "cookie-handler-pro";
import React, { useState, useEffect } from "react";
import { Input, Button, Textarea } from "@nextui-org/react";
import Toast from "@/app/components/Toast";

const Page = ({ params }: { params: { id: number } }) => {
  const [formData, setFormData] = useState<{
    title: string;
    body: string;
    thumbnail?: string;
  }>({
    title: "",
    body: "",
  });
  const [errors, setErrors] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.id}`;
        const response = await axios.get(url);

        setFormData({
          title: response.data.title,
          body: response.data.body,
          thumbnail: "", // Keep thumbnail empty initially
        });
        setExistingImage(response.data.thumbnail); // Set existing image
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData({ ...formData, thumbnail: reader.result as string });
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.id}`;
      const token = getCookie("token");

      // Only include the thumbnail field if a new image has been selected
      const updatedFormData = {
        title: formData.title,
        body: formData.body,
        ...(formData.thumbnail && { thumbnail: formData.thumbnail }),
      };

      await axios.patch(url, updatedFormData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setToastVisible(true);
      setFormData({
        title: "",
        body: "",
        thumbnail: "",
      });
      setExistingImage("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrors("Failed to update the post. Please try again.");
      }
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Edit Blog Post {params.id}
        </h1>
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

          {existingImage && !formData.thumbnail && (
            <div className="mt-4">
              <img
                src={existingImage}
                alt="Current Thumbnail"
                className="w-full h-auto rounded"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-500 text-white mt-4 hover:bg-blue-600"
          >
            Update Post
          </Button>
        </form>
        <Toast
          message="Post updated successfully!"
          show={toastVisible}
          onClose={() => setToastVisible(false)}
        />
      </div>
    </div>
  );
};

export default Page;
