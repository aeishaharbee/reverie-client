import { Avatar, Card, CardBody, Image } from "@nextui-org/react";
import { Noti } from "../users/interface";
import { Icon } from "@iconify/react/dist/iconify.js";
import moment from "moment";

interface FollowNotiProps {
  noti: Noti;
}

export default function FollowNoti({ noti }: FollowNotiProps) {
  return (
    <>
      <Card className="mb-4 w-fit">
        <CardBody className="flex sm:flex-row flex-col items-center sm:gap-0 gap-3">
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
            {noti.notiType === "Followed" && (
              <p className="flex items-center">
                <span className="font-semibold">{noti.userFrom.username}</span>
                {noti.userFrom.isPremium && (
                  <Icon
                    icon="bi:patch-check-fill"
                    color="#9353D3"
                    className="ms-1"
                  />
                )}{" "}
                <span className="ms-2">started following you.</span>
              </p>
            )}

            {noti.notiType === "Accepted" && (
              <p className="flex items-center">
                <span className="font-semibold">{noti.userFrom.username}</span>
                {noti.userFrom.isPremium && (
                  <Icon
                    icon="bi:patch-check-fill"
                    color="#9353D3"
                    className="ms-1"
                  />
                )}{" "}
                <span className="ms-2">accepted your following request.</span>
              </p>
            )}

            <p className="text-tiny text-default-500">
              {moment(noti.created_at).fromNow()}
            </p>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
