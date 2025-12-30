import React, { useEffect, useState } from "react";

interface DateProps {
  field_name: string;
  handleInputChange: (event: { name: string; value: string }) => void;
}

const CommonDatePicker: React.FC<DateProps> = ({
  field_name,
  handleInputChange,
}) => {
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const initializeDatePicker = () => {
      if ((window as any).flatpickr) {
        const inputElement = document.getElementById(
          field_name
        ) as HTMLInputElement;
        if (inputElement) {
          (window as any).flatpickr(inputElement, {
            enableTime: false, //Disable time selection
            dateFormat: "Y-m-d", //Format as YYYY-MM-DD
            //mode: "multiple",
            onChange: (selectedDates: Date[]) => {
              if (selectedDates.length > 0) {
                const formattedDate = selectedDates[0]
                  .toISOString()
                  .split("T")[0]; //Convert to YYYY-MM-DD
                setSelectedDate(formattedDate);
                handleInputChange({ name: field_name, value: formattedDate });
              }
            },
          });
          //console.log("Flatpickr initialized successfully");
        }
      } else {
        console.warn("Flatpickr is not loaded! Ensure it's installed.");
      }
    };

    initializeDatePicker();

    return () => {
      const inputElement = document.getElementById(
        field_name
      ) as HTMLInputElement;
      if (inputElement && (window as any).flatpickr) {
        (window as any).flatpickr(inputElement).destroy(); //Destroy instance on unmount
      }
    };
  }, [field_name, handleInputChange]);

  return (
    <div className="position-relative d-flex align-items-center">
      <i className="ki-outline ki-calendar-8 position-absolute ms-4 mb-1 fs-2"></i>
      <input
        type="text"
        className="form-control form-control-solid ps-12 flatpickr-input"
        value={selectedDate}
        id={field_name}
        name={field_name}
        placeholder="Pick a date"
        readOnly={true}
      />
    </div>
  );
};

export default CommonDatePicker;
