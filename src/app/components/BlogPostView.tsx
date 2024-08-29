"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookie-handler-pro";

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

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleEdit = (postId: number) => {
    const editUrl = `/blog/${postId}`; // You can replace this with your actual edit page route
    window.location.href = editUrl;
  };
  const handleView = (postId: number) => {
    const editUrl = `/blog/view/${postId}`; // You can replace this with your actual edit page route
    window.location.href = editUrl;
  };

  const handleDelete = async (postId: number) => {
    const token = getCookie("token");
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
    }
  };

  return (
    <div>
      <h1>Blog Posts</h1>
      {blogPosts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
          <small>by {post.user.name}</small>
          <button onClick={() => handleView(post.id)}>View</button>
          {token && (
            <div>
              <button onClick={() => handleEdit(post.id)}>Edit</button>
              <button
                onClick={() => handleDelete(post.id)}
                style={{ color: "red" }}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {lastPage}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === lastPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogPostView;
