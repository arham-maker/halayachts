'use client';

import React, { useRef } from 'react';
import { useInView } from 'framer-motion';

const AnimatedCollectionCard = ({ item, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      className="group relative text-center sm:p-4 p-2 bg-text-secondary rounded-lg shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer"
      style={{
        transform: isInView ? "none" : `translateY(${50 * (index + 1)}px)`,
        opacity: isInView ? 1 : 0,
        transition: `all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) ${index * 0.1}s`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      <div className="relative z-10 flex flex-col sm:gap-2 gap-1">
        <div className="text-2xl md:text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-110">
          {item.number}
        </div>

        <h3 className="text-base md:text-2xl tracking-wider font-light text-white mb-2 transition-transform duration-300 group-hover:translate-y-[-2px]">
          {item.title}
        </h3>
      </div>
      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-white/30 transition-all duration-300" />
    </div>
  );
};

export default AnimatedCollectionCard;