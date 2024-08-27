"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import Swal from "sweetalert2";
import { deleteImagePost } from "@/app/api/postsApi";

interface ImageSliderSmallProps {
  images: { image: string }[];
  postId: string;
  onDeleteImage: (deletedImage: string) => void;
  isOpen: boolean;
  setImagesParent: (images: { image: string }[]) => void;
}

export default function ImageSliderSmall({
  images,
  postId,
  onDeleteImage,
  isOpen,
  setImagesParent,
}: ImageSliderSmallProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentImages, setCurrentImages] = useState(images);

  useEffect(() => {
    if (isOpen) {
      setCurrentImages(images);
      setCurrentIndex(0);
    }
  }, [isOpen, images]);

  const prevSlide = (): void => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + currentImages.length) % currentImages.length
    );
  };

  const nextSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % currentImages.length);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This image will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const deletedImage = currentImages[currentIndex].image;
        await deleteImagePost({ postId, imageName: deletedImage });

        const updatedImages = currentImages.filter(
          (_, index) => index !== currentIndex
        );

        setCurrentImages(updatedImages);
        setImagesParent(updatedImages);
        if (currentIndex >= updatedImages.length) {
          setCurrentIndex(0);
        }

        onDeleteImage(deletedImage);

        Swal.fire({
          title: "Deleted!",
          text: "The image has been deleted.",
          icon: "success",
        });
      } catch (error) {
        console.error("Failed to delete image:", error);
        Swal.fire("Error", "Failed to delete the image.", "error");
      }
    }
  };

  return (
    <div className="relative w-full mx-auto mt-4">
      <div className="relative sm:mx-12 group ">
        <div className="relative w-full h-[350px]">
          <Image
            src={`http://localhost:4444/${currentImages[currentIndex]?.image}`}
            alt={`Slider Image ${currentIndex + 1}`}
            layout="fill"
            objectFit="contain"
            className="rounded-xl"
            id={currentImages[currentIndex]?.image}
          />

          {currentImages.length > 1 && (
            <>
              <div
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#111927] hover:bg-[#1a222f] text-white p-2 rounded-full cursor-pointer"
                onClick={prevSlide}
              >
                <Icon icon="lucide:chevron-left" />
              </div>
              <div
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#111927] hover:bg-[#1a222f] text-white p-2 rounded-full cursor-pointer"
                onClick={nextSlide}
              >
                <Icon icon="lucide:chevron-right" />
              </div>

              <div
                className="absolute bottom-0 right-0 z-20 bg-red-500 p-2 rounded-full cursor-pointer"
                onClick={handleDelete}
              >
                <Icon
                  icon="bi:trash"
                  className="text-white cursor-pointer"
                  width={24}
                  height={24}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        {currentImages.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-10 mx-1 ${
              index === currentIndex
                ? "bg-purple-400 rounded-xl"
                : "bg-gray-300 rounded-xl"
            } `}
          ></div>
        ))}
      </div>
    </div>
  );
}
