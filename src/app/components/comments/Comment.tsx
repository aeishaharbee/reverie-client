"use client";
import { Avatar } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { CommentObj, User as IUser } from "@/app/components/users/interface";
import LikeComment from "./LikeComments";
import { useEffect, useState } from "react";
import moment from "moment";

interface CommentProps {
  commentObj: CommentObj;
  currentUser: IUser;
  onDelete: (commentId: string) => void;
}

export default function Comment({
  commentObj,
  currentUser,
  onDelete,
}: CommentProps) {
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setIsLiked(
        commentObj.comment.likes.some(
          (likeObj: any) => likeObj.liker.user._id === currentUser._id
        )
      );
    }
  }, [commentObj.comment.likes, currentUser]);

  const handleDelete = () => {
    onDelete(commentObj.comment._id);
  };

  console.log(commentObj.comment.created_at);

  return (
    <div className="w-full mb-6 flex justify-between">
      <div className="flex gap-2">
        <Avatar
          src={
            commentObj.comment.user.image
              ? `http://localhost:4444/${commentObj.comment.user.image}`
              : `http://localhost:4444/default-pfp.png`
          }
          isBordered
          color={commentObj.comment.user.isPremium ? "secondary" : "default"}
        />
        <div>
          <p className="font-bold">
            {commentObj.comment.user.isPremium ? (
              <div className="flex items-center gap-1 me-1">
                {commentObj.comment.user.username}{" "}
                <Icon icon="bi:patch-check-fill" color="#9353D3" />
              </div>
            ) : (
              commentObj.comment.user.username
            )}
          </p>
          <p>{commentObj.comment.body}</p>
          <p className="text-tiny text-gray-500">
            {moment(commentObj.comment.created_at).fromNow()}
          </p>
        </div>
      </div>
      <div className="flex items-end">
        {currentUser._id === commentObj.comment.user._id && (
          <Icon
            icon="mdi:delete"
            className="text-red-500 cursor-pointer me-2 mb-1"
            onClick={handleDelete}
            width={20}
            height={20}
          />
        )}
        <LikeComment
          initialIsLiked={isLiked}
          commentId={commentObj.comment._id}
          setIsLiked={setIsLiked}
          initialLikesCount={commentObj.comment.likes.length}
        />
      </div>
    </div>
  );
}
