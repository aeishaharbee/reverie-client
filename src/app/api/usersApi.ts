"use server";
import axios from "axios";
import { cookies } from "next/headers";

const cookieStore = cookies();
const token = cookieStore.get("authToken")?.value;
if (!token) {
  throw new Error("No auth token found");
}

interface User {
  username: string;
  password: string;
  email?: string;
  fullname?: string;
}

// SEARCH FOR FOLLOWING
export const searchFollowing = async (query: string) => {
  try {
    const url = `http://localhost:4444/users/search/following?query=${query}`;
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

// GET FOLLOWINGS USER
export const getFollowingsUsers = async () => {
  try {
    const res = await axios.get("http://localhost:4444/users/following", {
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

// SEARCH FOR USER
export const searchUser = async (query: string) => {
  try {
    const url = `http://localhost:4444/users/search?query=${query}`;
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};

// GET USER INFO BY ID
export const getUserByUsername = async (uname: any) => {
  let res = await axios.get(`http://localhost:4444/users/${uname}`);
  return res.data;
};

// REGISTER
export const registerUser = async (user: User) => {
  try {
    let res = await axios.post("http://localhost:4444/users/register", user);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};

// LOGIN
export const loginUser = async (user: User) => {
  try {
    let res = await axios.post("http://localhost:4444/users/login", user);
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};

// GET OWN USER INFO
export const getUserInfo = async () => {
  const res = await axios.get("http://localhost:4444/users/owner", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// GET ALL USERS
export const getAllUsers = async () => {
  try {
    const res = await axios.get("http://localhost:4444/users/all", {
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

// EDIT USER PROFILE DETAILS
export const editUserProfile = async (formData: FormData) => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    throw new Error("No auth token found");
  }

  try {
    await axios.put("http://localhost:4444/users/update", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};

// DELETE PFP
export const removePfp = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    throw new Error("No auth token found");
  }

  try {
    const res = await axios.delete("http://localhost:4444/users/pfp", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to remove user profile picture:", error);
    throw error;
  }
};

// FOLLOW / UNFOL
export const followUnfol = async (id: string) => {
  const res = await axios.post(
    `http://localhost:4444/follows/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return { data: res.data, status: res.status };
};

// DELETE FOLLOWER
export const removeFoll = async (id: string) => {
  const res = await axios.delete(`http://localhost:4444/follows/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ADD ACC TO FAVOURTIE
export const favUnfav = async (id: string) => {
  const res = await axios.post(
    `http://localhost:4444/favs/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return { data: res.data, status: res.status };
};
