import React, { useState, useEffect } from "react";
import { CommonDateRangePicker, TooltipWrapper } from "../../common";
import { ReportedStatus } from "../../../constants/status";
import { Dropdown } from "../../common/Dropdown";

interface SearchFormProps {
  searchForm: {
    can_search: boolean;
    date_range: string;
    reported_status: string;
  };
  setSearchForm: React.Dispatch<
    React.SetStateAction<{
      can_search: boolean;
      date_range: string;
      reported_status: string;
    }>
  >;
  handleSearchClick: (form: {
    can_search: boolean;
    date_range: string;
    reported_status: string;
  }) => void; // Pass latest form values
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchForm,
  setSearchForm,
  handleSearchClick,
}) => {
  const [searchError, setSearchError] = useState<string>("");
  const [formChanged, setFormChanged] = useState<boolean>(false); //This is used to control unnecssary call when form is not changed
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false); //Trigger effect after reset

  // UseEffect to trigger the search after state updates
  useEffect(() => {
    if (triggerSearch) {
      handleSearchClick(searchForm); //Use the latest form values
      setTriggerSearch(false);
    }
  }, [searchForm, triggerSearch, handleSearchClick]);

  const handleDateRangeSelect = (event: { name: string; value: string }) => {
    // console.log('event', event);
    setSearchForm((prev) => ({
      ...prev,
      [event.name]: event.value,
    }));
    if (!formChanged) setFormChanged(true);
  };

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    console.log("name: ",name,"value: ",value);
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    //on any filter value change then set form changed flag to true
    if (!formChanged) setFormChanged(true);
  };

  //Search handler
  const searchData = () => {
    if (!searchForm.date_range && !searchForm.reported_status) {
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

  //Reset handler
  const resetSearch = () => {
    setSearchForm({
      date_range: "",
      reported_status: "",
      can_search: false,
    });
    setSearchError("");
    setTriggerSearch(true); //Trigger effect after state update
  };

  return (
    <div className="row g-2 mb-3">
      <div className="col-md-2">
        <CommonDateRangePicker
          show_label={false}
          handleInputChange={handleDateRangeSelect}
          value={searchForm.date_range}
        />
      </div>
      <Dropdown
        name="reported_status"
        value={searchForm.reported_status}
        onChange={handleFormInputChange}
        options={ReportedStatus}
      />
      <div className="col-md-2">
        <TooltipWrapper title="Search" placement="top">
          <button
            className="btn btn-sm btn-icon btn-light btn-active-light-primary w-35px h-35px me-2"
            onClick={searchData}
          >
            <i className="ki-duotone ki-filter fs-2">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
          </button>
        </TooltipWrapper>
        <TooltipWrapper title="Reset Filter" placement="top">
          <button
            className="btn btn-sm btn-icon btn-light btn-active-light-danger w-35px h-35px me-3"
            onClick={resetSearch}
          >
            <i className="ki-duotone ki-cross-circle fs-3">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
          </button>
        </TooltipWrapper>
      </div>
      {searchError && (
        <div className="text-danger small" style={{ display: "block" }}>
          <div>{searchError}</div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
