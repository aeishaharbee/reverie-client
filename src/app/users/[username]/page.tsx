"use client";
import { getUserAlbums } from "@/app/api/albumApi";
import { getUserPosts } from "@/app/api/postsApi";
import { getRequest } from "@/app/api/requestApi";
import {
  followUnfol,
  getUserByUsername,
  getUserInfo,
} from "@/app/api/usersApi";
import AlbumItem from "@/app/components/album/AlbumItem";
import PostItemSmall from "@/app/components/posts/PostItemSmall";
import FollowersModal from "@/app/components/users/FollowersModal";
import FollowingModal from "@/app/components/users/FollowingModal";
import { Post, User as IUser, Album } from "@/app/components/users/interface";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Card,
  CardBody,
  Link,
  Spinner,
  useDisclosure,
  Image,
  CardFooter,
  Button,
  Divider,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface UserPageProps {
  params: {
    username: string;
  };
}

export async function fetchUserById(username: string) {
  console.log("Fetching user with username:", username);
  try {
    const user = await getUserByUsername(username);
    console.log("Fetched user:", user);
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export default function UserPage({ params }: UserPageProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenFolwer,
    onOpen: onOpenFolwer,
    onOpenChange: onOpenChangeFolwer,
  } = useDisclosure();
  const [user, setUser] = useState<IUser | null>(null);
  const [currentUser, setcurrentUser] = useState<IUser | null>(null);
  const [userPosts, setUserPosts] = useState<Post[] | null>(null);
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const fetchedUser = await fetchUserById(params.username);
      if (!fetchedUser) {
        notFound();
      }
      setUser(fetchedUser);

      try {
        const posts = await getUserPosts(fetchedUser._id);
        setUserPosts(posts);

        const albums = await getUserAlbums(fetchedUser._id);
        setAlbums(albums.albums);

        const userData = await getUserInfo();
        if (userData) {
          setcurrentUser(userData);
          setIsFollowing(
            userData.followings.some(
              (followingObj: { following: { _id: string } }) =>
                followingObj.following._id === fetchedUser._id
            )
          );

          const requestFetched = await getRequest(fetchedUser._id);
          if (requestFetched != null) {
            setIsRequested(requestFetched);
          } else {
            setIsRequested(false);
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user info or posts:", error);
        router.push("/login");
      }
    }

    fetchData();
  }, [params.username, router]);

  if (!user || !userPosts || !currentUser || !albums) {
    return (
      <div className="flex justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  if (currentUser._id === user._id) {
    router.push("/profile");
  }

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        const result = await Swal.fire({
          title: `Unfollow @${user.username}?`,
          text: user.isPrivate
            ? "You are about to unfollow a private account. You won't be able to follow them back unless they approve your request."
            : "",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, unfollow!",
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          try {
            const updatedUser = await followUnfol(user._id);

            setIsFollowing(false);
            setUser(updatedUser.data.following);
            setcurrentUser(updatedUser.data.follower);
            Swal.fire({
              title: "Unfollowed!",
              icon: "success",
            });
          } catch (error) {
            console.error("Failed to delete album:", error);
            Swal.fire({
              title: "Error",
              text: "Failed to delete the album.",
              icon: "error",
            });
          }
        }
      } else {
        if (isRequested) {
          await followUnfol(user._id);
          setIsRequested(false);
        } else if (user.isPrivate) {
          await followUnfol(user._id);
          setIsRequested(true);
        } else {
          const updatedUser = await followUnfol(user._id);
          setIsFollowing(true);
          setUser(updatedUser.data.userToFollow);
          setcurrentUser(updatedUser.data.user);
        }
      }

      if (isOpenFolwer) {
        onOpenChangeFolwer();
      }
    } catch (error) {
      console.error("Failed to follow/unfollow:", error);
    }
  };

  let tabs = [
    {
      id: "posts",
      label: "Posts",
      content: (
        <>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 w-full">
            {userPosts.length ? (
              userPosts.map((post) => (
                <PostItemSmall
                  key={post._id}
                  post={post}
                  route={`/users/${params.username}/posts`}
                />
              ))
            ) : (
              <div className="flex flex-col w-full items-center col-span-3 mt-10">
                <div className="border-4 p-6 rounded-full border-default-300">
                  <Icon
                    icon="bi:images"
                    width={60}
                    height={60}
                    className="text-default-500"
                  />
                </div>
                <p className="text-2xl font-semibold text-default-500 mt-5">
                  No post
                </p>
              </div>
            )}
          </div>
        </>
      ),
    },
    {
      id: "album",
      label: "Album",
      content: (
        <>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 w-full">
            {albums.length ? (
              albums.map((album) => <AlbumItem key={album._id} album={album} />)
            ) : (
              <div className="flex flex-col w-full items-center col-span-3 mt-10">
                <div className="border-4 p-6 rounded-full border-default-300">
                  <Icon
                    icon="bi:journal-album"
                    width={60}
                    height={60}
                    className="text-default-500"
                  />
                </div>
                <p className="text-2xl font-semibold text-default-500 mt-5">
                  No album
                </p>
              </div>
            )}
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col items-center container my-10">
        {/* UPPER INFOS */}
        <div>
          <div className="lg:columns-2 lg:flex-row flex flex-col items-center lg:gap-10 gap-5">
            <Image
              src={
                user.image
                  ? `http://localhost:4444/${user.image}`
                  : `http://localhost:4444/default-pfp.png`
              }
              radius="full"
              height={180}
              width={180}
              className="object-cover"
            />
            <div>
              <p className=" text-2xl font-bold mb-3 lg:justify-start justify-center flex items-center">
                {user.username}{" "}
                {user.isPremium && (
                  <Icon
                    icon="bi:patch-check-fill"
                    color="#9353D3"
                    className="ms-1"
                  />
                )}
                {user.isPrivate ? <Icon icon="material-symbols:lock" /> : ""}
              </p>
              <div className="flex space-x-5">
                <Card>
                  <CardBody className="pb-0">
                    <p className=" text-2xl font-bold text-center">
                      {userPosts.length}
                    </p>
                  </CardBody>
                  <CardFooter>
                    <p>posts</p>
                  </CardFooter>
                </Card>
                <Card
                  onPress={user.followers.length > 0 ? onOpenFolwer : undefined}
                  isPressable={
                    user.followers.length > 0 &&
                    (isFollowing || !user.isPrivate)
                  }
                  isHoverable={user.followers.length > 0}
                >
                  <CardBody className="pb-0">
                    <p className=" text-2xl font-bold text-center">
                      {user.followers.length}
                    </p>
                  </CardBody>
                  <CardFooter>
                    <p>followers</p>
                  </CardFooter>
                </Card>
                <Card
                  onPress={user.followings.length > 0 ? onOpen : undefined}
                  isPressable={
                    user.followings.length > 0 &&
                    (isFollowing || !user.isPrivate)
                  }
                  isHoverable={user.followings.length > 0}
                >
                  <CardBody className="pb-0">
                    <p className=" text-2xl font-bold text-center">
                      {user.followings.length}
                    </p>
                  </CardBody>
                  <CardFooter>
                    <p>following</p>
                  </CardFooter>
                </Card>
              </div>
              <Button
                key={isFollowing ? "following" : "not-following"}
                color="secondary"
                className="w-full mt-3"
                onPress={handleFollowToggle}
                variant={isFollowing || isRequested ? "ghost" : "solid"}
              >
                {isFollowing
                  ? "Unfollow"
                  : isRequested
                  ? "Requested"
                  : "Follow"}
              </Button>
            </div>
          </div>
          <div className="mt-5">
            {user.fullname && (
              <p className="text-xl font-semibold">{user.fullname}</p>
            )}

            {user.bio && <p className="text-md">{user.bio}</p>}
          </div>
        </div>
        <Divider className="my-10" />
        {/* ALL POSTS */}
        {user.isPrivate && !isFollowing ? (
          <div className="flex flex-col w-full items-center col-span-3 mt-10">
            <div className="border-4 p-6 rounded-full border-default-300">
              <Icon
                icon="mdi:lock"
                width={60}
                height={60}
                className="text-default-500"
              />
            </div>
            <p className="text-2xl font-semibold text-default-500 mt-5">
              Private account
            </p>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center">
            <Tabs aria-label="Dynamic tabs" items={tabs} className="mb-5">
              {(item) => (
                <Tab key={item.id} title={item.label}>
                  {item.content}
                </Tab>
              )}
            </Tabs>
          </div>
        )}
      </div>
      <FollowingModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        userInfo={user}
      />
      <FollowersModal
        isOpen={isOpenFolwer}
        onOpenChange={onOpenChangeFolwer}
        userInfo={user}
      />
    </>
  );
}
