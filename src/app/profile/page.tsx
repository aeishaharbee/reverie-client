"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "../api/usersApi";
import { getUserOwnPosts } from "../api/postsApi";
import {
  Image,
  Button,
  Card,
  CardFooter,
  CardBody,
  Spinner,
  Divider,
  Tabs,
  Tab,
  useDisclosure,
  Link,
} from "@nextui-org/react";
import { User, Post, Album } from "../components/users/interface";
import { Icon } from "@iconify/react/dist/iconify.js";
import FollowingModal from "../components/users/FollowingModal";
import FollowersModal from "../components/users/FollowersModal";
import EditProfileModal from "../components/users/EditProfileModal";
import EditPfpModal from "../components/users/EditPfpModal";
import { userSavedPosts } from "../api/saveApi";
import LogoutButton from "../components/users/LogoutButton";
import PostItemSmall from "../components/posts/PostItemSmall";
import AddPostModal from "../components/posts/AddPostModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRModal from "../components/premium/QRModal";
import { getUserAlbums } from "../api/albumApi";
import AlbumItem from "../components/album/AlbumItem";
import AddAlbumModal from "../components/album/AddAlbumModal";

export default function ProfilePage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  console.log("useDisclosure 1:", { isOpen, onOpen, onOpenChange });

  const {
    isOpen: isOpenFolwer,
    onOpen: onOpenFolwer,
    onOpenChange: onOpenChangeFolwer,
  } = useDisclosure();
  console.log("useDisclosure 2:", {
    isOpenFolwer,
    onOpenFolwer,
    onOpenChangeFolwer,
  });

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onOpenChange: onOpenChangeEdit,
  } = useDisclosure();
  console.log("useDisclosure 3:", { isOpenEdit, onOpenEdit, onOpenChangeEdit });

  const {
    isOpen: isOpenPfp,
    onOpen: onOpenPfp,
    onOpenChange: onOpenChangePfp,
  } = useDisclosure();
  console.log("useDisclosure 4:", { isOpenPfp, onOpenPfp, onOpenChangePfp });

  const {
    isOpen: isOpenPostModal,
    onOpen: onOpenPostModal,
    onOpenChange: onOpenChangePostModal,
  } = useDisclosure();
  console.log("useDisclosure 5:", {
    isOpenPostModal,
    onOpenPostModal,
    onOpenChangePostModal,
  });

  const {
    isOpen: isOpenQR,
    onOpen: onOpenQR,
    onOpenChange: onOpenChangeQR,
  } = useDisclosure();
  console.log("useDisclosure 6:", { isOpenQR, onOpenQR, onOpenChangeQR });

  const {
    isOpen: isOpenAlbumModal,
    onOpen: onOpenAlbumModal,
    onOpenChange: onOpenChangeAlbumModal,
  } = useDisclosure();
  console.log("useDisclosure 7:", {
    isOpenAlbumModal,
    onOpenAlbumModal,
    onOpenChangeAlbumModal,
  });

  const [userPosts, setUserPosts] = useState<Post[] | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [savedPosts, setSavedPosts] = useState<Post[] | null>(null);
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserInfo();
        if (userData) {
          setUserInfo(userData);

          const posts = await getUserOwnPosts();
          setUserPosts(posts);

          const savedData = await userSavedPosts();
          console.log(savedData);
          if (savedData.data.saveExist === null) {
            setSavedPosts(null);
          } else {
            const sortedSavedPosts = savedData.data.saveExist.posts
              .map((save: { post: Post }) => save.post)
              .reverse();

            setSavedPosts(sortedSavedPosts);
          }

          const albums = await getUserAlbums(userData._id);
          setAlbums(albums.albums);
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

  const handleUserInfoUpdate = async () => {
    try {
      const updatedUserInfo = await getUserInfo();
      setUserInfo(updatedUserInfo);
    } catch (error) {
      console.error("Failed to update user info:", error);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setUserPosts((prevPosts) => {
      return prevPosts ? [newPost, ...prevPosts] : [newPost];
    });
  };

  const handleAlbumCreated = (newAlbum: Album) => {
    setAlbums((prevAlbums) => {
      return prevAlbums ? [newAlbum, ...prevAlbums] : [newAlbum];
    });
  };

  if (!userInfo || !userPosts || !albums) {
    return (
      <div className="flex justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  console.log(albums);

  let tabs = [
    {
      id: "posts",
      label: "Posts",
      content: (
        <>
          <Button
            className="lg:absolute mb-3 lg:mb-0 left-0 top-0"
            startContent={<Icon icon="lucide:plus" />}
            color="secondary"
            variant="bordered"
            onPress={onOpenPostModal}
          >
            Add New Post
          </Button>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 w-full">
            {userPosts.length ? (
              userPosts.map((post) => (
                <PostItemSmall
                  key={post._id}
                  post={post}
                  route="/profile/posts"
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
          <Button
            className="lg:absolute mb-3 lg:mb-0 left-0 top-0"
            startContent={<Icon icon="lucide:plus" />}
            color="secondary"
            variant="bordered"
            onPress={onOpenAlbumModal}
          >
            Add New Album
          </Button>
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
    {
      id: "saved",
      label: "Saved",
      content: (
        <>
          {savedPosts === null ? (
            <div className="flex flex-col w-full items-center gap-3">
              <div className="border-4 p-6 rounded-full border-default-300">
                <Icon
                  icon="bi:bookmark-x"
                  width={60}
                  height={60}
                  className="text-default-500"
                />
              </div>
              <p className="text-2xl font-semibold text-default-500 mt-5">
                No saved post
              </p>
            </div>
          ) : savedPosts.length > 0 ? (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 w-full">
              {savedPosts.map((post) => (
                <PostItemSmall
                  key={post._id}
                  post={post}
                  route="/profile/saved"
                />
              ))}
            </div>
          ) : (
            <p>No saved posts yet.</p>
          )}
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
                userInfo.image
                  ? `http://localhost:4444/${userInfo.image}`
                  : `http://localhost:4444/default-pfp.png`
              }
              radius="full"
              height={180}
              width={180}
              className="object-cover"
              isZoomed
              style={{ cursor: "pointer" }}
              onClick={onOpenPfp}
            />
            <div>
              <div className=" text-2xl font-bold mb-3 lg:justify-start  justify-center flex items-center relative">
                <div className="flex items-center">
                  {userInfo.username}{" "}
                  {userInfo.isPremium ? (
                    <Icon
                      icon="bi:patch-check-fill"
                      color="#9353D3"
                      className="ms-1"
                    />
                  ) : (
                    ""
                  )}
                  {userInfo.isPrivate ? (
                    <Icon icon="material-symbols:lock" />
                  ) : (
                    ""
                  )}
                </div>
                {userInfo.isPremium ? (
                  <div className="flex items-center absolute end-0">
                    <Icon
                      icon="pepicons-print:qr-code-circle"
                      color="#20b1ae"
                      width={30}
                      height={30}
                      onClick={onOpenQR}
                      style={{ cursor: "pointer" }}
                      className="hover:bg-default-200 rounded-full"
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
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
                  onPress={
                    userInfo.followers.length > 0 ? onOpenFolwer : undefined
                  }
                  isPressable={userInfo.followers.length > 0}
                  isHoverable={userInfo.followers.length > 0}
                >
                  <CardBody className="pb-0">
                    <p className=" text-2xl font-bold text-center">
                      {userInfo.followers.length}
                    </p>
                  </CardBody>
                  <CardFooter>
                    <p>followers</p>
                  </CardFooter>
                </Card>
                <Card
                  onPress={userInfo.followings.length > 0 ? onOpen : undefined}
                  isPressable={userInfo.followings.length > 0}
                  isHoverable={userInfo.followings.length > 0}
                >
                  <CardBody className="pb-0">
                    <p className=" text-2xl font-bold text-center">
                      {userInfo.followings.length}
                    </p>
                  </CardBody>
                  <CardFooter>
                    <p>following</p>
                  </CardFooter>
                </Card>
              </div>
              <div className="flex items-center  mt-3 gap-2">
                <Button
                  color="secondary"
                  variant="ghost"
                  className="w-full"
                  onPress={onOpenEdit}
                >
                  Edit Profile
                </Button>
                <LogoutButton />
              </div>
            </div>
          </div>
          <div className="mt-5">
            <p className="text-xl font-semibold">{userInfo.fullname}</p>
            <p className="text-md">{userInfo.bio}</p>
          </div>
        </div>
        <Divider className="my-10" />
        {/* ALL POSTS */}
        <div className="flex w-full flex-col items-center relative">
          <Tabs aria-label="Dynamic tabs" items={tabs} className="mb-5">
            {(item) => (
              <Tab key={item.id} title={item.label} className="w-full">
                {item.content}
              </Tab>
            )}
          </Tabs>
        </div>
      </div>

      <FollowingModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUserInfoUpdate={handleUserInfoUpdate}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
      <FollowersModal
        isOpen={isOpenFolwer}
        onOpenChange={onOpenChangeFolwer}
        onUserInfoUpdate={handleUserInfoUpdate}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
      <EditProfileModal
        isOpen={isOpenEdit}
        onOpenChange={onOpenChangeEdit}
        onUserInfoUpdate={handleUserInfoUpdate}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
      <EditPfpModal
        isOpen={isOpenPfp}
        onOpenChange={onOpenChangePfp}
        onUserInfoUpdate={handleUserInfoUpdate}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
      <AddPostModal
        isOpen={isOpenPostModal}
        onOpenChange={onOpenChangePostModal}
        onPostCreated={handlePostCreated}
        isPremium={userInfo.isPremium}
      />
      <AddAlbumModal
        isOpen={isOpenAlbumModal}
        onOpenChange={onOpenChangeAlbumModal}
        onAlbumCreated={handleAlbumCreated}
        userPosts={userPosts}
      />
      <QRModal
        isOpen={isOpenQR}
        onOpenChange={onOpenChangeQR}
        userInfo={userInfo}
      />
      <ToastContainer position="bottom-right" />
    </>
  );
}
