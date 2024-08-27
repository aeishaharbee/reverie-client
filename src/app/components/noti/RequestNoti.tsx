import { Avatar, Button, Card, CardBody, Image } from "@nextui-org/react";
import { Noti } from "../users/interface";
import { Icon } from "@iconify/react/dist/iconify.js";
import moment from "moment";
import { toast } from "react-toastify";
import { acceptRequest, deleteRequest } from "@/app/api/requestApi";
import { useState } from "react";

interface RequestNotiProps {
  noti: Noti;
  onRemove: (id: string) => void;
}

export default function RequestNoti({ noti, onRemove }: RequestNotiProps) {
  const [isApproved, setIsApproved] = useState<boolean>(noti.post?.isApproved);

  const acceptHandler = async () => {
    try {
      const response = await acceptRequest(noti.post?._id);
      setIsApproved(true);
      if (response) {
        toast.success(`${noti.userFrom.username} is now following you!`);
      }
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred.");
    }
  };

  const declineHandler = async () => {
    try {
      const response = await deleteRequest(noti.post?._id);
      if (response) {
        toast.warning(`Declined request from ${noti.userFrom.username}`);
        onRemove(noti._id);
      }
    } catch (e) {
      console.error(e);
      toast.error("An unexpected error occurred.");
    }
  };

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
            <p className="flex items-center flex-wrap">
              <span className="font-semibold">{noti.userFrom.username}</span>
              {noti.userFrom.isPremium && (
                <Icon
                  icon="bi:patch-check-fill"
                  color="#9353D3"
                  className="ms-1"
                />
              )}{" "}
              <span className="ms-2 flex">requested to follow you.</span>
            </p>
            <p className="text-tiny text-default-500">
              {moment(noti.created_at).fromNow()}
            </p>
          </div>

          {isApproved ? (
            <Button
              isDisabled
              color="secondary"
              variant="bordered"
              className="ms-3"
            >
              Accepted
            </Button>
          ) : (
            <>
              <Button
                color="secondary"
                size="md"
                className="ms-3"
                onPress={acceptHandler}
              >
                Accept
              </Button>
              <Button
                color="danger"
                variant="bordered"
                size="md"
                className="ms-2"
                onPress={declineHandler}
              >
                Decline
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
}
