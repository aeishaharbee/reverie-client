"use client";

import { useCallback, useEffect, useState } from "react";
import { User as IUser, Post } from "../users/interface";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/app/api/usersApi";
import { getFollowingPosts } from "@/app/api/postsApi";
import { Spinner } from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import PostItem from "../posts/PostItem";

export default function FollowingPosts() {
  const [followingPosts, setFollowingPosts] = useState<Post[] | null>(null);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserInfo();
        if (userData) {
          setUserInfo(userData);

          const posts = await getFollowingPosts();
          setFollowingPosts(posts);
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
    setFollowingPosts((prevPosts: any) =>
      prevPosts?.map((post: { _id: string }) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  }, []);

  if (!userInfo || !followingPosts) {
    return (
      <div className="flex justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  if (followingPosts.length === 0) {
    return (
      <div className="flex flex-col justify-center w-full h-full items-center">
        <div className="border-4 p-6 rounded-full border-default-300">
          <Icon
            icon="mingcute:user-x-fill"
            width={60}
            height={60}
            className="text-default-500"
          />
        </div>
        <p className="text-2xl font-semibold text-default-500 mt-5">
          You haven't followed anyone yet
        </p>
      </div>
    );
  }

  return (
    <>
      {followingPosts.map((post) => (
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
