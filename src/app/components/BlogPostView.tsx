"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookie-handler-pro";
import Link from "next/link"; // Import Link
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Pagination,
  Button,
} from "@nextui-org/react";

// Define the types for the post and user data
interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  thumbnail: string; // Ensure the Post interface includes the thumbnail field
  created_at: string;
  updated_at: string;
  user: User;
}

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

interface ApiResponse {
  data: Post[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: Meta;
}

const BlogPostView: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const token = getCookie("token");
  const user_id = Number(getCookie("user_id"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/posts?page=${currentPage}`;
        const response = await axios.get<ApiResponse>(url);
        setBlogPosts(response.data.data);
        setLastPage(response.data.meta.last_page);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleDelete = async (postId: number) => {
    const deleteUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`;

    try {
      await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Post deleted successfully!");
      setBlogPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId)
      );
    } catch (error) {
      console.error("Failed to delete the post:", error);
      alert("Failed to delete the post. Please try again.");
    }
  };

  const truncateText = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className="py-2">
      <h1 className="text-center text-4xl font-bold uppercase p-8">
        Blog Posts
      </h1>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {blogPosts.map((post) => (
          <Card className="max-w-[300px]" shadow="sm" key={post.id} isPressable>
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={post.title}
                className="w-full object-cover h-[140px]"
                src={post.thumbnail || "/default-image.jpg"} // Use the correct thumbnail URL
              />
              <CardBody>
                <b>{post.title}</b>
                <p className="text-default-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="text-default-500">
                  {truncateText(post.body, 100)}
                </p>
              </CardBody>
            </CardBody>
            <CardFooter className="text-small justify-between">
              <div className="flex w-100 justify-between space-x-2 items-center mt-2">
                <Link
                  className="bg-blue-100 hover:bg-blue-200 text-black font-bold py-2 px-4 rounded-medium"
                  href={`/blog/view/${post.id}`}
                  passHref
                >
                  SEE MORE
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-5 mt-5">
        <p className="text-small text-default-500">
          Selected Page: {currentPage}
        </p>
        <Pagination
          total={lastPage}
          color="secondary"
          page={currentPage}
          onChange={setCurrentPage}
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="flat"
            color="secondary"
            onPress={() =>
              setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
            }
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="flat"
            color="secondary"
            onPress={() =>
              setCurrentPage((prev) => (prev < lastPage ? prev + 1 : prev))
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostView;
