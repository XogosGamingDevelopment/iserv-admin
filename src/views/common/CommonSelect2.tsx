import React, { useEffect } from "react";

interface MetronicSelect2Props {
  options: string[];
  multiple?: boolean;  
  handleInputChange: (event: { name: string; value: string }) => void;
}

const MetronicSelect2: React.FC<MetronicSelect2Props> = ({ options, multiple, handleInputChange }) => {

  useEffect(() => {
    // Accessing globally loaded jQuery
    const $select = (window as any).$('[data-control="select2"]');

    if ($select.length && typeof $select.select2 === "function") {
      // Initialize Select2
      $select.select2({
        placeholder: "Select Registration Status",
        allowClear: true,
        minimumResultsForSearch: -1, // Disable search box
        width: "100%",
      });

      // Attach change event
      $select.on("change", (e: any) => {
        const value = $select.val() as string;
        const name = $select.attr("name") || "";
        console.log(`Changed: ${name} => ${value}`);
        handleInputChange({ name, value });
      });
    } else {
      console.error("Select2 is not available");
    }

    // Cleanup on unmount
    return () => {
      if ($select.length) {
        $select.off("change");
        $select.select2("destroy");
      }
    };
  }, [handleInputChange]);

  return (
    <div className="col-md-4">
      <label className="fs-6 fw-semibold mb-2">Status</label>
      <select
        className="form-select form-select-sm"
        data-control="select2"
        name="status"
        aria-hidden="true"
      >
        <option value="">Select Registration Status</option>
        <option value="0">Inactive</option>
        <option value="1">Active</option>
        <option value="2">Pending</option>
        <option value="3">Not Registered</option>
      </select>
      <div className="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"></div>
    </div>
  );
};

export default MetronicSelect2;
