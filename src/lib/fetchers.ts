"use server";
import axios from "axios";
import { cookies } from "next/headers";

const cookieStore = cookies();
const token = cookieStore.get("authToken")?.value;
if (!token) {
  throw new Error("No auth token found");
}

export async function fetchUser() {
  const response = await axios.get(`http://localhost:4444/users/own/${token}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
    },
  });
  return response.data;
}

export async function fetchUsers() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;
  const response = await axios.get(
    `http://localhost:4444/users/token/${token}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
    }
  );
  return response.data;
}
