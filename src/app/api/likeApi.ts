"use server";
import axios from "axios";
import { cookies } from "next/headers";

export const likeFunction = async (id: string) => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token) {
    throw new Error("No auth token found");
  }

  const res = await axios.post(
    `http://localhost:4444/likes/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.status;
};
