"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react/dist/iconify.js";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    isVisible && (
      <Button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 z-50"
        color="secondary"
        radius="full"
      >
        <Icon icon="bi:arrow-up" />
      </Button>
    )
  );
};

export default ScrollToTopButton;
