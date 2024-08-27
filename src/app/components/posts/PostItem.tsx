import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Link,
  ScrollShadow,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { CommentObj, LikeObj, Post, User as IUser } from "../users/interface";
import moment from "moment";
import ImageSlider from "./ImageSlider";
import AddComment from "../comments/AddComment";
import Comment from "../comments/Comment";
import LikeButton from "./LikeButton";
import SaveButton from "./SaveButton";
import { useEffect, useState } from "react";
import { deleteComment } from "@/app/api/commentsApi";
import { toast } from "react-toastify";
import { getPostInsideSave } from "@/app/api/saveApi";
import FavouriteButton from "./FavouriteButton";
import FollowButton from "./FollowButton";
import Swal from "sweetalert2";
import { deleteEntirePost } from "@/app/api/postsApi";
import { useRouter } from "next/navigation";
import EditPostModal from "./EditPost";
import CopyLink from "./CopyLinkButton";
import LikersModal from "./LikesModal";

interface PostItemProps {
  post: Post;
  currentUser: IUser;
  onUpdatePost: (updatedPost: Post) => void;
}

export default function PostItem({
  post,
  currentUser,
  onUpdatePost,
}: PostItemProps) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenLike,
    onOpen: onOpenLike,
    onOpenChange: onOpenChangeLike,
  } = useDisclosure();
  const [isFollow, setIsFollow] = useState(
    currentUser.followings.some(
      (following: { following: any }) =>
        following.following._id.toString() === post.user._id.toString()
    )
  );
  const [isFavourite, setisFavourite] = useState(
    currentUser.favourites.some(
      (favourite: { favourite: any }) =>
        favourite.favourite._id.toString() === post.user._id.toString()
    )
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(
    post.likes.some((like: LikeObj) => like.liker.user._id === currentUser._id)
  );
  const [likesCount, setLikesCount] = useState(post.likes.length);

  const handleAddComment = (newComment: CommentObj) => {
    const updatedPost = {
      ...post,
      comments: [...post.comments, newComment],
    };
    onUpdatePost(updatedPost);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await deleteComment({ postId: post._id, commentId });

      if (response === 200) {
        const updatedPost = {
          ...post,
          comments: post.comments.filter(
            (comment: CommentObj) => comment.comment._id !== commentId
          ),
        };
        onUpdatePost(updatedPost);
        toast.success("Comment deleted successfully");
      } else {
        toast.error("Failed to delete the comment");
      }
    } catch (error) {
      console.error("An error occurred while deleting the comment:", error);
      toast.error("An error occurred");
    }
  };

  const handleDeleteImage = (deletedImage: string) => {
    const updatedPost = {
      ...post,
      images: post.images.filter(
        (image: { image: string }) => image.image !== deletedImage
      ),
    };

    onUpdatePost(updatedPost);
  };

  const handleDeletePost = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This post will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteEntirePost(post._id);
        Swal.fire({
          title: "Deleted!",
          text: "The post has been deleted.",
          icon: "success",
        });
        router.push("/profile");
      } catch (error) {
        console.error("Failed to delete post:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to delete the post.",
          icon: "error",
        });
      }
    }
  };

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const save = await getPostInsideSave(post._id);
        console.log(save);
        if (save.saveExist != null) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      } catch (error) {
        console.error("Failed to check save status:", error);
        setIsSaved(false);
      }
    };

    checkIfSaved();
  }, [post._id]);

  console.log({ value: currentUser._id === post?.user._id });

  return (
    <>
      <div className="container mb-9 relative pt-5 md:pt-0">
        <div className="xl:columns-2 xl:flex-row flex flex-col items-center lg:gap-10 gap-5">
          {/* IMAGES */}
          <div className="w-full flex justify-center">
            <ImageSlider images={post?.images} />
          </div>

          {/* COMMENTS / LIKES / OTHERS */}
          <Card className="w-full">
            <CardHeader className="flex gap-3 justify-between">
              <User
                name={
                  post?.user.isPremium ? (
                    <div className="flex items-center gap-1">
                      {post.user.fullname || post.user.username}{" "}
                      <Icon icon="bi:patch-check-fill" color="#9353D3" />
                    </div>
                  ) : (
                    post?.user.username || post.user.username
                  )
                }
                description={
                  <Link href={`/users/${post?.user.username}`} size="sm">
                    @{post?.user.username}
                  </Link>
                }
                avatarProps={{
                  isBordered: true,
                  src: post?.user.image
                    ? `http://localhost:4444/${post?.user.image}`
                    : `http://localhost:4444/default-pfp.png`,
                  color: post?.user.isPremium ? "secondary" : "default",
                }}
              />
              <div className="flex sm:flex-row flex-col items-center gap-3">
                {currentUser._id === post.user._id ? (
                  <>
                    <Button
                      color="warning"
                      variant="ghost"
                      size="sm"
                      onPress={onOpen}
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      variant="ghost"
                      size="sm"
                      onPress={handleDeletePost}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <FavouriteButton
                      post={post}
                      currentUser={currentUser}
                      initialIsFav={isFavourite}
                      setIsFav={setisFavourite}
                      setPost={onUpdatePost}
                    />
                    <FollowButton
                      post={post}
                      currentUser={currentUser}
                      initialIsFollow={isFollow}
                      setIsFollow={setIsFollow}
                      setPost={onUpdatePost}
                      setIsFav={setisFavourite}
                    />
                  </>
                )}
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <ScrollShadow hideScrollBar className="w-full h-[450px]">
                {/* COMMENTS */}
                <div className="p-5">
                  {post?.comments.length > 0 ? (
                    post?.comments.map((commentObj: CommentObj) => (
                      <Comment
                        key={commentObj.comment._id}
                        commentObj={commentObj}
                        currentUser={currentUser}
                        onDelete={handleDeleteComment}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No comments yet</p>
                  )}
                </div>
              </ScrollShadow>

              <AddComment
                post={post}
                currentUser={currentUser}
                onAddComment={handleAddComment}
              />
            </CardBody>
            <Divider />
            <CardFooter className="flex flex-col items-start gap-4">
              <div className="flex justify-between w-full">
                <div className="flex gap-3">
                  <LikeButton
                    postId={post?._id}
                    initialIsLiked={isLiked}
                    initialLikesCount={likesCount}
                    setIsLiked={setIsLiked}
                    setLikesCount={setLikesCount}
                    setPost={onUpdatePost}
                  />
                  <Icon icon="bi:chat" width={28} height={28} />
                  <CopyLink postId={post?._id} />
                </div>
                <SaveButton
                  postId={post?._id}
                  setPost={onUpdatePost}
                  initialIsSaved={isSaved}
                  setIsSaved={setIsSaved}
                />
              </div>
              <div className="w-full">
                {(post?.isLike || currentUser._id === post?.user._id) &&
                  (likesCount ? (
                    likesCount === 1 ? (
                      <div
                        className="flex sm:flex-row flex-col gap-3 mb-2 cursor-pointer"
                        onClick={onOpenLike}
                      >
                        <Avatar
                          src={
                            post?.likes[0]?.liker?.user?.image
                              ? `http://localhost:4444/${post.likes[0].liker.user.image}`
                              : `http://localhost:4444/default-pfp.png`
                          }
                          size="sm"
                          isBordered
                        />
                        <p className="flex items-center gap-1">
                          Liked by{" "}
                          <span className="font-semibold">
                            {post?.likes[0]?.liker?.user?.isPremium ? (
                              <div className="flex items-center gap-1 me-1">
                                {post?.likes[0]?.liker?.user?.username}{" "}
                                <Icon
                                  icon="bi:patch-check-fill"
                                  color="#9353D3"
                                />
                              </div>
                            ) : (
                              post?.likes[0]?.liker?.user?.username
                            )}
                          </span>
                        </p>
                      </div>
                    ) : likesCount === 2 ? (
                      <div
                        className="flex sm:flex-row flex-col gap-3 mb-2 cursor-pointer"
                        onClick={onOpenLike}
                      >
                        <AvatarGroup isBordered size="sm">
                          {post?.likes.map((likeObj: LikeObj) => {
                            const liker = likeObj.liker;
                            return (
                              <Avatar
                                key={liker.user._id}
                                src={
                                  liker.user.image
                                    ? `http://localhost:4444/${liker.user.image}`
                                    : `http://localhost:4444/default-pfp.png`
                                }
                              />
                            );
                          })}
                        </AvatarGroup>
                        <p className="flex items-center gap-1">
                          Liked by{" "}
                          <span className="font-semibold flex">
                            {post?.likes[0]?.liker?.user?.isPremium ? (
                              <div className="flex items-center gap-1 me-1">
                                {post?.likes[0]?.liker?.user?.username}{" "}
                                <Icon
                                  icon="bi:patch-check-fill"
                                  color="#9353D3"
                                />
                              </div>
                            ) : (
                              post?.likes[0]?.liker?.user?.username
                            )}{" "}
                            and{" "}
                            {post?.likes[1]?.liker?.user?.isPremium ? (
                              <div className="flex items-center gap-1 ms-1">
                                {post?.likes[1]?.liker?.user?.username}{" "}
                                <Icon
                                  icon="bi:patch-check-fill"
                                  color="#9353D3"
                                />
                              </div>
                            ) : (
                              post?.likes[1]?.liker?.user?.username
                            )}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div
                        className="flex sm:flex-row flex-col gap-3 mb-2 cursor-pointer"
                        onClick={onOpenLike}
                      >
                        <AvatarGroup isBordered size="sm" max={2}>
                          {post?.likes.map((likeObj: LikeObj) => {
                            const liker = likeObj.liker;
                            return (
                              <Avatar
                                key={liker.user._id}
                                src={
                                  liker.user.image
                                    ? `http://localhost:4444/${liker.user.image}`
                                    : `http://localhost:4444/default-pfp.png`
                                }
                              />
                            );
                          })}
                        </AvatarGroup>
                        <p className="flex items-center gap-1">
                          Liked by{" "}
                          <span className="font-semibold flex">
                            {post?.likes[0]?.liker?.user?.isPremium ? (
                              <div className="flex items-center gap-1 ms-1">
                                {post?.likes[0]?.liker?.user?.username}{" "}
                                <Icon
                                  icon="bi:patch-check-fill"
                                  color="#9353D3"
                                />
                              </div>
                            ) : (
                              post?.likes[0]?.liker?.user?.username
                            )}
                            ,{" "}
                            {post?.likes[1]?.liker?.user?.isPremium ? (
                              <div className="flex items-center gap-1 me-1">
                                {post?.likes[1]?.liker?.user?.username}{" "}
                                <Icon
                                  icon="bi:patch-check-fill"
                                  color="#9353D3"
                                />
                              </div>
                            ) : (
                              post?.likes[1]?.liker?.user?.username
                            )}{" "}
                            and {likesCount - 2} others
                          </span>
                        </p>
                      </div>
                    )
                  ) : (
                    <p>No likes yet</p>
                  ))}

                {post?.caption ? (
                  <p className="flex">
                    <span className="font-bold me-2">
                      {post?.user.isPremium ? (
                        <div className="flex items-center gap-1 me-1">
                          {post.user.username}{" "}
                          <Icon icon="bi:patch-check-fill" color="#9353D3" />
                        </div>
                      ) : (
                        post?.user.username
                      )}
                    </span>
                    {post?.caption}
                  </p>
                ) : (
                  ""
                )}

                <div className="flex w-full justify-between items-center">
                  <p className="text-small mt-3">
                    {moment(post?.created_at).fromNow()}
                  </p>
                  {post?.updated_at !== post?.created_at ? (
                    <p className="text-tiny mt-3">
                      updated {moment(post?.updated_at).fromNow()}
                    </p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <EditPostModal
        post={post}
        isOpen={isOpen}
        onClose={onOpenChange}
        onUpdatePost={onUpdatePost}
        onDeleteImage={handleDeleteImage}
        currentUser={currentUser}
      />
      <LikersModal
        post={post}
        isOpen={isOpenLike}
        onOpenChange={onOpenChangeLike}
      />
    </>
  );
}
