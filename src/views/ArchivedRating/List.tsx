import React, { useState, useEffect, useRef } from "react";
import SearchForm from "./partials/SearchForm";
import useAxios from "../../hooks/useAxios";
import useCommonActions from "../../hooks/useCommonActions";
import { ReviewSearchFormState, EventReview } from "../../types/interfaces";
import { PageToolbar, RatingStar, TooltipWrapper } from "../common";
import ContentLoader from "../common/ContentLoader";
import Pagination from "../common/Pagination";
import { hasAuthorization } from "../../_helpers/hasAuthorization";
import helpers from "../../_helpers/common";
import badges from "../../_helpers/badgeHelper";

const ReviewList: React.FC = () => {
  const axiosInstance = useAxios();
  const { deleteItem, archiveUnarchiveRating } = useCommonActions();
  const [searchForm, setSearchForm] = useState<ReviewSearchFormState>({
    age_group: "",
    date_range: "",
    interest: "",
  });
  const [results, setResults] = useState<EventReview[] | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialRender = useRef(false);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false; // Mark as rendered
      return; // Skip the first execution
    }
    getListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]); // Dependency array

  const searchData = () => {
    getListData();
  };

  /*Handle pagination data change*/
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ currentPage: page, pageSize });
  };

  const getListData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await axiosInstance({
        url: "rating-feddbacks/archived-review-list",
        method: "GET",
        data: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
          date_range: searchForm.date_range,
          age_group: searchForm.age_group,
          interest: searchForm.interest,
        },
      });
      //console.log('event review approval list response', response);
      if (!response.error) {
        setResults(response.data.reviews.docs);
        setTotalItems(response.data.reviews.totalDocs);
      }
    } catch (error: any) {
      console.error("Error in api request:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, searchForm]);

  const markArchiveUnarchive = async (
    itemId?: string,
    is_archived?: boolean | number
  ) => {
    // Convert old numeric values to boolean
    const currentStatus = Boolean(is_archived);

    const new_status = !currentStatus; // toggle
    const status_name = currentStatus ? "unarchive" : "archive";
    const message = `Are you sure you want to ${status_name} the review?`;

    archiveUnarchiveRating(
      itemId,
      new_status,
      "rating-feddbacks/archive-unarchive-rating",
      message,
      getListData
    );
  };

  /*Delete selected item*/
  const deleteReview = async (itemid?: string) => {
    const message = `Are you sure you want to delete the review?`;
    deleteItem(`rating-feddbacks/delete/${itemid}`, message, getListData);
  };

  return (
    <>
      {/*Page toolbar Area Start*/}
      <PageToolbar title="Archived Review List" />
      {/*Page toolbar Area End*/}
      <div id="kt_content" className="content flex-column-fluid">
        {/*Search Area Start*/}
        <SearchForm
          searchForm={searchForm}
          setSearchForm={setSearchForm}
          handleSearchClick={searchData}
        />
        {/*Search Area End*/}
        {/*Content Area Start*/}
        <div className={`card h-70vh ${isLoading ? "overlay overlay-block" : ""}`}>
          <div className="card-body pt-0 pb-0 overflow-auto">
            <div className="dt-container dt-bootstrap5 dt-empty-footer">
              <table className="table table-hover table-row-bordered table-row-solid gy-4 align-middle fw-bold w-100">
                <thead
                  className={`sticky-table-header ${
                    !isLoading ? "table-active" : ""
                  }`}
                >
                  <tr className="text-start text-gray-800 fw-bold fs-7 text-uppercase gs-0">
                    <th className="min-w-200px">Event Name</th>
                    <th className="min-w-200px">Review By</th>
                    <th className="min-w-200px">Review For</th>
                    <th className="min-w-200px">Rating</th>
                    <th className="min-w-200px">Message</th>
                    <th className="min-w-150px">Event Date</th>
                    <th className="min-w-150px">Admin Approval</th>
                    <th className="min-w-150px">Created Date</th>
                    <th className="min-w-70px">Actions</th>
                  </tr>
                </thead>
                <tbody className="fw-semibold text-gray-600">
                  {!results || results.length === 0 ? (
                    <tr className="text-center">
                      <td colSpan={10}>No Content Found</td>
                    </tr>
                  ) : (
                    results.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="symbol symbol-circle symbol-35px overflow-hidden me-3">
                              <div className="symbol-label">
                                <img
                                  src={item?.event_id?.displaypath}
                                  alt={item?.event_id?.title}
                                  className="w-100 h-100"
                                />
                              </div>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <div className="fw-semibold fs-6 text-gray-500">
                                {item?.event_id?.title || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="symbol symbol-circle symbol-35px overflow-hidden me-3">
                              <div className="symbol-label">
                                <img
                                  src={item?.created_by?.imagepath}
                                  alt={item?.created_by?.fullname}
                                  className="w-100 h-100"
                                />
                              </div>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <div className="fw-semibold fs-6 text-gray-500">
                                {item?.created_by?.fullname || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="symbol symbol-circle symbol-35px overflow-hidden me-3">
                              <div className="symbol-label">
                                {" "}
                                {/* Pending In the src change contact_name to imagepath when it is added in the response */}
                                <img
                                  src={
                                    item?.student_id?.imagepath
                                      ? item?.student_id?.imagepath
                                      : item?.npo_id?.contact_name
                                  }
                                  alt={
                                    item?.student_id?.fullname
                                      ? item?.student_id?.fullname
                                      : item?.npo_id?.contact_name
                                  }
                                  className="w-100 h-100"
                                />
                              </div>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <div className="fw-semibold fs-6 text-gray-500">
                                {item?.student_id?.fullname
                                  ? item?.student_id?.fullname
                                  : item?.npo_id?.contact_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <RatingStar rating={item?.rating} />
                        </td>
                        <td>{item?.message}</td>
                        <td>
                          {helpers.convertDateTime(
                            item?.event_date,
                            "DD MMM YYYY"
                          ) || "N/A"}
                        </td>
                        <td>
                          {badges.adminApprovalBadge(
                            item?.approval_status ?? 0,
                            item?.approvalstatusname ?? ""
                          )}
                        </td>
                        <td>
                          {helpers.convertDateTime(
                            item?.created_at,
                            "DD MMM YYYY - HH:mm A"
                          ) || "N/A"}
                        </td>
                        <td className="text-center">
                          <div className="d-flex">
                            {hasAuthorization(
                              "archive_unarchive",
                              "review"
                            ) && (
                              <TooltipWrapper
                                title={`Mark ${
                                  item?.is_archived ? "Un-Archive" : "Archive"
                                }`}
                                placement="top"
                              >
                                <span
                                  className="btn btn-sm btn-icon btn-light btn-active-light-warning me-2"
                                  onClick={() =>
                                    markArchiveUnarchive(
                                      item?._id,
                                      item?.is_archived
                                    )
                                  }
                                >
                                  <i className="ki-outline ki-file-up text-warning fs-2"></i>
                                </span>
                              </TooltipWrapper>
                            )}
                            {/*hasAuthorization("admin_approval", "review") && (
                              <TooltipWrapper
                                title="Update Approval Status"
                                placement="top"
                              >
                                <span
                                  className="btn btn-sm btn-icon btn-light btn-active-light-info me-2"
                                  onClick={() =>
                                    updateApprovalStatus(
                                      item?._id,
                                      item?.approvalstatusname
                                    )
                                  }
                                >
                                  <i className="ki-outline ki-shield-tick text-info fs-2"></i>
                                </span>
                              </TooltipWrapper>
                            )*/}
                            {hasAuthorization("delete", "review") && (
                              <TooltipWrapper
                                title="Delete Review"
                                placement="top"
                              >
                                <span
                                  className="btn btn-sm btn-icon btn-light btn-active-light-danger"
                                  onClick={() => deleteReview(item._id)}
                                >
                                  <i className="ki-outline ki-trash text-danger fs-2"></i>
                                </span>
                              </TooltipWrapper>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot></tfoot>
              </table>
            </div>
          </div>
          {/*Content Area End*/}
          {/*Pagination Start*/}
          {results && results.length > 0 && (
            <div
              className={`sticky-bottom bg-white border rounded p-2 shadow-sm bottom-0 z-2 ${
                isLoading ? "" : "border-top"
              }`}
            >
              <Pagination
                totalItems={totalItems}
                itemsPerPage={pagination.pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          )}
          {/*Pagination End*/}
          {/*Content Loader Start*/}
          {isLoading && <ContentLoader />}
          {/*Content Loader End*/}
        </div>
      </div>
    </>
  );
};

export default ReviewList;
