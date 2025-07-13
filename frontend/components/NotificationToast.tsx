"use client";
import { useEffect } from "react";

interface NotificationToastProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}

export default function NotificationToast({
  message,
  type,
  isVisible,
  onClose,
}: NotificationToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000); // 10 secondes
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      aria-live="assertive"
      role="alert"
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-md text-white transition-opacity duration-300 ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
}
