"use client";

import { useCallback, useEffect, useState } from "react";
import { User as IUser, Post } from "@/app/components/users/interface";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserInfo } from "@/app/api/usersApi";
import { Spinner } from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PostItem from "@/app/components/posts/PostItem";
import { userSavedPosts } from "@/app/api/saveApi";

export default function ProfileSaved() {
  const [savedPosts, setSavedPosts] = useState<Post[] | null>(null);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserInfo();
        if (userData) {
          setUserInfo(userData);

          const posts = await userSavedPosts();

          const postsArray = posts.data.saveExist.posts.map(
            (item: { post: Post }) => item.post
          );
          setSavedPosts(postsArray);
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
    if (savedPosts) {
      const section = searchParams.get("section");
      if (section) {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          router.push("/profile/saved", { scroll: false });
        }
      }
    }
  }, [savedPosts, searchParams, router]);

  const handleUpdatePost = useCallback((updatedPost: Post) => {
    setSavedPosts((prevPosts: any) =>
      prevPosts?.map((post: { _id: string }) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  }, []);

  const prevPage = (): void => {
    router.push("/profile");
  };

  if (!userInfo || !savedPosts) {
    return (
      <div className="flex justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  if (savedPosts.length === 0) {
    return (
      <div className="flex flex-col justify-center w-full h-full items-center">
        <Icon icon="bi:images" width={100} height={100} />
        <p className="text-xl mt-5 font-semibold">
          You haven't saved any posts yet.
        </p>
      </div>
    );
  }

  console.log(savedPosts);

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
        {savedPosts
          .map((post) => (
            <div id={post._id} key={post._id}>
              <PostItem
                post={post}
                currentUser={userInfo}
                onUpdatePost={handleUpdatePost}
              />
            </div>
          ))
          .reverse()}

        <ToastContainer position="bottom-right" />
      </div>
    </>
  );
}
