import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiDownload } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const { t } = useTranslation();
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          aria-modal="true"
          role="dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleModalClick}
          />
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full mx-4 p-6 relative animate-fadeIn"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              scale: isShaking ? 1.05 : 1,
              rotate: isShaking ? [-1, 1, -1, 1, 0] : 0
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: isShaking ? 0.3 : 0.25, 
              type: "spring", 
              bounce: isShaking ? 0.3 : 0.2 
            }}
          >
            <button
              className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-4xl font-bold shadow-lg hover:bg-primary hover:text-white focus:outline-none focus:ring-4 focus:ring-primary/40 transition-all duration-200 group"
              onClick={onClose}
              aria-label="Bezárás"
            >
              <span className="leading-none group-hover:text-red-500 transition-colors duration-200">&times;</span>
            </button>
            {children}
            <div className="flex flex-row gap-4 justify-center items-center border-t pt-4 border-gray-200 dark:border-gray-700 overflow-x-visible">
              <a
                href="/pdf/cv_pt_en.pdf"
                download
                className="w-36 sm:w-48 md:w-60 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#915EFF] text-white font-semibold shadow hover:bg-purple-600 hover:shadow-lg hover:scale-105 transition-colors duration-150"
              >
                <FiDownload className="mr-2 h-4 w-4 sm:h-6 sm:w-6 text-white" />
                <span className="truncate text-sm sm:text-base">{t('cv.download_en')}</span>
              </a>
              <a
                href="/pdf/cv_pt_hu.pdf"
                download
                className="w-36 sm:w-48 md:w-60 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#915EFF] text-white font-semibold shadow hover:bg-purple-600 hover:shadow-lg hover:scale-105 transition-colors duration-150"
              >
                <FiDownload className="mr-2 h-4 w-4 sm:h-6 sm:w-6 text-white" />
                <span className="truncate text-sm sm:text-base">{t('cv.download_hu')}</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal; 