//Simple list with outside scroll

import React, { useState, useEffect, useRef } from "react";
import useAxios from "../../hooks/useAxios";
import useCommonActions from "../../hooks/useCommonActions";
import SearchForm from "./partial/SearchForm";
import { EventSearchFormState, Events } from "../../types/interfaces";
import { PageToolbar, TooltipWrapper } from "../common";
import { useModalState } from "../../hooks/useModalState";
import helpers from "../../_helpers/common";
import badges from "../../_helpers/badgeHelper";
import { hasAuthorization } from "../../_helpers/hasAuthorization";
import { Link } from "react-router-dom";
import EventApproval from "./EventApproval";
import Pagination from "../common/Pagination";
import ContentLoader from "../common/ContentLoader";

const List: React.FC = () => {
  const axiosInstance = useAxios();
  const { changeApprovalStatus, deleteItem } = useCommonActions();
  const { handleOpenModal } = useModalState();
  const [searchForm, setSearchForm] = useState<EventSearchFormState>({
    npo_id: "",
    search_string: "",
    event_status: "",
    approval_status: "",
  });
  const [results, setResults] = useState<Events[] | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const isInitialRender = useRef(false);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    getListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  /*Handle pagination data change*/
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ currentPage: page, pageSize });
  };

  const searchData = () => {
    getListData();
  };

  const getListData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await axiosInstance({
        url: "events/event-list",
        method: "GET",
        data: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
          npo_id: searchForm.npo_id,
          search_string: searchForm.search_string,
          event_status: searchForm.event_status,
          approval_status: searchForm.approval_status,
        },
      });
      // console.log("event list response", response);
      setResults(response.data.eventlists.docs);
      setTotalItems(response.data.eventlists.totalDocs);
    } catch (error: any) {
      console.error("Error in api request:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, searchForm]);

  /*Change Admin approval status*/
  const updateApprovalStatus = async (
    itemId?: string,
    approvalstatusname?: string,
    is_recuring?: number
  ) => {
    changeApprovalStatus({
      itemId,
      url: "events/update-approval-status",
      is_recuring: is_recuring,
      selectedOption: approvalstatusname,
      callback: getListData,
    });
  };

  /*Delete selected item*/
  const deleteEvent = async (itemid?: string) => {
    const message = `Are you sure you want to delete the Event?`;
    deleteItem(`events/delete-event/${itemid}`, message, getListData);
  };

  return (
    <>
      {/*Page toolbar Area Start*/}
      <PageToolbar title="Event List" />
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
        <div className={`card ${isLoading ? "overlay overlay-block" : ""}`}>
          <div className="card-body pt-0 pb-0">
            <div
              id="kt_ecommerce_products_table_wrapper"
              className="dt-container dt-bootstrap5 dt-empty-footer"
            >
              <div className="table-responsive" style={{ minHeight: "69vh" }}>
                <table className="table table-hover table-row-bordered table-row-solid gy-4 align-middle fw-bold w-100">
                  <thead>
                    <tr className="text-start text-gray-800 fw-bold fs-7 text-uppercase gs-0">
                      {/* <th
                        className="w-10px pe-2 dt-orderable-none"
                        data-dt-column="0"
                        rowSpan={1}
                        colSpan={1}
                        aria-label=""
                      >
                        <span className="dt-column-title">
                          <div className="form-check form-check-sm form-check-custom form-check-solid me-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              data-kt-check="true"
                              data-kt-check-target="#kt_ecommerce_products_table .form-check-input"
                              value="1"
                            />
                          </div>
                        </span>
                        <span className="dt-column-order"></span>
                      </th> */}
                      <th className="min-w-250px">Event Title</th>
                      <th className="min-w-200px">Organization/NPO Name</th>
                      <th className="min-w-100px">Address</th>
                      <th className="min-w-100px">Volunteer</th>
                      <th className="min-w-100px text-center">Event Date</th>
                      <th className="min-w-70px">Event Status</th>
                      <th className="min-w-70px">Approval Status</th>
                      <th className="min-w-100px">Created Date</th>
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
                          {/* <td>
                            <div className="form-check form-check-sm form-check-custom form-check-solid">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={item._id}
                              />
                            </div>
                          </td> */}
                          {/* <td>
                            <div className="d-flex align-items-center">
                              <div className="symbol symbol-square symbol-55px overflow-hidden me-3">
                                <div className="symbol-label">
                                  <img
                                    src={item?.displaypath}
                                    alt={item?.title}
                                    className="w-100"
                                  />
                                </div>
                              </div>
                              <div className="d-flex flex-column justify-content-center">
                                <div className="fw-semibold fs-6 text-gray-500">
                                  {item?.title || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td> */}
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="symbol symbol-square symbol-55px overflow-hidden me-2">
                                <div className="symbol-label">
                                  <img
                                    src={item?.displaypath}
                                    alt={item?.title}
                                    className="w-100 object-fit-cover"
                                  />
                                </div>
                              </div>
                              <div className="m-0">
                                <span className="text-gray-600 fw-bold text-hover-primary fs-6">
                                  {item.title}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>{item?.npo_id?.organization_name || "N/A"}</td>
                          <td>{item?.address || "N/A"}</td>
                          <td className="text-center">
                            {item.volunteers_count || "N/A"}
                          </td>
                          <td className="text-center">
                            {item?.is_recuring === 1
                              ? `${
                                  helpers.convertDateTime(
                                    item?.start_date,
                                    "DD MMM YYYY"
                                  ) || "N/A"
                                } - ${
                                  helpers.convertDateTime(
                                    item?.end_date,
                                    "DD MMM YYYY"
                                  ) || "N/A"
                                }`
                              : helpers.convertDateTime(
                                  item?.start_date,
                                  "DD MMM YYYY"
                                ) || "N/A"}
                          </td>
                          <td>
                            {badges.eventStatusBadge(
                              item.event_status ?? 0,
                              item?.statusname ?? ""
                            )}
                          </td>
                          <td>
                            {badges.adminApprovalBadge(
                              item.approval_status ?? 0,
                              item?.approvalstatusname ?? ""
                            )}
                          </td>
                          <td>
                            {helpers.convertDateTime(
                              item?.created_at,
                              "DD MMM YYYY - HH:mm A"
                            ) || "N/A"}
                          </td>
                          <td className="text-end">
                            <div className="d-flex justify-content-end">
                              {hasAuthorization("view", "event") && (
                                <TooltipWrapper
                                  title="View Details"
                                  placement="top"
                                >
                                  <Link
                                    className="btn btn-sm btn-icon btn-light btn-active-light-primary me-2"
                                    to={`/event-detail/${item._id}`}
                                  >
                                    <i className="ki-outline ki-eye text-primary fs-2"></i>
                                  </Link>
                                </TooltipWrapper>
                              )}
                              {hasAuthorization("admin_approval", "event") && (
                                <TooltipWrapper
                                  title="Update Approval Status"
                                  placement="top"
                                >
                                  <span
                                    className="btn btn-sm btn-icon btn-light btn-active-light-warning me-2"
                                    onClick={
                                      item?.is_recuring === 1
                                        ? () =>
                                            handleOpenModal(
                                              <EventApproval
                                                eventTitle={item?.title}
                                                eventId={item._id}
                                                is_recuring={item.is_recuring}
                                                getListData={getListData}
                                              />
                                            )
                                        : () =>
                                            updateApprovalStatus(
                                              item?._id,
                                              item?.approvalstatusname,
                                              item?.is_recuring
                                            )
                                    }
                                  >
                                    <i className="ki-outline ki-shield-tick text-warning fs-2"></i>
                                  </span>
                                </TooltipWrapper>
                              )}
                              {hasAuthorization("delete_event", "event") && (
                                <TooltipWrapper
                                  title="Delete Event"
                                  placement="top"
                                >
                                  <span
                                    className="btn btn-sm btn-icon btn-light btn-active-light-danger"
                                    onClick={() => deleteEvent(item?._id)}
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
                </table>
              </div>
              {/*Content Area End*/}
              {/*Pagination Start*/}
              <div className="border-top">
                {results && results.length > 0 && (
                  <Pagination
                    totalItems={totalItems}
                    itemsPerPage={pagination.pageSize}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
              {/*Pagination End*/}
            </div>
            {/*Content Loader Start*/}
            {isLoading && <ContentLoader />}
            {/*Content Loader End*/}
          </div>
        </div>
      </div>
    </>
  );
};

export default List;
