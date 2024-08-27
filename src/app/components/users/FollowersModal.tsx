import {
  Button,
  Modal,
  ModalFooter,
  ModalBody,
  ModalContent,
  ModalHeader,
  User,
  Link,
  Spinner,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { User as IUser } from "./interface";
import { getUserByUsername, getUserInfo, removeFoll } from "@/app/api/usersApi";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react/dist/iconify.js";

interface FollowersModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  userInfo: IUser;
  setUserInfo?: React.Dispatch<React.SetStateAction<IUser | null>>;
  onUserInfoUpdate?: () => void;
}

export default function FollowersModal({
  isOpen,
  onOpenChange,
  userInfo,
  setUserInfo,
  onUserInfoUpdate,
}: FollowersModalProps) {
  //
  //
  //
  const router = useRouter();

  const [currentUser, setcurrentUser] = useState<IUser | null>(null);
  const [newUserInfo, setnewUserInfo] = useState<IUser | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const userInfoData = await getUserByUsername(userInfo.username);
        const userData = await getUserInfo();
        if (userData && userInfoData) {
          setnewUserInfo(userInfoData);
          setcurrentUser(userData);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        router.push("/login");
      }
    }

    fetchData();
  }, [isOpen, router, userInfo.username]);

  if (!currentUser || !newUserInfo) {
    return (
      <div className="justify-center w-full h-full items-center hidden">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  const removeFollower = async (
    id: string,
    isPrivate: boolean,
    user: string
  ) => {
    const result = await Swal.fire({
      title: `Remove @${user}?`,
      text: isPrivate
        ? "Since your account is private, they won't be able to follow you back unless you approve their request."
        : ``,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove!",
    });

    if (result.isConfirmed) {
      try {
        await removeFoll(id);

        if (setnewUserInfo && onUserInfoUpdate) {
          setnewUserInfo((prevUserInfo) => {
            if (!prevUserInfo) return null;
            const updatedFollowers = prevUserInfo.followers.filter(
              (follower) => follower.follower._id !== id
            );
            return { ...prevUserInfo, followers: updatedFollowers };
          });
          onUserInfoUpdate();
        }
      } catch (error) {
        Swal.fire("Error!", "Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Followers List
            </ModalHeader>
            <ModalBody className="flex flex-col items-start">
              {newUserInfo.followers.map((follower, index) => (
                <div className="flex w-full justify-between">
                  <User
                    name={
                      follower.follower.isPremium ? (
                        <div className="flex items-center gap-1">
                          {follower.follower.fullname ||
                            follower.follower.username}{" "}
                          <Icon icon="bi:patch-check-fill" color="#9353D3" />
                        </div>
                      ) : (
                        follower.follower.username || follower.follower.username
                      )
                    }
                    description={
                      <Link
                        href={`/users/${follower.follower.username}`}
                        size="sm"
                      >
                        @{follower.follower.username}
                      </Link>
                    }
                    avatarProps={{
                      isBordered: true,
                      src: follower.follower.image
                        ? `http://localhost:4444/${follower.follower.image}`
                        : `http://localhost:4444/default-pfp.png`,
                      color: follower.follower.isPremium
                        ? "secondary"
                        : "default",
                    }}
                  />
                  {currentUser._id === newUserInfo._id && (
                    <Button
                      color="danger"
                      onPress={() =>
                        removeFollower(
                          follower.follower._id,
                          newUserInfo.isPrivate,
                          follower.follower.username
                        )
                      }
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
