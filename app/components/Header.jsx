'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ContactForm from './ContactForm'; // Adjust the path as needed

// Custom hook for scroll lock
const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.paddingRight = '';
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.paddingRight = '';
      document.body.style.overflow = 'unset';
    };
  }, [isLocked]);
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Use scroll lock hook for mobile menu
  useScrollLock(isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Locations', href: '/location' },
    { name: 'Charter', href: '/charter' },
    { name: 'About Us', href: '/about' }
  ];

  const headerVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.1,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.1,
        ease: "easeInOut"
      }
    }
  };

  const menuPanelVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300
      }
    }
  };

  const menuItemVariants = {
    closed: {
      x: 50,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  const handleContactClick = () => {
    setIsContactOpen(true);
    setIsMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        <motion.header
          className="fixed top-0 left-0 right-0 z-50 bg-transparent"
          initial="visible"
          animate={isScrolled ? "hidden" : "visible"}
          variants={headerVariants}
        >
          <div className="max-w-7xl mx-auto px-5">
            <div className="flex justify-between items-center h-16 md:h-20">

              <div className="flex-shrink-0">
                <Link href="/">
                  <img
                    src="/images/logo.png"
                    alt="Hala Yachts"
                    className="h-[60px] w-[100px] sm:h-[81px] sm:w-[152px]"
                  />
                </Link>
              </div>

              <nav className="hidden lg:flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-white hover:text-gray-300 transition duration-300 font-medium text-sm lg:text-base tracking-wider"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="hidden lg:block">
                <button 
                  onClick={handleContactClick}
                  className="bg-text-primary text-base text-white p-3 tracking-wide md:text-base font-medium rounded cursor-pointer hover:bg-opacity-90 transition duration-300"
                >
                  Contact Us
                </button>
              </div>

              <div className="flex items-center gap-4 lg:hidden">
                <button
                  onClick={handleMenuToggle}
                  className="text-white hover:text-gray-300 transition duration-300 z-60"
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={overlayVariants}
                  onClick={handleMenuClose}
                />

                {/* Menu Panel */}
                <motion.div
                  className="fixed top-0 right-0 bottom-0 w-64 bg-black/95 backdrop-blur-md z-50 lg:hidden shadow-2xl flex flex-col"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={menuPanelVariants}
                >
                  <div className="flex-1 pt-20 px-6">
                    <nav className="flex flex-col space-y-6">
                      {navItems.map((item, index) => (
                        <motion.div
                          key={item.name}
                          custom={index}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={menuItemVariants}
                        >
                          <Link
                            href={item.href}
                            className="text-white hover:text-gray-300 transition duration-300 font-light tracking-wider text-base py-3 border-b border-gray-700 flex items-center justify-between group"
                            onClick={handleMenuClose}
                          >
                            <span>{item.name}</span>
                            <FiArrowRight className="text-gray-400 group-hover:text-white transition duration-300" size={16} />
                          </Link>
                        </motion.div>
                      ))}
                    </nav>
                  </div>

                  <motion.div
                    className="p-4 border-t border-gray-700"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuItemVariants}
                    custom={navItems.length}
                  >
                    <button 
                      onClick={handleContactClick}
                      className="w-full bg-text-primary text-white py-2.5 px-2.5 tracking-wider font-medium rounded cursor-pointer hover:bg-opacity-90 transition duration-300"
                    >
                      Contact Us
                    </button>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.header>
      </AnimatePresence>

      <ContactForm 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
      />
    </>
  );
};

export default Header;