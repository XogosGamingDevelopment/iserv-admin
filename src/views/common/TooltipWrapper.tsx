import React, { useEffect, useRef } from "react";
import Tooltip from "bootstrap/js/dist/tooltip";

interface TooltipWrapperProps {
  title?: string;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  title = "",
  children,
  placement = "top",
}) => {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const tooltipInstance = useRef<Tooltip | null>(null);

  useEffect(() => {
    const el = tooltipRef.current;
    if (!el) return;

    // Dispose old tooltip safely
    if (tooltipInstance.current) {
      try {
        tooltipInstance.current.dispose();
      } catch {}
      tooltipInstance.current = null;
    }

    tooltipInstance.current = new Tooltip(el, {
      trigger: "hover focus",
      placement,
      title,
    });

    const instance = tooltipInstance.current;

    const safeHide = () => {
      if (!instance || !tooltipRef.current) return;
      if (!document.body.contains(tooltipRef.current)) return;

      try {
        instance.hide();
      } catch {}
    };

    el.addEventListener("mouseleave", safeHide);
    el.addEventListener("blur", safeHide);
    el.addEventListener("click", safeHide);

    const handleDocumentClick = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) {
        safeHide();
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        safeHide();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      el.removeEventListener("mouseleave", safeHide);
      el.removeEventListener("blur", safeHide);
      el.removeEventListener("click", safeHide);
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      try {
        tooltipInstance.current?.dispose();
      } catch {}
      tooltipInstance.current = null;
    };
  }, [title, placement]);

  return (
    <span
      ref={tooltipRef}
      data-bs-toggle="tooltip"
      className="inline-block align-middle"
      style={{ cursor: "pointer" }}
    >
      {children}
    </span>
  );
};

export default TooltipWrapper;