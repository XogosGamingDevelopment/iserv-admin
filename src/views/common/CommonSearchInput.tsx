import React from "react";

type InputFieldProps = {
  type: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  className?: string;
};

const CommonSearchInput: React.FC<InputFieldProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  className,
}) => {
  return (
    <div className="">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`form-control ${error ? "is-invalid" : ""} ${
          className ?? ""
        }`}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default CommonSearchInput;
