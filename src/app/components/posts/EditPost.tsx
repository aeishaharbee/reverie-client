import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Switch,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { updatePost } from "@/app/api/postsApi";
import { Post, User as IUser } from "../users/interface";
import ImageSliderSmall from "./ImageSliderSmall";

interface EditPostModalProps {
  currentUser: IUser;
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePost: (updatedPost: any) => void;
  onDeleteImage: (deletedImage: string) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  currentUser,
  post,
  isOpen,
  onClose,
  onUpdatePost,
  onDeleteImage,
}) => {
  const [caption, setCaption] = useState<string>(post.caption);
  const [images, setImages] = useState(post.images);
  const [isLike, setIsLike] = useState(post.isLike);
  const [isComment, setIsComment] = useState(post.isComment);

  const handleUpdate = async () => {
    try {
      const updatedPost = {
        ...post,
        caption,
        isLike,
        isComment,
        updated_at: new Date(),
      };
      const response = await updatePost({ postId: post._id, updatedPost });

      if (response.post) {
        toast.success("Post updated successfully");
        onUpdatePost(updatedPost);
        onClose();
      } else {
        toast.error("Failed to update the post");
      }
    } catch (error) {
      console.error("Failed to update post:", error);
      toast.error("An error occurred");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Edit Post</ModalHeader>
            <ModalBody>
              {/* IMAGES */}
              <ImageSliderSmall
                images={images}
                postId={post._id}
                onDeleteImage={onDeleteImage}
                isOpen={isOpen}
                setImagesParent={setImages}
              />

              {/* CAPTION */}
              <Textarea
                label="Caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                variant="faded"
              />

              {currentUser?.isPremium && (
                <div className="flex w-full justify-between items-center">
                  <Switch
                    isSelected={isLike}
                    onChange={() => setIsLike(!isLike)}
                    color="secondary"
                    name="isLike"
                  >
                    Show likes count
                  </Switch>
                  <Switch
                    isSelected={isComment}
                    onChange={() => setIsComment(!isComment)}
                    color="secondary"
                    name="isLike"
                  >
                    Allow commenting
                  </Switch>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="secondary" onPress={handleUpdate}>
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditPostModal;
