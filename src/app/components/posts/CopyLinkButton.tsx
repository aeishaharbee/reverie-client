"use client";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { useState } from "react";

interface CopyLinkButtonProps {
  postId: string;
}

export default function CopyLink({ postId }: CopyLinkButtonProps) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      await navigator.clipboard.writeText(
        `http://localhost:3000/posts/${postId}`
      );
      setCopySuccess("Link copied to clipboard!");
      toast.success(copySuccess);
    } catch (err) {
      setCopySuccess("Failed to copy the link.");
      toast.warning(copySuccess);
    }

    setTimeout(() => {
      setCopySuccess(null);
    }, 3000);
  };

  return (
    <>
      <div onClick={handleSave} style={{ cursor: "pointer" }}>
        <Icon icon="bi:send" width={28} height={28} />
      </div>
    </>
  );
}
