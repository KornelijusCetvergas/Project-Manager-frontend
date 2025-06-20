import React, { useState, useRef, useEffect } from "react";
import "./PopupMenu.css";

export default function PopupMenu({ items = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="popup-wrapper" ref={menuRef}>
      <button onClick={() => setIsOpen((prev) => !prev)}>☰ Menu</button>
      {isOpen && (
        <ul className="popup-menu">
          {items.map((item, idx) => (
            <li
              key={idx}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
