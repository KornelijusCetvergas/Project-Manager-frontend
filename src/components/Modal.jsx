import React, { useEffect } from "react";
import "./Modal.css";

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    function handleEsc(event) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
