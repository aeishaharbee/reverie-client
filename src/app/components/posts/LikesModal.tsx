import {
  Modal,
  ModalFooter,
  ModalBody,
  ModalContent,
  ModalHeader,
  User,
  Link,
} from "@nextui-org/react";
import { Post } from "../users/interface";
import { Icon } from "@iconify/react/dist/iconify.js";

interface LikersModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  post: Post;
}

export default function LikersModal({
  isOpen,
  onOpenChange,
  post,
}: LikersModalProps) {
  console.log(post);

  console.log(post.likes.map((liker) => liker.liker.user));
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Likes</ModalHeader>
            <ModalBody className="flex flex-col items-start">
              {post.likes.map((liker, index) => (
                <div className="flex w-full justify-between">
                  <User
                    name={
                      liker.liker.user.isPremium ? (
                        <div className="flex items-center gap-1">
                          {liker.liker.user.fullname ||
                            liker.liker.user.username}{" "}
                          <Icon icon="bi:patch-check-fill" color="#9353D3" />
                        </div>
                      ) : (
                        liker.liker.user.username || liker.liker.user.username
                      )
                    }
                    description={
                      <Link
                        href={`/users/${liker.liker.user.username}`}
                        size="sm"
                      >
                        @{liker.liker.user.username}
                      </Link>
                    }
                    avatarProps={{
                      isBordered: true,
                      src: liker.liker.user.image
                        ? `http://localhost:4444/${liker.liker.user.image}`
                        : `http://localhost:4444/default-pfp.png`,
                      color: liker.liker.user.isPremium
                        ? "secondary"
                        : "default",
                    }}
                  />
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
