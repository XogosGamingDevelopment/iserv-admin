import React, { useState, useEffect } from 'react';
import { CommonSearchInput, TooltipWrapper } from "../../common";

// Interface for component props
interface SearchFormProps {
  searchForm: {
    search_string: string;
	approval_status: string;
    status: string;
  };
  setSearchForm: React.Dispatch<React.SetStateAction<{
    search_string: string;
	approval_status: string;
    status: string;
  }>>;
  handleSearchClick: (form: {
    search_string: string;
	approval_status: string;
    status: string;
  }) => void;   // Pass latest form values
}
const SearchForm: React.FC<SearchFormProps> = ({ searchForm, setSearchForm, handleSearchClick}) => {
  const [searchError, setSearchError] = useState<string>('');
  const [formChanged, setFormChanged] = useState<boolean>(false);//This is used to control unnecssary call when form is not changed
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false);  // Trigger effect after reset

  // Handle form input changes
  const handleFormInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value
    }));
	//on any filter value change then set form changed flag to true
	if(!formChanged) setFormChanged(true);
  };
  
  
  /*const handleDateRangeChange = (event: { name: string; value: string }) => {
    const { name, value } = event;
    console.log('date range input name', name);
    console.log('date range input value', value);
  };*/

  // Search handler
  const searchData = () => {
    if (!searchForm.approval_status && !searchForm.search_string && !searchForm.status) {
      setSearchError('Please enter at least one filter to search.');
      return;
    }
	//If search form is not changed then return
	if(!formChanged){
		return;
	}
    //console.log('Searching with:', searchForm);
    setSearchError('');
	setTriggerSearch(true);
	setFormChanged(false);
  };

  // Reset handler
  const resetSearch = () => {
    setSearchForm({
      search_string: '',
	  approval_status: '',
      status: '',
    });
    setSearchError('');
	setTriggerSearch(true);
  };
  
   // UseEffect to trigger the search after state updates
  useEffect(() => {
    if (triggerSearch) {
      handleSearchClick(searchForm);  // Use the latest form values
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
			{/*<div className="col-md-2">
		  <select className="form-select form-select-sm" name="approval_status" value={searchForm.approval_status} onChange={handleFormInputChange}>
			<option value="">Select Approval Status</option>
			<option value="0">Pending</option>
			<option value="1">Approved</option>
			<option value="2">Disapproved</option>
		  </select>
			</div>*/}
		<div className="col-md-2">
		  <select className="form-select form-select-sm" name="status" value={searchForm.status} onChange={handleFormInputChange}>
			<option value="">Select Status</option>
			<option value="0">Inactive</option>
			<option value="1">Active</option>
			<option value="2">Blocked</option>
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
		{/* Display search error */}
		{searchError && (
		  <div className="text-danger small" style={{ display: 'block' }}>
			<div>{searchError}</div>
		  </div>
		)}
	</div>
  );
};

export default SearchForm;