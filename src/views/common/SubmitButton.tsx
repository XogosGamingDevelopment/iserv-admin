import React from "react";

type SubmitButtonProps = {
  isSubmitting: boolean;
  onClick: () => void;
  label?: string;
  disabled?: boolean;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  onClick,
  label = "Submit",
  disabled = false,
}) => {
  return (
    <div className="d-grid mb-10">
      {!isSubmitting ? (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onClick}
          disabled={disabled}
        >
          <span className="indicator-label">{label}</span>
        </button>
      ) : (
        <button type="button" className="btn btn-primary" disabled>
          <span className="indicator-progress" style={{ display: "block" }}>
            Please wait...
            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
          </span>
        </button>
      )}
    </div>
  );
};

export default SubmitButton;
