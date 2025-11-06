'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoArrowRight, GoArrowLeft } from "react-icons/go";

const Community = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      text: "The journey felt effortless, yet unforgettable. From the captain’s expertise to the crew’s warmth, every moment was beyond expectations.”",
      image: "/images/client01.png",
      name: "Daniel Kennedy",
      location: "New York"
    },
    {
      id: 2,
      text: "The journey felt effortless, yet unforgettable. From the captain’s expertise to the crew’s warmth, every moment was beyond expectations.”",
      image: "/images/client01.png",
      name: "Sarah Johnson",
      location: "London"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Fade Animation Variants
  const fadeVariants = {
    enter: {
      opacity: 0,
      scale: 0.9
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: {
        duration: 0.6,
        ease: "easeIn"
      }
    }
  };

  return (
    <section
      className="relative flex items-center justify-center bg-white bg-auto bg-center bg-no-repeat lg:py-24 py-8 overflow-hidden"
      style={{
        backgroundImage: "url('/images/quote.png')"
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-5 w-full">
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 xl:gap-12 items-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >

          {/* Left Column - Heading, Text and Arrows */}
          <div className="lg:text-left order-1 lg:order-1 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className='flex flex-col gap-6'>
                {/* Mobile - Smaller Heading */}
                <h2 className="text-3xl md:text-6xl lg:text-6xl xl:text-[65px] font-light tracking-wide">
                  From our community.
                </h2>

                {/* Mobile - Smaller Text */}
                <p className="text-base md:text-lg lg:text-xl sm:max-w-5xl leading-relaxed font-light">
                  Luxury told through experience.
                  <br className="hidden sm:block" />
                  These are the words of those who sailed with us.
                </p>
              </div>
            </motion.div>

            {/* Arrows - Center on mobile, left on desktop */}
            <motion.div
              className="flex gap-4 justify-end items-end xl:justify-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.button
                onClick={prevSlide}
                className="p-3 sm:p-4 rounded-full border border-[#D3D3D3] hover:bg-white/10 transition duration-300 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <GoArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </motion.button>
              <motion.button
                onClick={nextSlide}
                className="p-3 sm:p-4 rounded-full border border-[#D3D3D3] hover:bg-white/10 transition duration-300 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <GoArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column - Slider Only */}
          <motion.div
            className="rounded-xl lg:rounded-2xl order-2 lg:order-2 overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="relative min-h-[250px] sm:min-h-[250px] md:min-h-[250px] lg:min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  variants={fadeVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >

                  {/* Slide Text - Responsive Sizes */}
                  <p className="text-2xl md:text-4xl font-light tracking-wide text-[#03066B] xl:leading-11 mb-6">
                    {slides[currentSlide].text}
                  </p>

                  {/* Client Info - Responsive Layout */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <motion.img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].name}
                      className="w-12 h-12 sm:w-14 sm:h-14  rounded-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                    <div>
                      <h4 className="text-base md:text-lg lg:text-xl leading-relaxed font-medium">
                        {slides[currentSlide].name}
                      </h4>
                      <p className="text-base font-light text-[#77747B]">
                        {slides[currentSlide].location}
                      </p>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide Indicators - Responsive */}
            {/* <div className="flex justify-center mt-6 sm:mt-8">
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/30'
                      }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  />
                ))}
              </div>
            </div> */}

          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Community;