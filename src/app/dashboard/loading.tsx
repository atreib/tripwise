"use client";

import { motion } from "framer-motion";
import { PlaneIcon } from "lucide-react";

export default function GlobalLoading() {
  const circleRadius = 80;

  return (
    <div className="fixed w-[100dvw] h-[100dvh] top-0 left-0 flex items-center justify-center bg-background/30 backdrop-blur-sm z-50">
      <span className="text-lg">
        <img src="/icons/logo-only.png" alt="logo" className="w-8 h-8" />
      </span>
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          width: circleRadius * 2,
          height: circleRadius * 2,
        }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          style={{
            width: circleRadius * 2,
            height: circleRadius * 2,
          }}
          className="relative"
        >
          <PlaneIcon
            className="w-12 h-12 text-primary fill-primary absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{
              rotate: "90deg", // Adjust the plane's orientation
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
