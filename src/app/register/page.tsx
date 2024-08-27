"use client";

import React, { useState } from "react";
import { Button, Link, Input } from "@nextui-org/react";
import { Kalnia } from "next/font/google";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "../api/usersApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Kalnia({ weight: "400", subsets: ["latin"] });

interface User {
  fullname: string;
  username: string;
  email: string;
  password: string;
  cpassword: string;
}

export default function Register() {
  const router = useRouter();

  const [user, setUser] = useState<User>({
    fullname: "",
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const { mutate } = useMutation({
    mutationFn: registerUser,
  });
  const queryClient = useQueryClient();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (user.password !== user.cpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (user.username && user.password) {
      const { cpassword, ...userData } = user;
      mutate(userData, {
        onSuccess: (data: {
          msg: string;
          user: { isPrivate: string; isPremium: string };
        }) => {
          toast.success(`${data.msg}`);
          queryClient.invalidateQueries({ queryKey: ["users"] });
          setTimeout(() => {
            router.push("/login");
          }, 1500);
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
          className="flex flex-col items-center gap-4 "
          onSubmit={onSubmitHandler}
        >
          <div className="flex w-full flex-wrap md:flex-nowrap justify-center max-w-sm">
            <Input
              isRequired
              type="text"
              label="Name"
              name="fullname"
              value={user.fullname}
              onChange={onChangeHandler}
              variant="faded"
            />
          </div>
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
              type="email"
              label="Email Address"
              name="email"
              value={user.email}
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
            <Input
              isRequired
              type="password"
              label="Confirm Password"
              name="cpassword"
              value={user.cpassword}
              onChange={onChangeHandler}
              variant="faded"
            />
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap justify-center max-w-sm">
            <Button color="secondary" variant="shadow" type="submit" fullWidth>
              register
            </Button>
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap justify-center max-w-sm">
            already have an account? -{">"}
            <Link href="/login" color="secondary" underline="hover">
              login here
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}
