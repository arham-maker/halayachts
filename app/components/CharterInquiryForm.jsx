'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiX, FiMapPin, FiClock, FiUser, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';

const STYLES = {
  overlay: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",
  modal: "bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col",
  header: "bg-white p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10",
  heading: "text-2xl md:text-3xl font-light tracking-wide text-gray-900",
  closeButton: "p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700",
  content: "p-6 flex-1 overflow-y-auto",
  formGroup: "mb-6",
  label: "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 tracking-wide",
  input: "w-full px-4 py-3 border border-gray-300 rounded-lg text-base tracking-wide focus:outline-none focus:ring-2 focus:ring-[#c8a75c] focus:border-transparent transition-all",
  textarea: "w-full px-4 py-3 border border-gray-300 rounded-lg text-base tracking-wide focus:outline-none focus:ring-2 focus:ring-[#c8a75c] focus:border-transparent transition-all resize-none",
  select: "w-full px-4 py-3 border border-gray-300 rounded-lg text-base tracking-wide focus:outline-none focus:ring-2 focus:ring-[#c8a75c] focus:border-transparent transition-all bg-white",
  buttonContainer: "p-6 border-t border-gray-200 bg-white sticky bottom-0 flex gap-4",
  button: "flex-1 px-6 py-3 text-base font-medium tracking-wider rounded-lg transition-all duration-300",
  buttonPrimary: "bg-[#c8a75c] text-white hover:bg-[#b8964a] shadow-lg hover:shadow-xl",
  buttonSecondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300",
  buttonDisabled: "bg-gray-300 text-gray-400 cursor-not-allowed",
  icon: "w-4 h-4 text-[#c8a75c]"
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
};

export default function CharterInquiryForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    duration: '',
    message: ''
  });
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch locations from database
  useEffect(() => {
    if (isOpen) {
      async function fetchLocations() {
        try {
          setLoadingLocations(true);
          const response = await fetch('/api/locations', {
            cache: 'no-store',
          });
          
          if (response.ok) {
            const data = await response.json();
            setLocations(data || []);
          }
        } catch (error) {
          console.error('Error fetching locations:', error);
        } finally {
          setLoadingLocations(false);
        }
      }
      fetchLocations();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          location: '',
          duration: '',
          message: ''
        });
      }, 300);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare inquiry data - only form fields
      const inquiryData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        duration: formData.duration,
        message: formData.message || ''
      };

      // Send to inquiries API
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Inquiry submission failed');
      }

      toast.success('Your inquiry has been submitted successfully. Our team will contact you shortly!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Inquiry submission failed:', error);
      toast.error(error.message || 'Failed to submit inquiry. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const durationOptions = [
    { value: '', label: 'Select Duration' },
    { value: '3 hrs', label: '3 Hours' },
    { value: '4 hrs', label: '4 Hours' },
    { value: '6 hrs', label: '6 Hours' },
    { value: '8 hrs', label: '8 Hours' },
    { value: 'Full Day', label: 'Full Day' },
    { value: 'Custom', label: 'Custom Duration' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="charter-inquiry-modal"
          className={STYLES.overlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
          onClick={onClose}
        >
        <motion.div
          className={STYLES.modal}
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={STYLES.header}>
            <h2 className={STYLES.heading}>Inquiry / Book Charter</h2>
            <button
              onClick={onClose}
              className={STYLES.closeButton}
              aria-label="Close"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className={STYLES.content}>
            {/* Name */}
            <div className={STYLES.formGroup}>
              <label className={STYLES.label}>
                <FiUser className={STYLES.icon} />
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={STYLES.input}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div className={STYLES.formGroup}>
              <label className={STYLES.label}>
                <FiMail className={STYLES.icon} />
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={STYLES.input}
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div className={STYLES.formGroup}>
              <label className={STYLES.label}>
                <FiPhone className={STYLES.icon} />
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={STYLES.input}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

            {/* Location */}
            <div className={STYLES.formGroup}>
              <label className={STYLES.label}>
                <FiMapPin className={STYLES.icon} />
                Location *
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={STYLES.select}
                required
              >
                <option key="select-location" value="">Select a location</option>
                {loadingLocations ? (
                  <option key="loading-locations" value="loading" disabled>Loading locations...</option>
                ) : (
                  locations.map((loc, index) => (
                    <option key={loc.id || `location-${index}`} value={loc.title}>
                      {loc.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Charter Duration */}
            <div className={STYLES.formGroup}>
              <label className={STYLES.label}>
                <FiClock className={STYLES.icon} />
                Charter Duration *
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className={STYLES.select}
                required
              >
                {durationOptions.map((option, index) => (
                  <option key={option.value || `duration-${index}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div className={STYLES.formGroup}>
              <label className={STYLES.label}>
                <FiMessageSquare className={STYLES.icon} />
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className={STYLES.textarea}
                rows="4"
                placeholder="Tell us about your charter requirements, preferred dates, or any special requests..."
              />
            </div>

            {/* Buttons */}
            <div className={STYLES.buttonContainer}>
              <button
                type="button"
                onClick={onClose}
                className={`${STYLES.button} ${STYLES.buttonSecondary}`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${STYLES.button} ${STYLES.buttonPrimary} ${isSubmitting ? STYLES.buttonDisabled : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </div>
          </form>
        </motion.div>
        </motion.div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AnimatePresence>
  );
}

