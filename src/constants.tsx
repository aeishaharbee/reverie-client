import { Icon } from "@iconify/react";
import { SideNavItem } from "./types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "Explore",
    path: "/explore/all",
    icon: <Icon icon="lucide:compass" width="24" height="24" />,
  },
  {
    title: "Messages",
    path: "/messages",
    icon: <Icon icon="lucide:message-circle" width="24" height="24" />,
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: <Icon icon="lucide:heart" width="24" height="24" />,
  },
];

export const SIDENAV_ITEMS_BELOW: SideNavItem[] = [
  {
    title: "Premium",
    path: "/premium",
    icon: <Icon icon="lucide:badge-check" width="24" height="24" />,
  },
];

export const SIDENAV_ITEMS_ALL: SideNavItem[] = [
  {
    title: "Home",
    path: "/",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "Explore",
    path: "/explore/all",
    icon: <Icon icon="lucide:compass" width="24" height="24" />,
  },
  {
    title: "Messages",
    path: "/messages",
    icon: <Icon icon="lucide:message-circle" width="24" height="24" />,
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: <Icon icon="lucide:heart" width="24" height="24" />,
  },
  {
    title: "Premium",
    path: "/premium",
    icon: <Icon icon="lucide:badge-check" width="24" height="24" />,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <Icon icon="lucide:badge-check" width="24" height="24" />,
  },
];
