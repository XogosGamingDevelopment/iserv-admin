import React from "react";
import TooltipWrapper from "./TooltipWrapper";

interface filterBtnProps {
  handleFilter: () => void;
  handleReset: () => void;
}

export const FilterButton: React.FC<filterBtnProps> = ({
  handleFilter,
  handleReset,
}) => {
  return (
    <div className="col-md-2">
      <TooltipWrapper title="Search" placement="top">
        <button
          className="btn btn-sm btn-icon btn-light btn-active-light-primary w-35px h-35px me-2"
          onClick={handleFilter}
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
          onClick={handleReset}
        >
          <i className="ki-duotone ki-cross-circle fs-3">
            <span className="path1"></span>
            <span className="path2"></span>
          </i>
        </button>
      </TooltipWrapper>
    </div>
  );
};
