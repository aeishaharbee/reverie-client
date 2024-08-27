"use client";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Spinner } from "@nextui-org/react";
import PostItemSmall from "@/app/components/posts/PostItemSmall";
import SearchInput from "@/app/components/search/SearchInput";
import { Post, User as IUser } from "@/app/components/users/interface";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/app/api/usersApi";
import { getRandomPosts } from "@/app/api/postsApi";

export default function ExploreAllPage() {
  const [randomPosts, setRandomPosts] = useState<Post[] | null>(null);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const router = useRouter();

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

  const handleUpdatePost = useCallback((updatedPost: Post) => {
    setRandomPosts((prevPosts: any) =>
      prevPosts?.map((post: { _id: string }) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  }, []);

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
      <div className="container my-5">
        <SearchInput />

        {/* RANDOM POSTS */}
        <div className="random-posts mt-5">
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 ">
            {randomPosts.map((post) => (
              <PostItemSmall
                key={post._id}
                post={post}
                route="/explore/posts"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
