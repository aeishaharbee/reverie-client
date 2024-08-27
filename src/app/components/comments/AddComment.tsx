// AddComment.tsx
"use client";
import React, { useState } from "react";
import { Input, Button, Avatar } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { addComment } from "@/app/api/commentsApi";
import {
  CommentObj,
  User as IUser,
  Post,
} from "@/app/components/users/interface";

interface AddCommentProps {
  post: Post;
  currentUser: IUser;
  onAddComment: (newComment: CommentObj) => void;
}

export interface newComment {
  body: string;
}

export default function AddComment({
  post,
  currentUser,
  onAddComment,
}: AddCommentProps) {
  const [newComment, setnewComment] = useState<newComment>({ body: "" });

  const { mutate } = useMutation({
    mutationFn: addComment,
  });

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setnewComment({ ...newComment, [e.target.name]: e.target.value });

  const onSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (newComment.body) {
      mutate(
        { comment: newComment, id: post._id },
        {
          onSuccess: (data: any) => {
            toast.success("Comment added successfully!");
            console.log(data);
            const newCommentObj: CommentObj = {
              comment: {
                _id: data.comment._id,
                body: newComment.body,
                user: currentUser,
                likes: [],
                created_at: new Date(),
              },
              post: post._id,
            };

            onAddComment(newCommentObj);
            setnewComment({ body: "" });
          },
          onError: (error: any) => {
            toast.error(error.message);
          },
        }
      );
    } else {
      toast.warning("Comment is required.");
    }
  };

  return (
    <div className="flex items-center">
      <Avatar
        src={
          currentUser.image
            ? `http://localhost:4444/${currentUser.image}`
            : `http://localhost:4444/default-pfp.png`
        }
        size="md"
        className="flex-none w-10 h-10"
        isBordered
        color={currentUser.isPremium ? "secondary" : "default"}
      />
      <form
        className="flex w-full justify-between items-center"
        onSubmit={onSubmitHandler}
      >
        <Input
          type="text"
          variant="bordered"
          label="Add Comment..."
          className="mx-2"
          isClearable
          size="sm"
          onChange={onChangeHandler}
          value={newComment.body}
          name="body"
          isDisabled={!post?.isComment}
        />
        <Button
          size="sm"
          color="primary"
          variant="bordered"
          type="submit"
          isDisabled={!post?.isComment}
        >
          Post
        </Button>
      </form>
    </div>
  );
}
