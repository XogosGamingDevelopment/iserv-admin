import React, { useState, useEffect } from "react";
import { CommonDateRangePicker } from "../../common";
import {
  EventInterest,
  EventAgeGroup,
} from "../../../types/interfaces";
import useAxios from "../../../hooks/useAxios";
import { FilterButton } from "../../common/filterButton";

// Define search form state structure
interface SearchFormState {
  age_group: string;
  date_range: string;
  interest: string; // Multiple selection
}

interface SearchFormProps {
  searchForm: SearchFormState;
  setSearchForm: React.Dispatch<React.SetStateAction<SearchFormState>>;
  handleSearchClick: (form: SearchFormState) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchForm,
  setSearchForm,
  handleSearchClick,
}) => {
  const axiosInstance = useAxios();
  const [searchError, setSearchError] = useState<string>("");
  const [formChanged, setFormChanged] = useState<boolean>(false);
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false);
  const [intrestData, setIntrestData] = useState<EventInterest[]>([]);
  const [ageGroup, setAgeGroup] = useState<EventAgeGroup[]>([]);

  // Fetch filter options on mount
  useEffect(() => {
    getFilterData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFilterData = async () => {
    try {
      const response: any = await axiosInstance({
        url: `events/get-form-data/0`,
        method: "GET",
      });

      if (!response.error) {
        setIntrestData(response.data.interestlists || []);
        setAgeGroup(response.data.eventAgeGroup || []);
      }
    } catch (error: any) {
      console.error("Error fetching filter data:", error);
    }
  };

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (!formChanged) setFormChanged(true);
  };

  /*const handleInterestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSearchForm(prev => ({
      ...prev,
      interest: selected
    }));
    if (!formChanged) setFormChanged(true);
  };*/

  const searchData = () => {
    if (
      !searchForm.age_group &&
      !searchForm.date_range &&
      !searchForm.interest
    ) {
      setSearchError("Please enter at least one filter to search.");
      return;
    }
    if (!formChanged) return;

    setSearchError("");
    setTriggerSearch(true);
    setFormChanged(false);
  };

  const resetSearch = () => {
    setSearchForm({
      age_group: "",
      date_range: "",
      interest: "",
    });
    setSearchError("");
    setTriggerSearch(true);
  };

  useEffect(() => {
    if (triggerSearch) {
      handleSearchClick(searchForm);
      setTriggerSearch(false);
    }
  }, [searchForm, triggerSearch, handleSearchClick]);

  const handleDateRangeSelect = (event: { name: string; value: string }) => {
    console.log("event", event);
    setSearchForm((prev) => ({
      ...prev,
      [event.name]: event.value,
    }));
    if (!formChanged) setFormChanged(true);
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
      <div className="col-md-2">
        <select
          className="form-select form-select-sm"
          name="age_group"
          value={searchForm.age_group}
          onChange={handleFormInputChange}
        >
          <option value="">Select Age Group</option>
          {(ageGroup ?? []).map((item) => (
            <option key={item._id} value={item._id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-2">
        <select
          className="form-select form-select-sm"
          name="interest"
          value={searchForm.interest}
          onChange={handleFormInputChange}
        >
          <option value="">Select Interest</option>
          {(intrestData ?? []).map((item) => (
            <option key={item._id} value={item._id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      <FilterButton handleFilter={searchData} handleReset={resetSearch} />

      {searchError && (
        <div className="text-danger small" style={{ display: "block" }}>
          {searchError}
        </div>
      )}
    </div>
  );
};

export default SearchForm;
