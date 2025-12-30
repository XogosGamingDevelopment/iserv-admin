import React, { useState, useEffect } from "react";
import { CommonSearchInput } from "../../common";
import { FilterButton } from "../../common/filterButton";
import { Dropdown } from "../../common/Dropdown";
import {
  npoApprovalStatus,
  npoRegistrationStatus,
} from "../../../constants/status";

// Interface for component props
interface SearchFormProps {
  searchForm: {
    organisation_name: string;
    search_string: string;
    registration_status: string;
    approval_status: string;
  };
  setSearchForm: React.Dispatch<
    React.SetStateAction<{
      organisation_name: string;
      search_string: string;
      registration_status: string;
      approval_status: string;
    }>
  >;
  handleSearchClick: (form: {
    organisation_name: string;
    search_string: string;
    registration_status: string;
    approval_status: string;
  }) => void; // Pass latest form values
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchForm,
  setSearchForm,
  handleSearchClick,
}) => {
  const [searchError, setSearchError] = useState<string>("");
  const [formChanged, setFormChanged] = useState<boolean>(false); //This is used to control unnecssary call when form is not changed
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false); // Trigger effect after reset

  // Handle form input changes
  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    //on any filter value chnage then set form changed flag to true
    if (!formChanged) setFormChanged(true);
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Search handler
  const searchData = () => {
    if (
      !searchForm.organisation_name &&
      !searchForm.search_string &&
      !searchForm.registration_status &&
      !searchForm.approval_status
    ) {
      setSearchError("Please enter at least one filter to search.");
      return;
    }
    //If search form is not changed then return
    if (!formChanged) {
      return;
    }
    setSearchError("");
    setTriggerSearch(true);
    setFormChanged(false);
  };

  // Reset handler
  const resetSearch = () => {
    setSearchForm({
      organisation_name: "",
      search_string: "",
      registration_status: "",
      approval_status: "",
    });
    setSearchError("");
    setTriggerSearch(true);
  };

  // UseEffect to trigger the search after state updates
  useEffect(() => {
    if (triggerSearch) {
      handleSearchClick(searchForm); // Use the latest form values
      setTriggerSearch(false);
    }
  }, [searchForm, triggerSearch, handleSearchClick]);

  return (
    <div className="row g-2 mb-3">
      <div className="col-md-2">
        <CommonSearchInput
          type="text"
          name="organisation_name"
          placeholder="Enter Organisation Name"
          value={searchForm.organisation_name}
          onChange={handleFormInputChange}
          className="form-control-sm"
        />
      </div>
      <div className="col-md-2">
        <CommonSearchInput
          type="text"
          name="search_string"
          placeholder="Enter contact Name, Email, Phone no"
          value={searchForm.search_string}
          onChange={handleFormInputChange}
          className="form-control-sm"
        />
      </div>
      <Dropdown
        name="registration_status"
        value={searchForm.registration_status}
        onChange={handleFormInputChange}
        options={npoRegistrationStatus}
      />
      <Dropdown
        name="approval_status"
        value={searchForm.approval_status}
        onChange={handleFormInputChange}
        options={npoApprovalStatus}
      />
      <FilterButton handleFilter={searchData} handleReset={resetSearch} />
      {/* Display search error */}
      {searchError && (
        <div className="text-danger small" style={{ display: "block" }}>
          <div>{searchError}</div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
