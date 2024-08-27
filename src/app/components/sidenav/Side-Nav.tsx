"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SIDENAV_ITEMS, SIDENAV_ITEMS_BELOW } from "@/constants";
import { SideNavItem } from "@/types";
import { Icon } from "@iconify/react";
import { Kalnia } from "next/font/google";
import { getUserInfo } from "@/app/api/usersApi";
import { Avatar } from "@nextui-org/react";

const inter = Kalnia({ weight: "400", subsets: ["latin"] });

const SideNav = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);
      } catch (error) {
        console.error("Failed to fetch user info", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="hidden">Loading...</div>;
  }

  const profileNav: SideNavItem[] = [
    {
      title: "Profile",
      path: "/profile",
      icon: (
        <Avatar
          src={
            user?.image
              ? `http://localhost:4444/${user.image}`
              : "http://localhost:4444/default-pfp.png"
          }
          className="w-6 h-6 text-tiny"
          isBordered
          color={user?.isPremium ? "secondary" : "default"}
        />
      ),
    },
  ];

  return (
    <div className="md:w-60  h-screen flex-1 fixed border-r border-default-200 hidden md:flex">
      <div className="flex flex-col justify-between">
        <div className="flex flex-col space-y-6 w-full">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center  md:px-6  h-12 w-full"
          >
            {/* <span className="h-7 w-7 bg-default-300 rounded-lg" /> */}
            <span className={`text-2xl hidden md:flex  ${inter.className}`}>
              reverie
            </span>
          </Link>

          <div className="flex flex-col space-y-2  md:px-6 ">
            {SIDENAV_ITEMS.map((item, idx) => {
              return <MenuItem key={idx} item={item} />;
            })}
          </div>
        </div>
        <div className="flex flex-col space-y-6 w-full">
          <div className="flex flex-col space-y-2  md:px-6 mb-10">
            {profileNav.map((item, idx) => {
              return <MenuItem key={idx} item={item} />;
            })}
            {SIDENAV_ITEMS_BELOW.map((item, idx) => {
              return <MenuItem key={idx} item={item} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg hover-bg-default-100 w-full justify-between hover:bg-default-100 ${
              pathname.includes(item.path) ? "bg-default-100 " : ""
            }`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-xl  flex">{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname ? "font-bold" : ""
                    }`}
                  >
                    <span>{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-default-100 ${
            item.path === pathname ? "bg-default-100 " : ""
          }`}
        >
          {item.icon}
          <span className="font-semibold text-xl flex">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
