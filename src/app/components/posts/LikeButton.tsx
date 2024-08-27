import { Icon } from "@iconify/react";
import { likeFunction } from "@/app/api/likeApi";
import { getPostById } from "@/app/api/postsApi";

interface LikeButtonProps {
  postId: string;
  initialIsLiked: boolean;
  initialLikesCount: number;
  setIsLiked: (isLiked: boolean) => void;
  setLikesCount: (count: number) => void;
  setPost: (post: any) => void;
}

export default function LikeButton({
  postId,
  initialIsLiked,
  initialLikesCount,
  setIsLiked,
  setLikesCount,
  setPost,
}: LikeButtonProps) {
  const handleLike = async () => {
    try {
      const response = await likeFunction(postId);
      console.log(response);
      if (response === 200) {
        setIsLiked(!initialIsLiked);
        setLikesCount(
          initialIsLiked ? initialLikesCount - 1 : initialLikesCount + 1
        );

        const updatedPost = await getPostById(postId);
        setPost(updatedPost);
      }
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  return (
    <div onClick={handleLike} style={{ cursor: "pointer" }}>
      {initialIsLiked ? (
        <Icon icon="bi:heart-fill" color="red" width={28} height={28} />
      ) : (
        <Icon icon="bi:heart" width={28} height={28} />
      )}
    </div>
  );
}
