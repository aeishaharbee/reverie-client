"use client";
import { useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import MessageItem from "./MessageItem";
import { io } from "socket.io-client";
import { useMessages, useSelectedUser, useUser } from "@/lib/userStore";
import { shallow } from "zustand/shallow";
import { getToken } from "@/app/handler/tokenHandler";
import axios from "axios";

export default function MessageList() {
  const [parent] = useAutoAnimate();
  const { myUser, setUser } = useUser(
    (state: any) => ({
      myUser: state.myUser,
      setUser: state.setUser,
    }),
    shallow
  );
  const receiver = useSelectedUser((state) => state.selectedUser);
  const { messages, setMessages } = useMessages(
    (state: any) => ({
      messages: state.messages,
      setMessages: state.setMessages,
    }),
    shallow
  );

  const socket = io("http://localhost:4444");

  socket.on("refresh", async () => {
    async function fetchData() {
      try {
        const token = getToken();

        const response = await axios.get(
          `http://localhost:4444/messages?sender=${token}&receiver=${receiver.username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data.messages);
        setUser(response.data.sender);

        console.log(response.data.sender);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    }
    fetchData();
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const token = getToken();

        const response = await axios.get(
          `http://localhost:4444/messages?sender=${token}&receiver=${receiver.username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data.messages);
        setUser(response.data.sender);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    }
    fetchData();
  }, [receiver]);

  return (
    <>
      <div ref={parent}>
        {messages &&
          messages.map((item: any, index: number) => (
            <MessageItem
              key={index}
              user={myUser._id == item.sender ? true : false}
              message={item.message}
              timestamp={item.timestamp}
            />
          ))}
      </div>
    </>
  );
}
