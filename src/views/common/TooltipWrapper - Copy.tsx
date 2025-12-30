// TooltipWrapper.tsx
import React, { useEffect, useRef } from "react";
import Tooltip from "bootstrap/js/dist/tooltip";

interface TooltipWrapperProps {
  title?: string; // optional
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
    if (!tooltipRef.current) return;

    // dispose any old instance
    if (tooltipInstance.current) {
      tooltipInstance.current.dispose();
    }

    // create tooltip instance
    tooltipInstance.current = new Tooltip(tooltipRef.current, {
      trigger: "hover focus",
      placement,
      title,
    });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        tooltipInstance.current?.hide();
      } else {
        tooltipInstance.current?.dispose();
        tooltipInstance.current = new Tooltip(
          tooltipRef.current as HTMLElement,
          {
            trigger: "hover focus",
            placement,
            title,
          }
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      tooltipInstance.current?.dispose();
      tooltipInstance.current = null;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [title, placement]);

  return (
    <span
      ref={tooltipRef}
      data-bs-toggle="tooltip"
      className="inline-block align-middle"
    >
      {children ?? null}
    </span>
  );
};

export default TooltipWrapper;
