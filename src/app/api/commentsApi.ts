"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { newComment } from "../posts/[id]/page";

// ADD COMMENT
export const addComment = async ({
  comment,
  id,
}: {
  comment: newComment;
  id: string;
}) => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token) {
    throw new Error("No auth token found");
  }
  try {
    let res = await axios.post(
      `http://localhost:4444/comments/${id}`,
      comment,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};

// DELETE COMMENT
export const deleteComment = async ({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token) {
    throw new Error("No auth token found");
  }

  try {
    const res = await axios.delete(
      `http://localhost:4444/comments/${postId}/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.status;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};
