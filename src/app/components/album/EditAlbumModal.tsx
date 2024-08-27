"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Album, Post } from "../users/interface";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Image,
  ModalFooter,
  Button,
  Spinner,
  CheckboxGroup,
  Checkbox,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { createAlbum, updateAlbum } from "@/app/api/albumApi";
import { getUserInfo } from "@/app/api/usersApi";
import { getUserOwnPosts } from "@/app/api/postsApi";
import { useRouter } from "next/navigation";
import ImageSliderAlbum from "./ImageSliderAlbum";

interface EditAlbumModalProps {
  album: Album;
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onUpdateAlbum: (updatedAlbum: Album) => void;
}

export default function EditAlbumModal({
  album,
  isOpen,
  onOpenChange,
  onUpdateAlbum,
}: EditAlbumModalProps) {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [newSelectedPosts, setNewSelectedPosts] = useState<any>([]); /////
  const [name, setName] = useState<string>(album.name);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserInfo();
        if (userData) {
          const posts = await getUserOwnPosts();
          setAllPosts(posts);

          const selectedPostIds = album.posts.map((p) => p.post._id);
          setNewSelectedPosts(selectedPostIds);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user info or posts:", error);
        router.push("/login");
      }
    }

    fetchData();
  }, [router, album.posts]);

  const handleClear = () => {
    setName("");
  };

  const handleSubmit = async () => {
    if (newSelectedPosts.length === 0) {
      toast.warning("Please add at least one post.");
      return;
    }

    if (name.trim() === "") {
      toast.warning("Please provide an album name.");
      return;
    }

    setLoading(true);

    try {
      const updatedAlbum = await updateAlbum({
        id: album._id,
        name,
        posts: newSelectedPosts,
      });

      onUpdateAlbum(updatedAlbum);
      onOpenChange(false);
      toast.success("Album updated successfully!");
    } catch (error) {
      console.error("Failed to update album:", error);
      toast.error("Failed to update the album.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2>Edit Album</h2>
            </ModalHeader>
            <ModalBody>
              <Input
                fullWidth
                label="Name"
                placeholder="Give it a name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isClearable
                onClear={handleClear}
                variant="bordered"
                isRequired
              />

              {allPosts.length > 0 && (
                <div className="mt-5 w-full flex justify-center">
                  <CheckboxGroup
                    value={newSelectedPosts}
                    onChange={setNewSelectedPosts}
                    orientation="horizontal"
                  >
                    {allPosts.map((post) => (
                      <Checkbox key={post._id} value={post._id}>
                        <div className="relative flex justify-center mb-3 w-full ">
                          <ImageSliderAlbum images={post.images} />
                        </div>
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                variant="bordered"
                color="danger"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading} color="primary">
                {loading ? <Spinner size="sm" /> : "Post"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
