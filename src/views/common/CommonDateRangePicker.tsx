import React, { useEffect, useState } from "react";
import moment from "moment";

interface DateRangeProps {
  show_label: boolean;
  handleInputChange: (event: { name: string; value: string }) => void;
  value?: string;
}

const CommonDateRangePicker: React.FC<DateRangeProps> = ({
  show_label,
  handleInputChange,
  value,
}) => {
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const $ = (window as any).$;
    const picker = (window as any)
      .$("#kt_daterange_picker")
      .data("daterangepicker");
    if (value === "" || value === undefined) {
      setSelectedDate("");
      handleInputChange({ name: "date_range", value: "" });
      if (picker) {
        picker.setStartDate(moment());
        picker.setEndDate(moment());
        $("#kt_daterange_picker").val(""); // actually clear the input
      }
    }
  }, [value]);

  useEffect(() => {
    const initializeDateRangePicker = () => {
      if ((window as any).$ && (window as any).$.fn.daterangepicker) {
        (window as any).$("#kt_daterange_picker").daterangepicker(
          {
            autoUpdateInput: false,
            locale: {
              format: "YYYY-MM-DD",
              cancelLabel: "Clear",
            },
          },
          function (start: moment.Moment, end: moment.Moment) {
            const dateRange = `${start.format("YYYY-MM-DD")} to ${end.format(
              "YYYY-MM-DD"
            )}`;
            setSelectedDate(dateRange);
            handleInputChange({ name: "date_range", value: dateRange });
          }
        );
        // Handle the "Clear" button click
        (window as any)
          .$("#kt_daterange_picker")
          .on("cancel.daterangepicker", function () {
            setSelectedDate(""); // Clear the input field
            handleInputChange({ name: "date_range", value: "" });
          });
      } else {
        console.warn(
          "jQuery or DateRangePicker is not loaded! Ensure they are installed."
        );
      }
    };

    initializeDateRangePicker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {show_label && (
        <label className="fs-6 fw-semibold mb-2">Select Date Range</label>
      )}
      <input
        type="text"
        value={selectedDate}
        id="kt_daterange_picker"
        className="form-control form-control-sm"
        name="date_range"
        placeholder="Select Date Range"
        readOnly // Prevent manual input
      />
    </>
  );
};

export default CommonDateRangePicker;
