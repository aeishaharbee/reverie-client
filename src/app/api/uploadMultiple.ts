import { getToken } from "../handler/tokenHandler";
import axios from "axios";

const token = getToken();

export const uploadMultiple = async (data: {
  caption: string;
  images: File[];
}) => {
  const formData = new FormData();
  formData.append("caption", data.caption);
  data.images.forEach((image) => {
    formData.append("images", image);
  });

  try {
    const response = await axios.post("http://localhost:4444/posts", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.msg || "Unexpected error occurred");
    }
    throw new Error("Unexpected error occurred");
  }
};
