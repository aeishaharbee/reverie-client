"use client";
import React, { useEffect, useState } from "react";
import { Image, Button, Link, Tabs, Tab } from "@nextui-org/react";
import { Kalnia } from "next/font/google";
import { getToken, isAuth } from "@/app/handler/tokenHandler";
import FollowingPosts from "./components/home/FollowingPosts";
import FavouritePosts from "./components/home/FavouritePosts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTopButton from "./components/ScrollToTop";

const inter = Kalnia({ weight: "400", subsets: ["latin"] });

const imageSources = [
  "/scrollingImages/image1.png",
  "/scrollingImages/image2.png",
  "/scrollingImages/image3.png",
  "/scrollingImages/image4.png",
  "/scrollingImages/image5.png",
  "/scrollingImages/image6.png",
  "/scrollingImages/image7.png",
  "/scrollingImages/image8.png",
  "/scrollingImages/image9.png",
  "/scrollingImages/image10.png",
  "/scrollingImages/image11.png",
  "/scrollingImages/image12.png",
  "/scrollingImages/image13.png",
  "/scrollingImages/image14.png",
  "/scrollingImages/image15.png",
  "/scrollingImages/image16.png",
];

export default function Home() {
  const [authUser, setAuthUser] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const userAuth = isAuth();
    setAuthUser(userAuth);
    if (userAuth) {
      setToken(getToken());
    }
  }, []);

  let tabs = [
    {
      id: "following",
      label: "Following",
      content: (
        <>
          <FollowingPosts />
        </>
      ),
    },
    {
      id: "favourite",
      label: "Favourite",
      content: (
        <>
          <FavouritePosts />
        </>
      ),
    },
  ];

  if (authUser) {
    return (
      <>
        <div>
          <div className="flex w-full flex-col items-center">
            <Tabs aria-label="Dynamic tabs" items={tabs} className="mb-5">
              {(item) => (
                <Tab key={item.id} title={item.label} className="w-full">
                  {item.content}
                </Tab>
              )}
            </Tabs>
          </div>

          <ScrollToTopButton />
        </div>
        <ToastContainer position="bottom-right" />
      </>
    );
  } else {
    return (
      <div className="h-full my-10">
        {/* SCROLLING 1 */}
        <div className="w-full overflow-hidden flex justify-center">
          <div className="flex animate-scroll-right whitespace-nowrap justify-center">
            {imageSources.concat(imageSources).map((src, index) => (
              <Image
                key={`scroll1-${index}`}
                className="min-w-[150px] max-w-[220px]"
                alt={`Image ${index + 1}`}
                src={src}
              />
            ))}
          </div>
        </div>

        {/* TITLE */}
        <div className="flex flex-col justify-center items-center my-16">
          <h1 className={`text-6xl mb-5 ${inter.className}`}>reverie</h1>
          <Button color="secondary" variant="shadow" href="/register" as={Link}>
            join us now.
          </Button>
        </div>

        {/* SCROLLING 2 */}
        <div className="w-full overflow-hidden flex justify-center">
          <div className="flex animate-scroll-left whitespace-nowrap justify-center">
            {imageSources.concat(imageSources).map((src, index) => (
              <Image
                key={`scroll1-${index}`}
                className="min-w-[150px] max-w-[220px]"
                alt={`Image ${index + 1}`}
                src={src}
              />
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer className=" rounded-lg shadow m-4  bottom-0 bg-transparent">
          <div className="w-full mx-auto max-w-screen-xl p-4 flex items-center justify-center">
            <span className="text-sm text-center ">
              © 2024 reverie. All Rights Reserved.
            </span>
          </div>
        </footer>
      </div>
    );
  }
}
