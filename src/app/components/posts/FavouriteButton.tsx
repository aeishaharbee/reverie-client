import { Icon } from "@iconify/react";
import { favUnfav } from "@/app/api/usersApi";
import { getPostById } from "@/app/api/postsApi";
import { Post, User as IUser } from "../users/interface";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface FavouriteButtonProps {
  post: Post;
  currentUser: IUser;
  initialIsFav: boolean;
  setIsFav: (isFav: boolean) => void;
  setPost: (post: any) => void;
}

export default function FavouriteButton({
  post,
  currentUser,
  initialIsFav,
  setIsFav,
  setPost,
}: FavouriteButtonProps) {
  const router = useRouter();
  const handleFav = async () => {
    try {
      const response = await favUnfav(post.user._id);
      console.log(response);
      if (response.status === 200) {
        setIsFav(!initialIsFav);
        const updatedPost = await getPostById(post._id);
        setPost(updatedPost);

        if (response.data.favUser != null) {
          toast.success("Added account to favourite");
        } else {
          toast.warning("Removed account from favourite");
        }

        router.refresh();
      }
    } catch (error) {
      console.error("Error addinf account to favourite:", error);
    }
  };

  return (
    <div onClick={handleFav} style={{ cursor: "pointer" }}>
      {initialIsFav ? (
        <Icon icon="bi:star-fill" color="#7828C8" width={28} height={28} />
      ) : (
        <Icon icon="bi:star" width={28} height={28} />
      )}
    </div>
  );
}
