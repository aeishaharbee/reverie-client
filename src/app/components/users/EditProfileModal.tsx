import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Input,
  Switch,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User as IUser } from "./interface";
import { editUserProfile } from "@/app/api/usersApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface EditProfileModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  userInfo: IUser;
  setUserInfo: React.Dispatch<React.SetStateAction<IUser | null>>;
  onUserInfoUpdate: () => void;
}

export default function EditProfileModal({
  isOpen,
  onOpenChange,
  userInfo,
  setUserInfo,
  onUserInfoUpdate,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    username: userInfo.username,
    fullname: userInfo.fullname,
    email: userInfo.email,
    bio: userInfo.bio,
    isPrivate: userInfo.isPrivate,
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const { username, fullname, email, bio, isPrivate } = formData;
      const data = new FormData();
      data.append("username", username);
      data.append("fullname", fullname);
      data.append("email", email);
      data.append("bio", bio);
      data.append("isPrivate", isPrivate ? "true" : "false");

      await editUserProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Invalidate and refetch user info
      onUserInfoUpdate();
      onOpenChange();
      toast.success("User profile updated successfully.");
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, isPrivate: e.target.checked ? true : false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (!userInfo) {
    return (
      <div className="flex justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Edit Your Profile</ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col items-center gap-4"
                  onSubmit={handleSubmit}
                >
                  <Input
                    isRequired
                    type="text"
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    variant="faded"
                  />
                  <Input
                    isRequired
                    type="text"
                    label="Name"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    variant="faded"
                  />
                  <Input
                    isRequired
                    type="email"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    variant="faded"
                  />
                  <Input
                    type="text"
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    variant="faded"
                  />
                  <Switch
                    isSelected={formData.isPrivate}
                    onChange={handleSwitchChange}
                    color="secondary"
                    name="isPrivate"
                  >
                    Private Profile
                  </Switch>
                  <Button
                    color="secondary"
                    variant="shadow"
                    type="submit"
                    fullWidth
                    className="mb-3"
                  >
                    Update
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
