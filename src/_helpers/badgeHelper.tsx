import React from "react";
import { Badge } from "../views/common";

const badges = {
  adminApprovalBadge: (status: number | undefined, text: string | undefined) => (
    <BadgeWrapper status={status ?? 0} text={text ?? ''} />
  ),
  userStatusBadge: (status: number | undefined, text: string | undefined) => (
    <BadgeWrapper status={status ?? 0} text={text ?? ''} />
  ),
  npoRegistrationStatusBadge: (status: number | undefined, text: string | undefined) => (
    <BadgeWrapper status={status ?? 0} text={text ?? ''} />
  ),
  eventStatusBadge: (status: number | undefined, text: string | undefined) => (
    <BadgeWrapper status={status ?? 0} text={text ?? ''} />
  ),
};

// Wrapper to ensure the correct type inference
const BadgeWrapper: React.FC<{ status: number; text: string }> = ({ status, text }) => {
  return <Badge status={status ?? 0} text={text ?? ''} />;
};

export default badges;