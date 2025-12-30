import React, { useEffect, useRef } from "react";
import useAxios from "../../../hooks/useAxios";

interface MetronicSelect2Props {
  handleInputChange: (event: { name: string; value: string }) => void;
  reset: boolean; // Prop to trigger reset
}

const SearchNpo: React.FC<MetronicSelect2Props> = ({
  handleInputChange,
  reset,
}) => {
  const axiosInstance = useAxios();
  const selectRef = useRef<HTMLSelectElement | null>(null); // Ref for Select2

  useEffect(() => {
    const $select = (window as any).$(selectRef.current); // Use ref for Select2 initialization

    if ($select.length && typeof $select.select2 === "function") {
      // Initialize Select2 with server-side search
      $select.select2({
        placeholder: "Select NPO",
        allowClear: true,
        width: "100%",
        ajax: {
          transport: async (
            params: any,
            success: (data: any) => void,
            failure: (error: any) => void
          ) => {
            try {
              const { term } = params.data;
              const response: any = await axiosInstance({
                url: "users/get-npo-dropdown-list",
                method: "GET",
                params: { search_string: term },
              });
              //console.log('npo search response', response)
              if (!response.error) {
                success({
                  results: response.data.npolists.map((item: any) => ({
                    id: item._id,
                    text: item.organization_name,
                  })),
                  pagination: {
                    more: response.data.hasMore,
                  },
                });
              } else {
                failure(response.message);
              }
            } catch (error: any) {
              console.error("Error in serach npo api request:", error);
            }
          },
          delay: 250, // Add delay to reduce API calls
          cache: true,
        },
      });

      // Handle Select2 change event
      $select.on("change", (e: any) => {
        const value = $select.val() as string;
        const name = $select.attr("name") || "";
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleInputChange]);

  // Reset Select2 when `reset` prop changes
  useEffect(() => {
    if (reset && selectRef.current) {
      const $select = (window as any).$(selectRef.current);
      $select.val(null).trigger("change"); // Reset Select2
    }
  }, [reset]);

  return (
    <select
      ref={selectRef} // Use ref to reference the select element
      className="form-select form-select-sm"
      data-control="select2"
      name="npo_id"
      aria-hidden="true"
    >
      <option value="">Select NPO</option>
    </select>
  );
};

export default SearchNpo;
