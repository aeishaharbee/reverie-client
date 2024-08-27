"use client";
import { Avatar } from "@nextui-org/react";
import { User as IUser } from "../users/interface";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function TopBar({
  selectedUser,
}: {
  selectedUser: IUser | null;
}) {
  function handleClick() {
    document.querySelector(".messages")?.classList.add("hidden");
    document.querySelector(".sidebar")?.classList.remove("hidden");
  }

  return (
    <>
      <div
        className={`${
          selectedUser ? " " : "lg:hidden"
        } border-b-3 w-full flex justify-center items-center p-2 relative`}
      >
        <button
          onClick={handleClick}
          className="bg-transparent hover:bg-default-100 lg:invisible absolute top-1/2 transform -translate-y-1/2 left-3"
        >
          <Icon icon="bi:arrow-left" height={30} />
        </button>
        <div className="flex items-center gap-3">
          <Avatar
            src={
              selectedUser?.image
                ? `http://localhost:4444/${selectedUser?.image}`
                : `http://localhost:4444/default-pfp.png`
            }
            size="md"
            className="flex-none w-10 h-10"
            isBordered
            color={selectedUser?.isPremium ? "secondary" : "default"}
          />
          {selectedUser?.isPremium ? (
            <div className="font-semibold flex gap-1 items-center">
              {selectedUser?.username}{" "}
              <Icon icon="bi:patch-check-fill" color="#9353D3" />
            </div>
          ) : (
            <p className="font-semibold">{selectedUser?.username}</p>
          )}
        </div>
      </div>
    </>
  );
}
