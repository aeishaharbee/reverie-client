"use server";
import axios from "axios";
import { cookies } from "next/headers";

const cookieStore = cookies();
const token = cookieStore.get("authToken")?.value;
if (!token) {
  throw new Error("No auth token found");
}

export const acceptRequest = async (id: string) => {
  try {
    const res = await axios.post(
      `http://localhost:4444/request/${id}`,
      {},
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

export const deleteRequest = async (id: string) => {
  try {
    const res = await axios.delete(`http://localhost:4444/request/${id}`, {
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

export const getRequest = async (id: string) => {
  try {
    const res = await axios.get(`http://localhost:4444/request/${id}`, {
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
