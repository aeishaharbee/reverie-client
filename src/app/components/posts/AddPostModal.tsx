"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  Modal,
  Button,
  Input,
  Image,
  Spinner,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalContent,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Post } from "../users/interface";
import { uploadMultiple } from "@/app/api/uploadMultiple";
import { toast } from "react-toastify";

interface AddPostModalProps {
  isPremium: boolean;
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onPostCreated: (newPost: Post) => void;
}

export default function AddPostModal({
  isPremium,
  isOpen,
  onOpenChange,
  onPostCreated,
}: AddPostModalProps) {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleClear = () => {
    setCaption("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10 && !isPremium) {
      toast.warning("You can upload a maximum of 10 images.");
      return;
    }

    if (files.length + images.length > 20) {
      toast.warning("You can upload a maximum of 20 images.");
      return;
    }

    setImages([...images, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleRemoveAllImages = () => {
    setImages([]);
  };

  const moveImageUp = (index: number) => {
    if (index > 0) {
      const newImages = [...images];
      [newImages[index - 1], newImages[index]] = [
        newImages[index],
        newImages[index - 1],
      ];
      setImages(newImages);
    }
  };

  const moveImageDown = (index: number) => {
    if (index < images.length - 1) {
      const newImages = [...images];
      [newImages[index + 1], newImages[index]] = [
        newImages[index],
        newImages[index + 1],
      ];
      setImages(newImages);
    }
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      toast.warning("Please add at least one image.");
      return;
    }
    setLoading(true);

    try {
      const newPost = await uploadMultiple({ caption, images });
      onPostCreated(newPost);
      onOpenChange(false);

      toast.success("Added new post");
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
              <h2>Create New Post</h2>
            </ModalHeader>
            <ModalBody>
              <Input
                fullWidth
                label="Caption"
                placeholder="What's on your mind?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                isClearable
                onClear={handleClear}
                variant="bordered"
              />
              <label
                htmlFor="file-input"
                className="block w-full px-4 py-2 mt-5 text-center text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600"
              >
                Choose Images
              </label>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden w-full border border-gray-300 rounded-md cursor-pointer focus:outline-none mt-5"
              />
              {images.length > 0 && (
                <div className="mt-5">
                  {images.map((image, index) => (
                    <div key={index}>
                      <div className="relative flex justify-center mb-3 ">
                        <Image
                          src={URL.createObjectURL(image)}
                          width={200}
                          height={200}
                          className="object-cover"
                        />
                        <div className="absolute top-0 left-0 flex flex-col space-y-2">
                          {index > 0 && (
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              onClick={() => moveImageUp(index)}
                            >
                              <Icon icon="bi:arrow-up" />
                            </Button>
                          )}
                          {index < images.length - 1 && (
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              onClick={() => moveImageDown(index)}
                            >
                              <Icon icon="bi:arrow-down" />
                            </Button>
                          )}
                        </div>
                        <Button
                          color="warning"
                          variant="flat"
                          startContent={<Icon icon="mdi:close" />}
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-0 right-0"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center mt-5">
                    <Button
                      color="danger"
                      variant="ghost"
                      onClick={handleRemoveAllImages}
                    >
                      Remove All Images
                    </Button>
                  </div>
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
