"use client";

import { Dispatch, SetStateAction, useState } from "react";
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
import { createAlbum } from "@/app/api/albumApi";
import ImageSliderAlbum from "./ImageSliderAlbum";

interface AddAlbumModalProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onAlbumCreated: (newAlbum: Album) => void;
  userPosts: Post[];
}

export default function AddAlbumModal({
  isOpen,
  onOpenChange,
  onAlbumCreated,
  userPosts,
}: AddAlbumModalProps) {
  const [posts, setPosts] = useState<any>([]);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleClear = () => {
    setName("");
  };

  const handleSubmit = async () => {
    if (posts.length === 0) {
      toast.warning("Please add at least one post.");
      return;
    }
    if (name == "") {
      toast.warning("Please put a name");
      return;
    }
    setLoading(true);

    try {
      const newAlbum = await createAlbum({ name, posts: posts });
      onAlbumCreated(newAlbum);
      onOpenChange(false);
      toast.success("Added new album");

      setPosts([]);
      setName("");

      console.log({ name, postIds: posts });
    } catch (error) {
      console.error("Failed to create post:", error);
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
              <h2>Create New Album</h2>
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

              {userPosts.length > 0 && (
                <div className="mt-5 w-full flex justify-center">
                  <CheckboxGroup
                    // label="Select posts"
                    value={posts}
                    onChange={setPosts}
                    orientation="horizontal"
                  >
                    {userPosts.map((post, index) => (
                      <Checkbox key={post._id} value={post._id}>
                        <div className="relative flex justify-center mb-3 w-full">
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
