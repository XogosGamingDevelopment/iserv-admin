import React, { useState, useEffect } from "react";
import SearchNpo from "./SearchNpo";
import { CommonSearchInput } from "../../common";
import { Dropdown } from "../../common/Dropdown";
import { EventApprovalStatus, EventStatus } from "../../../constants/status";
import { FilterButton } from "../../common/filterButton";

interface SearchFormProps {
  searchForm: {
    npo_id: string;
    search_string: string;
    event_status: string;
    approval_status: string;
  };
  setSearchForm: React.Dispatch<
    React.SetStateAction<{
      npo_id: string;
      search_string: string;
      event_status: string;
      approval_status: string;
    }>
  >;
  handleSearchClick: (form: {
    npo_id: string;
    search_string: string;
    event_status: string;
    approval_status: string;
  }) => void; // Pass latest form values
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchForm,
  setSearchForm,
  handleSearchClick,
}) => {
  const [resetselect2, setResetSelect2] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>("");
  const [formChanged, setFormChanged] = useState<boolean>(false); //This is used to control unnecssary call whrn form is not changed
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false); //Trigger effect after reset

  // Handle NPO select change
  const handleSelectNpo = (event: { name: string; value: string }) => {
    const { name, value } = event;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setResetSelect2(false);
    //on any filter value chnage then set form changed flag to true
    if (!formChanged) setFormChanged(true);
  };

  // Handle form input changes
  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    //on any filter value chnage then set form changed flag to true
    if (!formChanged) setFormChanged(true);
  };

  // Search handler
  const searchData = () => {
    if (
      !searchForm.npo_id &&
      !searchForm.search_string &&
      !searchForm.event_status &&
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
    setTriggerSearch(true); //Trigger effect after state update
    setFormChanged(false);
  };

  // Reset handler
  const resetSearch = () => {
    setSearchForm({
      npo_id: "",
      search_string: "",
      event_status: "",
      approval_status: "",
    });
    setSearchError("");
    setResetSelect2(true);
    setTriggerSearch(true); // Trigger effect after state update
    console.log("Filters reset.");
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
        <SearchNpo handleInputChange={handleSelectNpo} reset={resetselect2} />
      </div>
      <div className="col-md-2">
        <CommonSearchInput
          type="text"
          name="search_string"
          placeholder="Enter keyword to search"
          value={searchForm.search_string}
          onChange={handleFormInputChange}
          className="form-control-sm"
        />
      </div>
      <Dropdown
        name="event_status"
        value={searchForm.event_status}
        onChange={handleFormInputChange}
        options={EventStatus}
      />
      <Dropdown
        name="approval_status"
        value={searchForm.approval_status}
        onChange={handleFormInputChange}
        options={EventApprovalStatus}
      />
      <FilterButton handleFilter={searchData} handleReset={resetSearch} />
      {searchError && (
        <div className="text-danger small" style={{ display: "block" }}>
          <div>{searchError}</div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
