'use client';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut"
    }
  }),
  hover: {
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(84, 44, 105, 0.3)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const shimmerVariants = {
  initial: {
    x: "-100%",
  },
  hover: {
    x: "100%",
    transition: {
      duration: 0.8,
      ease: "easeInOut"
    }
  }
};

const AnimatedCard = ({ feature, index, children }) => {
  return (
    <motion.div
      className="bg-text-secondary rounded-lg lg:p-9 sm:p-6 p-5 text-white relative overflow-hidden"
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover="hover"
      variants={cardVariants}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
        variants={shimmerVariants}
        initial="initial"
        whileHover="hover"
      />
      {children}
    </motion.div>
  );
};

export default AnimatedCard;