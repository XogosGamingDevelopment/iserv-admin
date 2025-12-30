import React, { useEffect, useRef } from 'react';

interface TooltipWrapperProps {
  title: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ title, children, placement = 'top' }) => {
  const tooltipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const $ = (window as any).$;

    if (tooltipRef.current) {
      const $tooltip = $(tooltipRef.current);

      $tooltip.tooltip({
        trigger: 'hover focus',
        placement: placement,
        title: title,
      });

      // Hide on click to prevent stuck tooltip
      $tooltip.on('click', () => {
        if ($tooltip.data('bs.tooltip')) {
          $tooltip.tooltip('hide');
        }
      });

      return () => {
        $tooltip.tooltip('dispose');
        $tooltip.off('click');
      };
    }
  }, [title, placement,children]);

  return (
    <span ref={tooltipRef} data-bs-toggle="tooltip">
      {children}
    </span>
  );
};

export default TooltipWrapper;