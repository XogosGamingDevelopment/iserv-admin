import React, { useState, useEffect } from 'react';
import { CommonSearchInput, TooltipWrapper } from "../../common";

interface SearchFormProps {
  searchForm: {
    search_string: string;
    status: string;
    is_verified: string;
  };
  setSearchForm: React.Dispatch<React.SetStateAction<{
    search_string: string;
    status: string;
    is_verified: string;
  }>>;
  handleSearchClick: (form: {
    search_string: string;
    status: string;
    is_verified: string;
  }) => void;   // Pass latest form values
}

const SearchForm: React.FC<SearchFormProps> = ({ searchForm, setSearchForm, handleSearchClick }) => {
  const [searchError, setSearchError] = useState<string>('');
  const [formChanged, setFormChanged] = useState<boolean>(false);//This is used to control unnecssary call when form is not changed
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false);//Trigger effect after reset

  // UseEffect to trigger the search after state updates
  useEffect(() => {
    if (triggerSearch) {
      handleSearchClick(searchForm);//Use the latest form values
      setTriggerSearch(false);
    }
  }, [searchForm, triggerSearch, handleSearchClick]);

  // Handle form input changes
  const handleFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value
    }));
	//on any filter value chnage then set form changed flag to true
	if(!formChanged) setFormChanged(true);
  };

  //Search handler
  const searchData = () => {
    if (!searchForm.search_string && !searchForm.status && !searchForm.is_verified) {
      setSearchError('Please enter at least one filter to search.');
      return;
    }
	  //If search form is not changed then return
	  if(!formChanged){
		  return;
	  }
    setSearchError('');
    setTriggerSearch(true);//Trigger effect after state update
	  setFormChanged(false);
  };

  //Reset handler
  const resetSearch = () => {
    setSearchForm({
      search_string: '',
      status: '',
      is_verified: ''
    });
    setSearchError('');
    setTriggerSearch(true);//Trigger effect after state update
  };

  return (
      <div className="row g-2 mb-3">
        <div className="col-md-2">
          <CommonSearchInput
            type="text"
            name="search_string"
            placeholder="Enter email to search"
            value={searchForm.search_string}
            onChange={handleFormInputChange}
			      className="form-control-sm"
          />
        </div>
        <div className="col-md-2">
          <select className="form-select form-select-sm" name="status" value={searchForm.status} onChange={handleFormInputChange}>
            <option value="">Select Status</option>
            <option value="0">Inactive</option>
            <option value="1">Active</option>
          </select>
        </div>
		<div className="col-md-2">
          <select className="form-select form-select-sm" name="is_verified" value={searchForm.is_verified} onChange={handleFormInputChange}>
            <option value="">Select Is Verified</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
        <div className="col-md-2">
          <TooltipWrapper title="Search" placement="top">
            <button className="btn btn-sm btn-icon btn-light btn-active-light-primary w-35px h-35px me-2" onClick={searchData}>
              <i className="ki-duotone ki-filter fs-2">
			    <span className="path1"></span>
				<span className="path2"></span>
			  </i>
            </button>
          </TooltipWrapper>
          <TooltipWrapper title="Reset Filter" placement="top">
            <button className="btn btn-sm btn-icon btn-light btn-active-light-danger w-35px h-35px me-3" onClick={resetSearch}>
              <i className="ki-duotone ki-cross-circle fs-3">
			    <span className="path1"></span>
			    <span className="path2"></span>
			  </i>
            </button>
          </TooltipWrapper>
        </div>
        {searchError && (
          <div className="text-danger small" style={{ display: 'block' }}>
            <div>{searchError}</div>
          </div>
        )}
      </div>
  );
};

export default SearchForm;