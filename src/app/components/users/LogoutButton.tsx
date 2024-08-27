"use client";

import { Button } from "@nextui-org/react";
import { clearToken } from "@/app/handler/tokenHandler";
import { useUser } from "@/lib/userStore";
import { shallow } from "zustand/shallow";

export default function LogoutButton() {
  const logoutHandler = () => {
    clearToken();
    window.location.href = "http://localhost:3000/";
    useUser.getState().resetUser();
  };

  return (
    <Button color="danger" variant="ghost" onClick={logoutHandler}>
      Logout
    </Button>
  );
}
