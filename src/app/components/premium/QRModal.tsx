"use client";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Image,
  Button,
} from "@nextui-org/react";
import { User as IUser } from "../users/interface";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface QRModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  userInfo: IUser;
}

export default function QRModal({
  isOpen,
  onOpenChange,
  userInfo,
}: QRModalProps) {
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(`http://localhost:3000/users/${userInfo.username}`).then(
        setImage
      );
    }
  }, [isOpen, userInfo.username]);

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = `${userInfo.username}_QR.png`;
    link.click();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              QR Link to Your Account
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-3 w-full items-center justify-between mb-5">
                <Image src={image} />
                <Button variant="ghost" color="secondary" onPress={downloadQR}>
                  Download QR
                </Button>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
