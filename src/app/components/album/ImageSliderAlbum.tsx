"use client";
import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Spinner } from "@nextui-org/react";

interface ImageSliderAlbumProps {
  images: { image: string }[];
}

export default function ImageSliderAlbum({ images }: ImageSliderAlbumProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const prevSlide = (): void => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const nextSlide = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  if (!images[currentIndex]?.image) {
    return (
      <div className="flex justify-center w-full h-full items-center">
        <Spinner size="lg" color="secondary" />
      </div>
    );
  }

  return (
    <div className="relative w-full mx-auto mt-4">
      <div className="relative group ">
        <div className="relative w-[150px] h-[150px]">
          <Image
            src={`http://localhost:4444/${images[currentIndex]?.image}`}
            alt={`Slider Image ${currentIndex + 1}`}
            layout="fill"
            objectFit="contain"
            className="rounded-xl"
          />

          {images.length > 1 && (
            <>
              <div
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#111927] hover:bg-[#1a222f] text-white p-1 rounded-full cursor-pointer"
                onClick={prevSlide}
              >
                <Icon icon="lucide:chevron-left" />
              </div>
              <div
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#111927] hover:bg-[#1a222f] text-white p-1 rounded-full cursor-pointer"
                onClick={nextSlide}
              >
                <Icon icon="lucide:chevron-right" />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-4 w-[150px]">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1 ${
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
