"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { Post } from "../components/users/interface";

const cookieStore = cookies();
const token = cookieStore.get("authToken")?.value;
if (!token) {
  throw new Error("No auth token found");
}

// GET FOLLOWING POSTS
export const getFollowingPosts = async () => {
  try {
    const res = await axios.get("http://localhost:4444/posts/following", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};

// GET FAVOURITE POSTS
export const getFavouritePosts = async () => {
  try {
    const res = await axios.get("http://localhost:4444/posts/favourite", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};

// GET RANDOM POSTS
export const getRandomPosts = async () => {
  try {
    let res = await axios.get(`http://localhost:4444/posts/random`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};

// GET POSTS BY USER
export const getUserPosts = async (id: string) => {
  try {
    let res = await axios.get(`http://localhost:4444/posts/user/${id}`);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};

// GET POSTS FROM LOGGED IN USER
export const getUserOwnPosts = async () => {
  try {
    const res = await axios.get("http://localhost:4444/posts/owner", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        sort: "created_at",
        order: "desc",
      },
    });
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};

// GET POST BY ID
export const getPostById = async (id: string) => {
  try {
    let res = await axios.get(`http://localhost:4444/posts/${id}`);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};

// GET ALL POST
export const getAllPosts = async () => {
  try {
    let res = await axios.get(`http://localhost:4444/posts`);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};

// // ADD NEW POST
// export const addNewPost = async (data: { caption: string; images: File[] }) => {
//   const formData = new FormData();
//   formData.append("caption", data.caption);
//   data.images.forEach((image) => {
//     formData.append("images", image);
//   });

//   const cookieStore = cookies();
//   const token = cookieStore.get("authToken")?.value;
//   if (!token) {
//     throw new Error("No auth token found");
//   }

//   try {
//     const response = await axios.post("http://localhost:4444/posts", formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     return response.data;
//   } catch (error: any) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data.msg || "Unexpected error occurred");
//     }
//     throw new Error("Unexpected error occurred");
//   }
// };

// EDIT POST
export const updatePost = async ({
  postId,
  updatedPost,
}: {
  postId: string;
  updatedPost: Post;
}) => {
  try {
    const res = await axios.put(
      `http://localhost:4444/posts/${postId}`,
      updatedPost,
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

// DELETE IMAGE INSIDE POST
export const deleteImagePost = async ({
  postId,
  imageName,
}: {
  postId: string;
  imageName: string;
}) => {
  try {
    const res = await axios.delete(
      `http://localhost:4444/posts/${postId}/${imageName}`,
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

// DELETE ENTIRE POST
export const deleteEntirePost = async (id: string) => {
  try {
    const res = await axios.delete(`http://localhost:4444/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};
