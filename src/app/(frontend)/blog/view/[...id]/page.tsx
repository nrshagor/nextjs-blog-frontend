"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookie-handler-pro";
import { Card, Button, Textarea, Image } from "@nextui-org/react";

const Page = ({ params }: { params: { id: number } }) => {
  const [data, setData] = useState({
    title: "",
    body: "",
    thumbnail: "",
    user_id: null, // Added user_id to track the post owner
  });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentBody, setEditCommentBody] = useState("");
  const user_id = Number(getCookie("user_id"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.id}`;
        const response = await axios.get(url);
        setData({
          title: response.data.title,
          body: response.data.body,
          thumbnail: response.data.thumbnail,
          user_id: response.data.user.id, // Save post owner's user_id
        });

        const commentsUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.id}/comments`;
        const token = getCookie("token");
        const commentsResponse = await axios.get(commentsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComments(commentsResponse.data.data);
      } catch (error) {
        console.error("Error fetching post or comments data:", error);
      }
    };
    fetchData();
  }, [params.id]);

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const commentUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.id}/comments`;
      const token = getCookie("token");

      await axios.post(
        commentUrl,
        { body: newComment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewComment(""); // Clear the input field after submission

      const commentsResponse = await axios.get(commentUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(commentsResponse.data.data);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleCommentEdit = async (commentId: number) => {
    try {
      const editUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.id}/comments/${commentId}`;
      const token = getCookie("token");

      await axios.put(
        editUrl,
        { body: editCommentBody },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditCommentId(null); // Clear edit mode
      setEditCommentBody(""); // Clear the edit input

      const commentsUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.id}/comments`;
      const commentsResponse = await axios.get(commentsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(commentsResponse.data.data);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    try {
      const deleteUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.id}/comments/${commentId}`;
      const token = getCookie("token");

      await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const commentsUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${params.id}/comments`;
      const commentsResponse = await axios.get(commentsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(commentsResponse.data.data);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="flex justify-center items-center gap-8 px-4 py-4">
        {/* Add Image at the top of the blog post */}
        <Image
          src={data.thumbnail}
          alt={data.title}
          className="w-full object-cover h-[300px] rounded-t-lg"
          width="50%"
          height={300}
        />
        <div>
          <h1 className="text-2xl font-bold">{data.title}</h1>
        </div>
        <div>
          <p className="text-lg">{data.body}</p>
        </div>
      </Card>

      {/* Comment Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        {comments.map((comment: any) => (
          <div
            key={comment.id}
            className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm"
          >
            {editCommentId === comment.id ? (
              <div className="mb-2">
                <Textarea
                  value={editCommentBody}
                  onChange={(e) => setEditCommentBody(e.target.value)}
                  placeholder="Edit your comment"
                  fullWidth
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    color="primary"
                    onPress={() => handleCommentEdit(comment.id)}
                    className="mr-2"
                  >
                    Save
                  </Button>
                  <Button size="sm" onPress={() => setEditCommentId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p>{comment.body}</p>
                <small className="text-gray-500">by {comment.user.name}</small>
                {comment.user.id === user_id && (
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button
                      size="sm"
                      onPress={() => {
                        setEditCommentId(comment.id);
                        setEditCommentBody(comment.body);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onPress={() => handleCommentDelete(comment.id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comment submission form */}
      {data.user_id !== user_id && (
        <div className="mt-8">
          <form onSubmit={handleCommentSubmit}>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              fullWidth
            />
            <Button
              type="submit"
              size="lg"
              color="secondary"
              className="mt-4 w-full"
            >
              Submit Comment
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Page;
