import React from "react";

interface DropdownOption {
  value: string;
  name: string;
}

interface DropdownProps {
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  options: DropdownOption[];
}

export const Dropdown: React.FC<DropdownProps> = ({
  name,
  value,
  onChange,
  options,
}) => {
  return (
    <div className="col-md-2">
      <select
        className="form-select form-select-sm"
        name={name}
        value={value}
        onChange={onChange}
      >
        {(options ?? []).map((option, index) => (
          <option key={index} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};
