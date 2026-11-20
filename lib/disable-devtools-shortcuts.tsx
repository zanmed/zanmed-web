"use client";
import { useEffect } from "react";

export default function DisableDevTools() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F12") {
        e.preventDefault();
      }
      if (
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "J", "C"].includes(e.key.toUpperCase())
      ) {
        e.preventDefault();
      }
      if (e.ctrlKey && e.key.toUpperCase() === "U") {
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return null;
}
