import {
  Button,
  Modal,
  ModalFooter,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  User,
  Link,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { User as IUser } from "./interface";
import {
  followUnfol,
  getUserByUsername,
  getUserInfo,
} from "@/app/api/usersApi";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface FollowingModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  userInfo: IUser;
  setUserInfo?: React.Dispatch<React.SetStateAction<IUser | null>>;
  onUserInfoUpdate?: () => void;
}

export default function FollowingModal({
  isOpen,
  onOpenChange,
  userInfo,
  setUserInfo,
  onUserInfoUpdate,
}: FollowingModalProps) {
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
  }, [router]);

  if (!currentUser || !newUserInfo) {
    return (
      <div className="hidden justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  const unfollowHandler = async (
    id: string,
    isPrivate: boolean,
    username: string
  ) => {
    const result = await Swal.fire({
      title: `Unfollow @${username}?`,
      text: isPrivate
        ? "You are about to unfollow a private account. You won't be able to follow them back unless they approve your request."
        : "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, unfollow!",
    });

    if (result.isConfirmed) {
      try {
        await followUnfol(id);

        if (setnewUserInfo && onUserInfoUpdate) {
          setnewUserInfo((prevUserInfo) => {
            if (!prevUserInfo) return null;
            const updatedFollowings = prevUserInfo.followings.filter(
              (following) => following.following._id !== id
            );
            return { ...prevUserInfo, followings: updatedFollowings };
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
              Following List
            </ModalHeader>
            <ModalBody className="flex flex-col items-start">
              {newUserInfo.followings.map((following, index) => (
                <div className="flex w-full justify-between" key={index}>
                  <User
                    name={
                      following.following.isPremium ? (
                        <div className="flex items-center gap-1">
                          {following.following.fullname ||
                            following.following.username}{" "}
                          <Icon icon="bi:patch-check-fill" color="#9353D3" />
                        </div>
                      ) : (
                        following.following.username ||
                        following.following.username
                      )
                    }
                    description={
                      <Link
                        href={`/users/${following.following.username}`}
                        size="sm"
                      >
                        @{following.following.username}
                      </Link>
                    }
                    avatarProps={{
                      isBordered: true,
                      src: following.following.image
                        ? `http://localhost:4444/${following.following.image}`
                        : `http://localhost:4444/default-pfp.png`,
                      color: following.following.isPremium
                        ? "secondary"
                        : "default",
                    }}
                  />
                  {currentUser._id === newUserInfo._id && (
                    <Button
                      color="warning"
                      variant="ghost"
                      onPress={() =>
                        unfollowHandler(
                          following.following._id,
                          following.following.isPrivate,
                          following.following.username
                        )
                      }
                    >
                      Unfollow
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
