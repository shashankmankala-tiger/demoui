"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ImageModalProps {
  src: string;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ src, alt = "", isOpen, onClose }: ImageModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      style={{ zIndex: 9999, animation: "imageModalFadeIn 180ms ease forwards" }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
        aria-label="Close image"
      >
        <X size={18} />
      </button>

      {/* White card — gives small sketches a proper visible footprint */}
      <div
        className="bg-white rounded-2xl overflow-hidden flex items-center justify-center p-6"
        style={{
          maxWidth: "88vw",
          maxHeight: "88vh",
          minWidth: 320,
          minHeight: 320,
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          animation: "imageModalScaleIn 180ms ease forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: "calc(88vw - 48px)",
            maxHeight: "calc(88vh - 48px)",
            minWidth: 260,
            minHeight: 260,
            width: "auto",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>

      <style>{`
        @keyframes imageModalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes imageModalScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
