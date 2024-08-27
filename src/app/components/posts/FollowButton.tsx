import { followUnfol } from "@/app/api/usersApi";
import { getPostById } from "@/app/api/postsApi";
import { Post, User as IUser } from "../users/interface";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

interface FollowButtonProps {
  post: Post;
  currentUser: IUser;
  initialIsFollow: boolean;
  setIsFollow: (isFollow: boolean) => void;
  setIsFav: (isFav: boolean) => void;
  setPost: (post: any) => void;
}

export default function FollowButton({
  post,
  currentUser,
  initialIsFollow,
  setIsFollow,

  setIsFav,
  setPost,
}: FollowButtonProps) {
  const router = useRouter();

  const handleFollow = async () => {
    try {
      const response = await followUnfol(post.user._id);
      console.log(response);

      if (response.status === 200) {
        setIsFollow(!initialIsFollow);
        const updatedPost = await getPostById(post._id);
        setPost(updatedPost);

        if (response.data.userToFollow != null) {
          toast.success("Followed account");
        } else {
          toast.warning("Unfollowed account");
          setIsFav(false);
        }

        router.refresh();
      }
    } catch (error) {
      console.error("Error following account:", error);
    }
  };

  return (
    <Button
      color="secondary"
      variant={initialIsFollow ? "ghost" : "solid"}
      onPress={handleFollow}
    >
      {initialIsFollow ? "Unfollow" : "Follow"}
    </Button>
  );
}
