import React, { useState, useEffect } from "react";
import { CommonSearchInput } from "../../common";
import { Dropdown } from "../../common/Dropdown";
import {
  studentApprovalStatus,
  studentStatus,
} from "../../../constants/status";
import { FilterButton } from "../../common/filterButton";

// Interface for component props
interface SearchFormProps {
  searchForm: {
    search_string: string;
    approval_status: string;
    status: string;
  };
  setSearchForm: React.Dispatch<
    React.SetStateAction<{
      search_string: string;
      approval_status: string;
      status: string;
    }>
  >;
  handleSearchClick: (form: {
    search_string: string;
    approval_status: string;
    status: string;
  }) => void; // Pass latest form values
}

const defaultForm = {
  search_string: "",
  approval_status: "",
  status: "",
};

const SearchForm: React.FC<SearchFormProps> = ({
  searchForm,
  setSearchForm,
  handleSearchClick,
}) => {
  const [searchError, setSearchError] = useState<string>("");
  const [formChanged, setFormChanged] = useState<boolean>(false); //This is used to control unnecssary call when form is not changed
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false); // Trigger effect after reset
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [resetTooltip, setResetTooltip] = useState<boolean>(false);

  // Handle form input changes
  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    
    const { name, value } = event.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    //on any filter value change then set form changed flag to true
    if (!formChanged) setFormChanged(true);
  };

  // Search handler
  const searchData = () => {
    if (
      !searchForm.approval_status &&
      !searchForm.search_string &&
      !searchForm.status
    ) {
      setSearchError("Please enter at least one filter to search.");
      setTimeout(() => setSearchError(""), 2000);
      return;
    }
    //If search form is not changed then return
    if (!formChanged) {
      return;
    }
    setSearchError("");
    setTriggerSearch(true);
  };

  // Reset handler
  const resetSearch = () => {
    setSearchError("");
    if (!formChanged) {
      setResetTooltip(true);
      setTimeout(() => setResetTooltip(false), 0);
      return;
    }
    setSearchForm(defaultForm);
    setTriggerSearch(true);
    setFormChanged(false);
  };

  // UseEffect to trigger the search after state updates
  useEffect(() => {
    const isChanged =
      searchForm.approval_status !== defaultForm.approval_status ||
      searchForm.search_string !== defaultForm.search_string ||
      searchForm.status !== defaultForm.status;

    setFormChanged(isChanged);

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
          name="search_string"
          placeholder="Enter Name, Email, Phone no"
          value={searchForm.search_string}
          onChange={handleFormInputChange}
          className="form-control-sm"
        />
      </div>
      {/* Approval Status */}
      <Dropdown
        name="approval_status"
        value={searchForm.approval_status}
        onChange={handleFormInputChange}
        options={studentApprovalStatus}
      />
      <Dropdown
        name="status"
        value={searchForm.status}
        onChange={handleFormInputChange}
        options={studentStatus}
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
