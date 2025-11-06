'use client';
import { motion } from 'framer-motion';

const listItemVariants = {
  hover: {
    x: 5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const socialIconVariants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

export const AnimatedLi = ({ children }) => (
  <motion.li
    variants={listItemVariants}
    whileHover="hover"
  >
    {children}
  </motion.li>
);

export const AnimatedSocialIcon = ({ children, href }) => (
  <motion.a
    href={href}
    className="text-white hover:text-[#c8a75c] transition duration-300 border rounded border-[#FBFBFB] w-10 h-10 flex justify-center items-center"
    variants={socialIconVariants}
    whileHover="hover"
  >
    {children}
  </motion.a>
);