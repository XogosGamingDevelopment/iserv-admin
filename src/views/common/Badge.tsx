import React from "react";

interface BadgeProps {
  status: number;
  text: string;
}

const badgeClasses = [
  "badge-light-warning",
  "badge-light-success",
  "badge-light-danger",
  "badge-light-primary",
];

const Badge: React.FC<BadgeProps> = ({ status, text }) => {
  const className = badgeClasses[status] || "badge-light-secondary";
  return <span className={`badge py-2 px-3 fs-7 ${className}`}>{text}</span>;
};

export default Badge;
