"use client";
import React from "react";

interface ConfirmationModalProps {
  title: string;
  message: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function ConfirmationModal({
  title,
  message,
  isOpen,
  onCancel,
  onConfirm,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button onClick={onConfirm} className="btn btn-error">
            {confirmLabel}
          </button>
          <button onClick={onCancel} className="btn">
            {cancelLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
