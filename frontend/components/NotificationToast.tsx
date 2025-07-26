import { useEffect, useRef } from "react";

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
  // Timer d'autoclose
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500); // durée visible (ex: 1,5s)
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  // Réf pour pointer le toast
  const toastRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={toastRef}
      // La transition est appliquée ici, sur le conteneur, grâce à la classe Tailwind
      className={`
        rounded-xl px-6 py-4 text-white text-lg font-semibold shadow-lg transition-opacity duration-500
        ${type === "success" ? "bg-green-500" : "bg-red-500"}
        ${isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
      style={{
        minWidth: "280px",
        maxWidth: "90vw",
        textAlign: "center",
      }}
      // (facultatif) pour fermeture manuelle si besoin
      // onClick={onClose}
    >
      {message}
    </div>
  );
}
