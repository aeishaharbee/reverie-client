"use client";

import { useCallback, useEffect, useState } from "react";
import { User as IUser, Post } from "../users/interface";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/app/api/usersApi";
import { getFavouritePosts } from "@/app/api/postsApi";
import { Spinner } from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import PostItem from "../posts/PostItem";

export default function FavouritePosts() {
  const [favouritePosts, setFavouritePosts] = useState<Post[] | null>(null);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserInfo();
        if (userData) {
          setUserInfo(userData);

          const posts = await getFavouritePosts();
          setFavouritePosts(posts);
          console.log(posts);
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

  const handleUpdatePost = useCallback((updatedPost: Post) => {
    setFavouritePosts((prevPosts: any) =>
      prevPosts?.map((post: { _id: string }) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  }, []);

  if (!userInfo || !favouritePosts) {
    return (
      <div className="flex justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  if (favouritePosts.length === 0) {
    return (
      <div className="flex flex-col justify-center w-full h-full items-center">
        <div className="border-4 p-6 rounded-full border-default-300">
          <Icon
            icon="lucide:star-off"
            width={60}
            height={60}
            className="text-default-500"
          />
        </div>
        <p className="text-2xl font-semibold text-default-500 mt-5">
          Start adding your favourite accounts.
        </p>
      </div>
    );
  }

  return (
    <>
      {favouritePosts.map((post) => (
        <PostItem
          key={post._id}
          post={post}
          currentUser={userInfo}
          onUpdatePost={handleUpdatePost}
        />
      ))}
    </>
  );
}
