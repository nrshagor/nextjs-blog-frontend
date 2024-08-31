"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import Link from "next/link";

// Define the type for post data
interface Post {
  id: number;
  title: string;
  body: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
  comments_count: number; // Added comments_count field
}

const TopPosts: React.FC = () => {
  const [topPosts, setTopPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchTopPosts = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/top-posts`;
        const response = await axios.get(url);
        setTopPosts(response.data);
      } catch (error) {
        console.error("Error fetching top posts:", error);
      }
    };
    fetchTopPosts();
  }, []);

  const getImageUrl = (thumbnail: string) => {
    // Construct the full URL for the thumbnail
    return `${process.env.NEXT_PUBLIC_API_URL}/storage/${thumbnail}`;
  };

  return (
    <div className="pt-16">
      <h1 className="text-center text-3xl font-bold uppercase p-8">
        The top 5 posts with the most comments.
      </h1>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {topPosts.map((post) => (
          <Card className="max-w-[300px]" shadow="sm" key={post.id} isPressable>
            <CardBody className="overflow-visible p-0">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={post.title}
                className="w-full object-cover h-[140px]"
                src={
                  post.thumbnail != null
                    ? getImageUrl(post.thumbnail)
                    : "/default_image.png"
                } // Use the constructed thumbnail URL
              />
              <CardBody>
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-default-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="text-default-500">
                  {post.body.length > 100
                    ? `${post.body.substring(0, 100)}...`
                    : post.body}
                </p>
                <p className="text-default-500">
                  Comments: {post.comments_count} {/* Display comments count */}
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
    </div>
  );
};

export default TopPosts;
