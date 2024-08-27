"use client";
import { getUserPosts } from "@/app/api/postsApi";
import { getUserInfo } from "@/app/api/usersApi";
import { Post, User as IUser } from "@/app/components/users/interface";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { fetchUserById } from "../page";
import { Spinner } from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PostItem from "@/app/components/posts/PostItem";

interface UserPostsPageProps {
  params: {
    username: string;
  };
}

export default function UserPage({ params }: UserPostsPageProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [userPosts, setUserPosts] = useState<Post[] | null>(null);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchData() {
      const fetchedUser = await fetchUserById(params.username);
      if (!fetchedUser) {
        notFound();
      }
      setUser(fetchedUser);

      try {
        const userData = await getUserInfo();
        if (userData) {
          setUserInfo(userData);
        } else {
          router.push("/login");
        }

        const posts = await getUserPosts(fetchedUser._id);
        setUserPosts(posts);
      } catch (error) {
        console.error("Failed to fetch user info or posts:", error);
        router.push("/login");
      }
    }

    fetchData();
  }, [router]);

  useEffect(() => {
    if (userPosts) {
      const section = searchParams.get("section");
      if (section) {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          router.push(`/users/${params.username}/posts`, { scroll: false });
        }
      }
    }
  }, [userPosts, searchParams, router]);

  const handleUpdatePost = useCallback((updatedPost: Post) => {
    setUserPosts((prevPosts: any) =>
      prevPosts?.map((post: { _id: string }) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  }, []);

  const prevPage = (): void => {
    router.push(`/users/${params.username}`);
  };

  if (!userInfo || !userPosts) {
    return (
      <div className="flex justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  if (userPosts.length === 0) {
    return (
      <div className="flex flex-col justify-center w-full h-full items-center">
        <Icon icon="bi:images" width={100} height={100} />
        <p className="text-xl mt-5 font-semibold">
          This user haven't posted any posts yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex justify-end fixed top-3 left-3 lg:left-10 z-10  ">
        <div className="w-full md:w-8/12 lg:w-9/12 xl:w-10/12  ">
          <div
            className="w-fit cursor-pointer hover:bg-default-200 rounded-full px-2 relative flex justify-center"
            onClick={prevPage}
          >
            <Icon icon="lucide:move-left" width={30} height={30} />
          </div>
        </div>
      </div>
      <div className="container relative">
        {userPosts.map((post) => (
          <div id={post._id} key={post._id}>
            <PostItem
              post={post}
              currentUser={userInfo}
              onUpdatePost={handleUpdatePost}
            />
          </div>
        ))}

        <ToastContainer position="bottom-right" />
      </div>
    </>
  );
}
