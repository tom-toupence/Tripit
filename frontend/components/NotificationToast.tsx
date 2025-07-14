import { useEffect } from "react";

export default function NotificationToast({
  message,
  type,
  isVisible,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}) {
  // Déclencher le timeout dès que isVisible passe à true
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // 10 secondes

      return () => clearTimeout(timer); // Nettoyage si composant démonte
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`rounded-xl px-6 py-4 text-white text-lg font-semibold shadow-lg transition-all duration-500
        ${type === "success" ? "bg-green-500" : "bg-red-500"}
      `}
      style={{ minWidth: "280px", maxWidth: "90vw", textAlign: "center" }}
    >
      {message}
    </div>
  );
}
