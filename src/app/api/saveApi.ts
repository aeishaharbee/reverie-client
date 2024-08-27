"use server";
import axios from "axios";
import { cookies } from "next/headers";

const cookieStore = cookies();
const token = cookieStore.get("authToken")?.value;
if (!token) {
  throw new Error("No auth token found");
}

// GET USER SAVE
export const userSavedPosts = async () => {
  try {
    const res = await axios.get(`http://localhost:4444/save`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      data: res.data,
      status: res.status,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};

// CHECK POST INSIDE SAVE
export const getPostInsideSave = async (id: string) => {
  try {
    const res = await axios.get(`http://localhost:4444/save/post/${id}`, {
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

// SAVE POST
export const saveFunction = async (id: string) => {
  const res = await axios.post(
    `http://localhost:4444/save/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.status;
};
