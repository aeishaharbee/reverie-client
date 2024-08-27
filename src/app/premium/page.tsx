"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardBody, Image, Spinner } from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { User as IUser } from "../components/users/interface";
import { editUserProfile, getUserInfo } from "../api/usersApi";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function PremiumPage() {
  const [userInfo, setUserInfo] = useState<IUser | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUserInfo();
        if (userData) {
          setUserInfo(userData);
          setIsSubscribed(userData.isPremium);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch album:", error);
      }
    }

    fetchUser();
  }, []);

  const handlerSubscribe = async () => {
    try {
      const data = new FormData();
      data.append("isPremium", isSubscribed ? "false" : "true");

      if (isSubscribed) {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Your premium features access will be revoked.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, unsubscribe!",
          cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          await editUserProfile(data);
          Swal.fire({
            title: "Unsubscribed!",
            text: "All premium features have been revoked.",
            icon: "success",
          });
          setTimeout(() => {
            window.location.href = "http://localhost:3000/premium";
          }, 1500);
        }
      } else {
        await editUserProfile(data);
        Swal.fire({
          title: "Subscribed!",
          text: "Now, you have access to all of our premium features.",
          icon: "success",
        });
        setTimeout(() => {
          window.location.href = "http://localhost:3000/premium";
        }, 1500);
      }
    } catch (error) {
      console.error("An error occurred while deleting the comment:", error);
      toast.error("An error occurred");
    }
  };

  if (!userInfo) {
    return (
      <div className="flex justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center my-10">
        <h1 className="text-3xl font-semibold mb-10 text-center">
          Subscribe to access the{" "}
          <span className="bg-purple-500 px-3 text-white">best</span> of us!
        </h1>
        <div className="flex flex-col lg:flex-row  justify-center gap-10 items-center md:items-stretch">
          <Card className="p-3 md:w-full w-fit lg:w-fit ">
            <CardBody className="flex flex-col justify-between">
              <div className="flex gap-3 items-center mb-5">
                <Icon
                  icon="bi:patch-check-fill"
                  color="#9353D3"
                  width={30}
                  height={30}
                />
                <p className="md:text-lg text-md">
                  Special <span className="font-bold">badge</span> on your
                  username
                </p>
              </div>
              <div className="flex gap-3 items-center mb-5">
                <Icon
                  icon="bi:patch-check-fill"
                  color="#9353D3"
                  width={30}
                  height={30}
                />
                <p className="md:text-lg text-md">
                  Generate a <span className="font-bold">qr code</span> for your
                  profile
                </p>
              </div>
              <div className="flex gap-3 items-center mb-5">
                <Icon
                  icon="bi:patch-check-fill"
                  color="#9353D3"
                  width={30}
                  height={30}
                />
                <p className="md:text-lg text-md">
                  <span className="font-bold">Hide</span> your posts' likes
                  count
                </p>
              </div>
              <div className="flex gap-3 items-center mb-5">
                <Icon
                  icon="bi:patch-check-fill"
                  color="#9353D3"
                  width={30}
                  height={30}
                />
                <p className="md:text-lg text-md">
                  <span className="font-bold">Disable</span> your posts' comment
                  section
                </p>
              </div>
              <div className="flex gap-3 items-center mb-5">
                <Icon
                  icon="bi:patch-check-fill"
                  color="#9353D3"
                  width={30}
                  height={30}
                />
                <p className="md:text-lg text-md">
                  Upload up to <span className="font-bold">20 images</span> in
                  one post
                </p>
              </div>
            </CardBody>
          </Card>
          <Card className="w-full md:w-fit">
            <CardBody className="flex flex-col items-center p-5 bg-purple-500">
              <Image
                src="http://localhost:4444/logo.png"
                width={200}
                height={200}
              />
              <p className="font-semibold text-default-300">
                Reverie Premium Subscription
              </p>
              <p className="text-4xl font-bold text-white">MYR 50.00</p>
              <Button
                color="secondary"
                variant={userInfo.isPremium ? "shadow" : "faded"}
                fullWidth
                className="mt-7 font-semibold"
                onPress={handlerSubscribe}
              >
                {userInfo.isPremium ? "UNSUBSCRIBE" : "SUBSCRIBE"}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
