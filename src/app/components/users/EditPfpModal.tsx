"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Image,
} from "@nextui-org/react";
import { useState } from "react";
import { User as IUser } from "./interface";
import { editUserProfile, removePfp } from "@/app/api/usersApi";
import { toast } from "react-toastify";

interface EditPfpModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  userInfo: IUser;
  setUserInfo: React.Dispatch<React.SetStateAction<IUser | null>>;
  onUserInfoUpdate: () => void;
}

export default function EditPfpModal({
  isOpen,
  onOpenChange,
  userInfo,
  onUserInfoUpdate,
}: EditPfpModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];

      const fileType = selectedFile.type;
      const validTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!validTypes.includes(fileType)) {
        toast.error("Please upload a valid image file (JPG, PNG or WEBP).");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpdateProfilePicture = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (file) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("image", file);

        await editUserProfile(formData);
        onUserInfoUpdate();
        onOpenChange();

        window.location.href = "http://localhost:3000/profile";
      } catch (error) {
        console.error("Error updating profile picture:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemovePicture = async () => {
    try {
      await removePfp();
      onUserInfoUpdate();
      onOpenChange();
      window.location.href = "http://localhost:3000/profile";
    } catch (error) {
      console.error("Error removing profile picture:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Your Profile Picture
            </ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col items-center gap-4"
                onSubmit={handleUpdateProfilePicture}
              >
                <Image
                  src={
                    userInfo.image
                      ? `http://localhost:4444/${userInfo.image}`
                      : `http://localhost:4444/default-pfp.png`
                  }
                  radius="full"
                  height={100}
                  width={100}
                  className="object-cover"
                />
                <input
                  className="block w-full text-sm border border-gray-300 rounded-lg cursor-pointer focus:outline-none "
                  name="image"
                  type="file"
                  onChange={handleFileChange}
                />
                <div
                  className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                  id="user_avatar_help"
                >
                  A profile picture is useful to let people know it's you.
                </div>

                <div className="flex flex-col w-full md:flex-nowrap justify-center max-w-sm mb-5">
                  <Button
                    color="secondary"
                    variant="solid"
                    type="submit"
                    fullWidth
                    disabled={loading}
                    className="mb-3"
                  >
                    {loading ? "Updating..." : "Update"}
                  </Button>
                  {userInfo.image && (
                    <Button
                      color="danger"
                      variant="ghost"
                      type="button"
                      fullWidth
                      onClick={handleRemovePicture}
                    >
                      Remove Picture
                    </Button>
                  )}
                </div>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
