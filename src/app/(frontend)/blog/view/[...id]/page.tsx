"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookie-handler-pro"; // Import to handle cookies

const Page = ({ params }: { params: { id: number } }) => {
  const [data, setData] = useState({
    title: "",
    body: "",
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
        });

        // Fetch comments
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

      // Re-fetch comments after posting a new one
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

      // Re-fetch comments after editing
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

      // Re-fetch comments after deleting
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
    <div>
      <p>{data.title}</p>
      <p>{data.body}</p>

      {/* Display comments */}
      <div>
        <h3>Comments </h3>
        {comments.map((comment: any) => (
          <div key={comment.id}>
            {editCommentId === comment.id ? (
              <div>
                <textarea
                  value={editCommentBody}
                  onChange={(e) => setEditCommentBody(e.target.value)}
                />
                <button onClick={() => handleCommentEdit(comment.id)}>
                  Save
                </button>
                <button onClick={() => setEditCommentId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>{comment.body}</p>
                <small>by {comment.user.name}</small>
                {comment.user.id === user_id && ( // Assuming user_id is stored in cookies
                  <div>
                    <button
                      onClick={() => {
                        setEditCommentId(comment.id);
                        setEditCommentBody(comment.body);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleCommentDelete(comment.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comment submission form */}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          name="comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
};

export default Page;
