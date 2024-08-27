import { Icon } from "@iconify/react";
import { saveFunction } from "@/app/api/saveApi";
import { getPostById } from "@/app/api/postsApi";
import { toast } from "react-toastify";

interface SaveButtonProps {
  postId: string;
  initialIsSaved: boolean;
  setIsSaved: (isSaved: boolean) => void;
  setPost: (post: any) => void;
}

export default function SaveButton({
  postId,
  initialIsSaved,
  setIsSaved,
  setPost,
}: SaveButtonProps) {
  const handleSave = async () => {
    try {
      const response = await saveFunction(postId);
      console.log(response);
      if (response === 200) {
        if (initialIsSaved) {
          toast.warning("Removed from save");
        } else {
          toast.success("Added to save");
        }

        setIsSaved(!initialIsSaved);

        const updatedPost = await getPostById(postId);
        setPost(updatedPost);
      }
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  return (
    <>
      <div onClick={handleSave} style={{ cursor: "pointer" }}>
        {initialIsSaved ? (
          <Icon
            icon="bi:bookmark-fill"
            color="#f5dd42"
            width={28}
            height={28}
          />
        ) : (
          <Icon icon="bi:bookmark" width={28} height={28} />
        )}
      </div>
    </>
  );
}
