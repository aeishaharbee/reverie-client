"use client";
import { useEffect, useState } from "react";
import { deleteEntirePost, getPostById } from "@/app/api/postsApi";
import { notFound, useRouter } from "next/navigation";
import { Spinner, useDisclosure } from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CommentObj, LikeObj } from "@/app/components/users/interface";
import { User as IUser } from "@/app/components/users/interface";
import { getUserInfo } from "@/app/api/usersApi";
import { getPostInsideSave } from "@/app/api/saveApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteComment } from "@/app/api/commentsApi";
import EditPostModal from "@/app/components/posts/EditPost";
import Swal from "sweetalert2";
import PostItem from "@/app/components/posts/PostItem";

interface PostPageProps {
  params: {
    id: string;
  };
}

export interface newComment {
  body: string;
}

export default function PostPage({ params }: PostPageProps) {
  const [post, setPost] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    async function fetchPostById(id: string) {
      console.log("Fetching post with ID:", id);

      try {
        const userData = await getUserInfo();
        if (userData) {
          setCurrentUser(userData);
        } else {
          router.push("/login");
        }

        const post = await getPostById(id);
        console.log("Fetched post:", post);
        if (!post) {
          notFound();
        } else {
          setPost(post);
          setIsLiked(
            post.likes.some(
              (like: LikeObj) => like.liker.user._id === userData._id
            )
          );
          setLikesCount(post.likes.length);
        }

        const save = await getPostInsideSave(id);
        console.log(save);
        if (save.saveExist !== null) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
        // notFound();
      }
    }

    fetchPostById(params.id);
  }, [params.id]);
  const handleUpdatePost = (updatedPost: any) => setPost(updatedPost);

  const handleDeleteImage = (deletedImage: string) => {
    setPost((prevPost: any) => ({
      ...prevPost,
      images: prevPost.images.filter(
        (image: { image: string }) => image.image !== deletedImage
      ),
    }));
  };

  const prevPage = (): void => {
    router.back();
  };

  if (!post || !currentUser) {
    return (
      <div className="flex justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  return (
    <>
      <div className="container my-9 relative pt-5 md:pt-0">
        <div
          className="absolute top-0 left-3 lg:left-10 z-10 cursor-pointer rounded-full px-2 hover:bg-default-200"
          onClick={prevPage}
        >
          <Icon icon="lucide:move-left" width={30} height={30} />
        </div>
        <PostItem
          post={post}
          currentUser={currentUser}
          onUpdatePost={handleUpdatePost}
        />
      </div>
      <EditPostModal
        currentUser={currentUser}
        post={post}
        isOpen={isOpen}
        onClose={onOpenChange}
        onUpdatePost={handleUpdatePost}
        onDeleteImage={handleDeleteImage}
      />
      <ToastContainer position="bottom-right" />
    </>
  );
}
