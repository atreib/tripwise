"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingMessages = [
  "Packing your virtual suitcase...",
  "Plotting the perfect route...",
  "Checking the weather at your destination...",
  "Booking the best spots...",
  "Preparing your travel playlist...",
  "Arranging a window seat for you...",
];

export default function LongLoading() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === loadingMessages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="h-20 flex items-center justify-center"
        >
          <p className="text-xl font-medium text-gray-700">
            {loadingMessages[currentMessageIndex]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
