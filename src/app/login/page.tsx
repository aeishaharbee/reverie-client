"use client";
import React, { useState } from "react";
import { Button, Link, Input } from "@nextui-org/react";
import { Kalnia } from "next/font/google";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../api/usersApi";
import { getToken, saveToken } from "../handler/tokenHandler";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/userStore";
import { io } from "socket.io-client";

const inter = Kalnia({ weight: "400", subsets: ["latin"] });

interface User {
  username: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [user, setUserLogin] = useState<User>({ username: "", password: "" });
  const socket = io("http://localhost:4444");

  const { mutate } = useMutation({
    mutationFn: loginUser,
  });
  const queryClient = useQueryClient();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setUserLogin({ ...user, [e.target.name]: e.target.value });

  const onSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (user.username && user.password) {
      mutate(user, {
        onSuccess: (data: {
          msg: string;
          token: string;
          user: { isPrivate: string; isPremium: string };
        }) => {
          toast.success(`${data.msg}`);
          queryClient.invalidateQueries({ queryKey: ["users"] });

          saveToken(data.token, data.user.isPrivate, data.user.isPremium);
          useUser.getState().setUser(data.user);
          socket.emit("joined", "new user");

          console.log(getToken());
          router.push("/");
          router.refresh();
        },
        onError: (error: any) => {
          toast.error(error.message);
        },
      });
    } else {
      toast("Username and password are required.");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center my-16">
        <h1 className={`text-6xl ${inter.className}`}>reverie</h1>
      </div>

      <div className="mb-16">
        <form
          className="flex flex-col items-center gap-4"
          onSubmit={onSubmitHandler}
        >
          <div className="flex w-full flex-wrap md:flex-nowrap justify-center max-w-sm">
            <Input
              isRequired
              type="text"
              label="Username"
              name="username"
              value={user.username}
              onChange={onChangeHandler}
              variant="faded"
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap justify-center max-w-sm">
            <Input
              isRequired
              type="password"
              label="Password"
              name="password"
              value={user.password}
              onChange={onChangeHandler}
              variant="faded"
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap justify-center max-w-sm">
            <Button color="secondary" variant="shadow" type="submit" fullWidth>
              login
            </Button>
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap justify-center max-w-sm">
            don't have an account yet? -{">"}
            <Link href="/register" color="secondary" underline="hover">
              register here
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}
