"use client";
import { deleteEntireAlbum, getAlbumById } from "@/app/api/albumApi";
import { getUserInfo } from "@/app/api/usersApi";
import EditAlbumModal from "@/app/components/album/EditAlbumModal";
import PostItem from "@/app/components/posts/PostItem";
import { Post, User as IUser, Album } from "@/app/components/users/interface";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Spinner, useDisclosure } from "@nextui-org/react";
import { notFound, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

interface AlbumPageProps {
  params: {
    id: string;
  };
}

export default function AlbumPage({ params }: AlbumPageProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [album, setAlbum] = useState<Album | null>(null);
  const [albumPosts, setAlbumPosts] = useState<Post[] | null>(null);
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchAlbumById(id: string) {
      try {
        const userData = await getUserInfo();
        if (userData) {
          setUserInfo(userData);
        } else {
          router.push("/login");
        }

        const album = await getAlbumById(id);
        if (!album) {
          notFound();
        } else {
          setAlbum(album);

          const postsArray = album.posts.map(
            (item: { post: Post }) => item.post
          );
          setAlbumPosts(postsArray);
        }
      } catch (error) {
        console.error("Failed to fetch album:", error);
      }
    }

    fetchAlbumById(params.id);
  }, [params.id]);

  const handleUpdatePost = useCallback((updatedPost: Post) => {
    setAlbumPosts((prevPosts: any) =>
      prevPosts?.map((post: { _id: string }) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  }, []);

  const prevPage = (): void => {
    router.back();
  };

  if (!album || !userInfo || !albumPosts) {
    return (
      <div className="flex justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  const handleDeleteAlbum = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This album will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteEntireAlbum(album._id);
        Swal.fire({
          title: "Deleted!",
          text: "The album has been deleted.",
          icon: "success",
        });
        router.back();
      } catch (error) {
        console.error("Failed to delete album:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to delete the album.",
          icon: "error",
        });
      }
    }
  };

  const handleEditAlbum = async (updatedAlbum: Album) => {
    setAlbum(updatedAlbum);
    const postsArray = updatedAlbum.posts.map(
      (item: { post: Post }) => item.post
    );
    setAlbumPosts(postsArray);
    Swal.fire({
      title: "Updated!",
      text: "The album has been updated.",
      icon: "success",
    });
  };

  return (
    <>
      <div className="w-full flex justify-start fixed z-50 bg-white top-0 border-b-3">
        <div className="w-screen md:w-[80vw] flex sm:justify-center relative py-3 ">
          <div
            className="hidden sm:block absolute hover:bg-default-200 rounded-full px-2 w-fit cursor-pointer top-3 left-3 lg:left-10 z-20"
            onClick={prevPage}
          >
            <Icon icon="lucide:move-left" width={30} height={30} />
          </div>

          <p className="text-lg font-semibold">{album.name}</p>

          {userInfo._id === album.user._id && (
            <div className="flex gap-2 absolute w-fit top-3 right-3 z-20">
              <Button
                size="sm"
                color="warning"
                variant="ghost"
                onPress={onOpen}
              >
                Edit
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="ghost"
                onPress={handleDeleteAlbum}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="pt-14">
        {albumPosts.map((post) => (
          <PostItem
            key={post._id}
            post={post}
            currentUser={userInfo}
            onUpdatePost={handleUpdatePost}
          />
        ))}
      </div>

      <EditAlbumModal
        album={album}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onUpdateAlbum={handleEditAlbum}
      />

      <ToastContainer position="bottom-right" />
    </>
  );
}
