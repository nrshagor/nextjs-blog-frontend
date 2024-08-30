// Toast.tsx
import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Show toast for 5 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg transition-transform transform ${
        show ? "translate-y-0" : "translate-y-20"
      }`}
      style={{ transition: "transform 0.3s ease-in-out" }}
    >
      {message}
    </div>
  );
};

export default Toast;
