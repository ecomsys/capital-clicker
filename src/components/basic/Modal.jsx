// src/components/basic/Modal.jsx

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useModalStore from "@/stores/useModalStore";
import { cn } from "@/lib/utils";

export default function Modal({ className, closeOnBackdropClick = true }) {
  const { isOpen, content, onClose, closeModal } = useModalStore();

  const handleClose = () => {
    if (onClose) onClose();
    closeModal();
  };

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) handleClose();
  };

  // Блокируем скролл body при открытой модалке
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-1000 bg-black/70 "
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 z-1000 flex items-end justify-center pointer-events-none sm:inset-0 sm:items-center "
          >
            <div
              className={cn(
                "relative pointer-events-auto w-full ",
                "bg-[#121212]",
                "rounded-t-[1.5rem] sm:rounded-[1.5rem]",
                "border-t border-[#fe8d00] sm:border-t-0 sm:border",
                "shadow-[0_-0.625rem_1.875rem_0_#fe8d00] sm:shadow-[0_0_1.875rem_0_#fe8d00]",
                "max-w-full",
                className,
              )}
            >
              {/* CloseBtn */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 sm:right-6 sm:top-6 text-white/30 hover:text-white transition-colors z-10"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Content */}
              <div className="min-h-[inherit] max-h-[80vh] sm:max-h-[97vh] overflow-y-auto scroll-hide">
                {content}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
