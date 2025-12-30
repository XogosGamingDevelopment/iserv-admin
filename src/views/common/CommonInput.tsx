import React, { useState } from "react";

type InputFieldProps = {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  className?: string;
  limit?: number;
};

const CommonInput: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  className,
  onKeyDown,
  limit,
}) => {
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const isPassword = type === "password";

  return (
    <div className="position-relative mb-8 fv-row">
      {name === "description" ? (
        <div className="mb-8 fv-row">
          <textarea
            className={`form-control ${error ? "is-invalid" : ""} ${
            className ?? ""
          }`}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={4}
            maxLength={500}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      ) : (
        <>
        <input
          type={showPassword ? "text" : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoComplete={autoComplete}
          className={`form-control ${error ? "is-invalid" : ""} ${
            className ?? ""
          }`}
          maxLength={limit}
        />
        {error && <div className="invalid-feedback">{error}</div>}
        </>
        
      )}

      {/* Password Toggle Button */}
      {isPassword && (
        <button
          type="button"
          className="position-absolute border-0 bg-white text-gray-500"
          style={{
            right: "10px",
            top: "10px",
          }}
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
        >
          {showPassword ? (
            // Eye Off
            <svg
              className="shrink-0 size-4"
              style={{
                width: "24",
                height: "24",
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.94 17.94A10.97 10.97 0 0 1 12 19c-7 0-10-7-10-7a17.3 17.3 0 0 1 3.08-4.21"></path>
              <path d="M1 1l22 22"></path>
              <path d="M9.53 9.53a3 3 0 0 0 4.24 4.24"></path>
              <path d="M12 5c2.21 0 4.15.9 5.66 2.34A16.9 16.9 0 0 1 21.9 12c-.35.57-.76 1.13-1.22 1.66"></path>
              <path d="M14.12 14.12a3 3 0 0 0-4.24-4.24"></path>
            </svg>
          ) : (
            // Eye
            <svg
              className="shrink-0 size-4"
              style={{
                width: "24",
                height: "24",
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          )}
        </button>
      )}

      
    </div>
  );
};

export default CommonInput;
