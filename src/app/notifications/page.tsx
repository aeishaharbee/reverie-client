"use client";

import { Spinner, Tab, Tabs } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User as IUser, Noti } from "../components/users/interface";
import { getUserInfo } from "../api/usersApi";
import { getUserOwnNoti } from "../api/notiApi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LikesNoti from "../components/noti/LikesNoti";
import CommentsNoti from "../components/noti/CommentsNoti";
import FollowNoti from "../components/noti/FollowNoti";
import { Icon } from "@iconify/react/dist/iconify.js";
import RequestNoti from "../components/noti/RequestNoti";

export default function NotiPage() {
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [notifs, setNotifs] = useState<Noti[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserInfo();
        if (userData) {
          setUserInfo(userData);

          const notifsFetched = await getUserOwnNoti();
          setNotifs(notifsFetched);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user info or posts:", error);
        router.push("/login");
      }
    }

    fetchData();
  }, [router]);

  const handleRemoveNoti = (id: string) => {
    setNotifs(
      (prevNotifs) => prevNotifs?.filter((noti) => noti._id !== id) || null
    );
  };

  if (!userInfo || !notifs) {
    return (
      <div className="flex justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  const renderNotifs = (type: string) => {
    const filteredNotifs = notifs.filter((noti) => noti.notiType === type);

    if (filteredNotifs.length === 0) {
      return (
        <div className="flex flex-col justify-center w-full h-full items-center">
          <div className="border-4 p-6 rounded-full border-default-300">
            <Icon
              icon="bi:bell-slash-fill"
              width={60}
              height={60}
              className="text-default-500"
            />
          </div>
          <p className="text-2xl font-semibold text-default-500 mt-5">
            No notifications yet.
          </p>
        </div>
      );
    }

    return (
      <div className="container flex flex-col items-center">
        {filteredNotifs.map((noti) =>
          type === "Liked" ? (
            <div key={noti._id} className="">
              <LikesNoti noti={noti} />
            </div>
          ) : type === "Commented" ? (
            <div key={noti._id} className="">
              <CommentsNoti noti={noti} />
            </div>
          ) : type === "Requested" ? (
            <div key={noti._id} className="">
              <RequestNoti noti={noti} onRemove={handleRemoveNoti} />
            </div>
          ) : type === "Followed" || type === "Accepted" ? (
            <div key={noti._id} className="">
              <FollowNoti noti={noti} />
            </div>
          ) : (
            ""
          )
        )}
      </div>
    );
  };

  let tabs = [
    {
      id: "ikes",
      label: "Likes",
      content: <>{renderNotifs("Liked")}</>,
    },
    {
      id: "comments",
      label: "Comments",
      content: <>{renderNotifs("Commented")}</>,
    },
    ...(userInfo?.isPrivate
      ? [
          {
            id: "requests",
            label: "Requests",
            content: <>{renderNotifs("Requested")}</>,
          },
        ]
      : []),
    {
      id: "followed",
      label: "Followed",
      content: <>{renderNotifs("Followed")}</>,
    },
  ];

  return (
    <>
      <div className="flex w-full flex-col items-center">
        <Tabs aria-label="Dynamic tabs" items={tabs} className="mb-5">
          {(item) => (
            <Tab key={item.id} title={item.label} className="w-full">
              {item.content}
            </Tab>
          )}
        </Tabs>
      </div>

      <ToastContainer position="bottom-right" />
    </>
  );
}
