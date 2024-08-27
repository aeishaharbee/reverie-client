"use client";

import { ScrollShadow, Spinner } from "@nextui-org/react";
import SearchFollowing from "../components/search/SearchFollowing";
import { useEffect } from "react";
import { User as IUser } from "../components/users/interface";
import { useRouter } from "next/navigation";
import ChatItem from "../components/chat/ChatItem";
import Messages from "../components/chat/Messages";
import { useAllUsers, useUser } from "@/lib/userStore";
import { shallow } from "zustand/shallow";
import { fetchUser, fetchUsers } from "@/lib/fetchers";
import { getToken } from "../handler/tokenHandler";
import { io } from "socket.io-client";

const MessagePage = () => {
  const router = useRouter();
  const token = getToken();

  const { myUser, setUser } = useUser(
    (state: any) => ({
      myUser: state.myUser,
      setUser: state.setUser,
    }),
    shallow
  );
  const { users, setUsers } = useAllUsers(
    (state: any) => ({
      users: state.users,
      setUsers: state.setUsers,
    }),
    shallow
  );

  const socket = io("http://localhost:4444");

  useEffect(() => {
    socket.on("new-user", () => {
      async function fetchData() {
        try {
          const usersData = await fetchUsers();
          setUsers(usersData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }

      fetchData();
    });
  }, [token]);

  useEffect(() => {
    const hasReloaded = localStorage.getItem("hasReloaded");
    if (!hasReloaded) {
      localStorage.setItem("hasReloaded", "true");
      window.location.reload();
    } else {
      const fetchData = async () => {
        try {
          const userData = await fetchUser();
          setUser(userData);

          const usersData = await fetchUsers();
          setUsers(usersData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          router.push("/login");
        }
      };
      fetchData();
    }
  }, [token]);

  console.log(myUser);
  if (!users) {
    return (
      <div className="flex justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  return (
    <>
      <div className="max-h-screen grid lg:grid-cols-12">
        <div className="p-3 flex sidebar lg:!block lg:!col-span-4 h-full">
          <div className="w-full h-full">
            <SearchFollowing />
            <ScrollShadow className="h-[80vh] w-full" hideScrollBar>
              {users ? (
                <div className="flex flex-col gap-1 mt-3">
                  {users?.reverse().map((user: IUser) => (
                    <ChatItem key={user._id} user={user} />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center w-full h-full items-center">
                  <Spinner size="lg" color="secondary" />
                </div>
              )}
            </ScrollShadow>
          </div>
        </div>
        <div className="p-3 lg:!col-span-8 ">
          <Messages />
        </div>
      </div>
    </>
  );
};

export default MessagePage;
