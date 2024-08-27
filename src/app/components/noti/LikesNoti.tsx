import { Avatar, Card, CardBody, Image } from "@nextui-org/react";
import { Noti } from "../users/interface";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import moment from "moment";

interface LikesNotiProps {
  noti: Noti;
}

export default function LikesNoti({ noti }: LikesNotiProps) {
  return (
    <>
      <Link
        href={
          noti.postType === "Post"
            ? `http://localhost:3000/posts/${noti.post._id}`
            : `http://localhost:3000/posts/${noti.notiContent?.post}`
        }
      >
        <Card className="mb-4 w-fit">
          <CardBody className="flex sm:flex-row flex-col items-center sm:gap-0 gap-3 px-4">
            <Avatar
              isBordered
              color={noti.userFrom.isPremium ? "secondary" : "default"}
              src={
                noti.userFrom.image
                  ? `http://localhost:4444/${noti.userFrom.image}`
                  : "http://localhost:4444/default-pfp.png"
              }
              className="sm:me-3"
            />
            <div>
              <p className="flex items-center">
                <span className="font-semibold">{noti.userFrom.username}</span>
                {noti.userFrom.isPremium && (
                  <Icon
                    icon="bi:patch-check-fill"
                    color="#9353D3"
                    className="ms-1"
                  />
                )}{" "}
                <span className="ms-2">
                  liked your {noti.postType?.toLowerCase()}
                </span>
                {noti.postType === "Comment" && (
                  <span>: {noti.notiContent?.body}</span>
                )}
              </p>
              <p className="text-tiny text-default-500">
                {moment(noti.created_at).fromNow()}
              </p>
            </div>

            {noti.postType === "Post" && (
              <>
                <Image
                  src={`http://localhost:4444/${noti.post?.images[0].image}`}
                  className="object-cover sm:ms-5 sm:w-[60px] sm:h-[60px] w-[100px] h-[100px] "
                />
              </>
            )}
          </CardBody>
        </Card>
      </Link>
    </>
  );
}
