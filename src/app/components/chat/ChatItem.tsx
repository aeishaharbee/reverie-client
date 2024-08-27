"use client";
import { Avatar, Divider } from "@nextui-org/react";
import { useSelectedUser } from "@/lib/userStore";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function ChatItem({ user }: { user: any }) {
  const setSelectedUser = useSelectedUser((state) => state.setSelectedUser);

  function handleClick(e: any) {
    document.querySelector(".messages")?.classList.remove("hidden");
    document.querySelector(".messages")?.classList.add("flex");
    document.querySelector(".sidebar")?.classList.add("hidden");
    document.querySelector(".selected-user")?.classList.remove("selected-user");
    e.currentTarget.classList.add("selected-user");
    setSelectedUser(user);
  }

  console.log(user);

  return (
    <>
      <li
        onClick={handleClick}
        className="flex gap-3 cursor-pointer hover:bg-default-100 p-3 rounded-lg"
      >
        <Avatar
          src={
            user.image
              ? `http://localhost:4444/${user.image}`
              : `http://localhost:4444/default-pfp.png`
          }
          size="md"
          className="flex-none w-10 h-10"
          isBordered
          color={user.isPremium ? "secondary" : "default"}
        />
        <div className="flex flex-col justify-between">
          {user.isPremium ? (
            <div className="font-semibold flex gap-1 items-center">
              {user.username}{" "}
              <Icon icon="bi:patch-check-fill" color="#9353D3" />
            </div>
          ) : (
            <p className="font-semibold">{user.username}</p>
          )}
          <p className="text-sm text-gray-400">Start messaging</p>
        </div>
      </li>
      <Divider />
    </>
  );
}
