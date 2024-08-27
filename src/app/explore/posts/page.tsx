"use client";
import { getRandomPosts } from "@/app/api/postsApi";
import { getUserInfo } from "@/app/api/usersApi";
import PostItem from "@/app/components/posts/PostItem";
import { User as IUser, Post } from "@/app/components/users/interface";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Spinner } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ExplorePosts() {
  const [randomPosts, setRandomPosts] = useState<Post[] | null>(null);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserInfo();
        if (userData) {
          setUserInfo(userData);

          const posts = await getRandomPosts();
          setRandomPosts(posts);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user info or posts:", error);
        router.push("/login");
      }
    }

    fetchData();
  }, [router]);

  useEffect(() => {
    if (randomPosts) {
      const section = searchParams.get("section");
      if (section) {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          router.push("/explore/posts", { scroll: false });
        }
      }
    }
  }, [randomPosts, searchParams, router]);

  const handleUpdatePost = useCallback((updatedPost: Post) => {
    setRandomPosts((prevPosts: any) =>
      prevPosts?.map((post: { _id: string }) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  }, []);

  const prevPage = (): void => {
    router.push("/explore/all");
  };

  if (!userInfo || !randomPosts) {
    return (
      <div className="flex justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  if (randomPosts.length === 0) {
    return (
      <div className="flex flex-col justify-center w-full h-full items-center">
        <div className="border-4 p-6 rounded-full border-default-300">
          <Icon
            icon="bi:images"
            width={60}
            height={60}
            className="text-default-500"
          />
        </div>
        <p className="text-2xl font-semibold text-default-500 mt-5">
          No posts yet.
        </p>
      </div>
    );
  }

  return (
    <>
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
          {randomPosts.map((post) => (
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
    </>
  );
}
