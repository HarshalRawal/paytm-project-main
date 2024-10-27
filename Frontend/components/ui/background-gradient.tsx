"use client";

import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className = "",
  containerClassName = "",
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <div className={`relative ${containerClassName} overflow-hidden`}>
      <motion.div
        className={`absolute inset-0 z-[-1] transition-all duration-300 ${className}`}
        style={{
          background:
            "linear-gradient(90deg, #44BCFF -0.55%, #FF44EC 22.86%, #FF675E 48.36%, #FFBD44 73.33%, #44BCFF 99.34%)",
          backgroundSize: "200% 200%",
        }}
        initial="initial"
        animate={animate ? "animate" : "initial"}
        variants={variants}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      ></motion.div>
      {children}
    </div>
  );
};