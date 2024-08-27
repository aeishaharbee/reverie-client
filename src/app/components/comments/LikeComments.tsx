import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { likeFunction } from "@/app/api/likeApi";

interface LikeCommentProps {
  commentId: string;
  initialIsLiked: boolean;
  initialLikesCount: number;
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LikeComment({
  commentId,
  initialIsLiked,
  initialLikesCount,
  setIsLiked,
}: LikeCommentProps) {
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked, setIsLiked]);

  const handleLike = async () => {
    try {
      await likeFunction(commentId);
      setIsLiked((prevIsLiked) => !prevIsLiked);
      setLikesCount((prevCount) =>
        initialIsLiked ? prevCount - 1 : prevCount + 1
      );
    } catch (error) {
      console.error("Failed to update like status:", error);
    }
  };

  return (
    <div
      className="flex flex-col items-center cursor-pointer"
      onClick={handleLike}
    >
      <Icon
        icon={initialIsLiked ? "bi:heart-fill" : "bi:heart"}
        color={initialIsLiked ? "red" : ""}
      />
      <p>{likesCount}</p>
    </div>
  );
}
