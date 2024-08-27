"use client";
import { Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { io } from "socket.io-client";
import { useSelectedUser, useUser } from "@/lib/userStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmojiPicker from "emoji-picker-react";

export default function MessageInput() {
  const [inpValue, setInpValue] = useState<string>("");
  const [showEmo, setShowEmo] = useState<boolean>(false);
  const selectedUser = useSelectedUser((state) => state.selectedUser);
  const user = useUser((state) => state.myUser);
  const socket = io("http://localhost:4444");

  function onEmojiClick(emojiObject: { emoji: string }) {
    setInpValue((pre) => pre + emojiObject.emoji);
  }

  function handeSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    if (inpValue == "") {
      toast.warning("Type a message before sending");
    } else {
      let userUname = user.username;
      let selectedUname = selectedUser.username;
      socket.emit("private message", selectedUname, inpValue, userUname);

      console.log(userUname, selectedUname);
      setInpValue("");
    }
  }

  return (
    <>
      <div className="relative">
        <form onSubmit={handeSubmit}>
          {showEmo && (
            <div className="absolute bottom-full">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}

          <Input
            type="text"
            value={inpValue}
            onChange={(e) => setInpValue(e.target.value)}
            placeholder="Send a message...."
            startContent={
              <>
                <button type="button" onClick={() => setShowEmo(!showEmo)}>
                  <Icon icon="bi:emoji-smile" />
                </button>
              </>
            }
            endContent={
              <>
                <button type="submit">
                  <Icon icon="ion:send" width={20} height={20} />
                </button>
              </>
            }
          />
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}
