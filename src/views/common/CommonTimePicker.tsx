import React, { useEffect, useState } from "react";
import helpers from "../../_helpers/common";

interface TimeProps {
  field_name: string;
  handleInputChange: (event: { name: string; value: string }) => void;
}

const CommonTimePicker: React.FC<TimeProps> = ({
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
            enableTime: true,
            noCalendar: true,
            dateFormat: "H:i",
            onChange: (selectedDates: Date[]) => {
              if (selectedDates.length > 0) {
                //console.log('selectedDates', selectedDates[0].toISOString());
                const startTime = helpers.convertDateTime(
                  selectedDates[0],
                  "HH:mm"
                );
                setSelectedDate(startTime);
                handleInputChange({ name: field_name, value: startTime });
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
      <i className="ki-outline ki-time position-absolute ms-4 mb-1 fs-2"></i>
      <input
        type="text"
        className="form-control form-control-solid ps-12"
        value={selectedDate}
        id={field_name}
        name={field_name}
        placeholder="Pick a time"
        readOnly={true}
      />
    </div>
  );
};

export default CommonTimePicker;
