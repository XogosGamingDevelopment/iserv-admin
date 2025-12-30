// React and Hooks
import React, { useEffect, useState } from "react";

//Components and status object
import { CommonSearchInput } from "../../common";
import { FilterButton } from "../../common/filterButton";
import { Dropdown } from "../../common/Dropdown";
import { BadgeFor, BadgeListStatus } from "../../../constants/status";

interface SearchFormProps {
  searchForm: {
    search_string: string;
    status: string;
    badge_for: string;
  };
  setSearchForm: React.Dispatch<
    React.SetStateAction<{
      search_string: string;
      status: string;
      badge_for: string;
    }>
  >;
  handleSearchClick: (form: { search_string: string; status: string }) => void; //Pass latest form values
}

const SearchForm: React.FC<SearchFormProps> = (props) => {
  const { searchForm, setSearchForm, handleSearchClick } = props || {}; //destructure data from props and prevent from crash
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

  //Search handler
  const searchData = () => {
    if (!searchForm.search_string && !searchForm.status && !searchForm.badge_for) {
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

  const resetSearch = () => {
    setSearchForm({
      search_string: "",
      status: "",
      badge_for: "",
    });
    setSearchError("");
    setTriggerSearch(true); //Trigger effect after state update
  };

  return (
    <div className="row g-2 mb-3">
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
        name="status"
        value={searchForm.status}
        onChange={handleFormInputChange}
        options={BadgeListStatus}
      />
      <Dropdown
        name="badge_for"
        value={searchForm.badge_for}
        onChange={handleFormInputChange}
        options={BadgeFor}
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
