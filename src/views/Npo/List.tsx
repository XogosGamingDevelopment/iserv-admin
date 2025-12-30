import React, { useState, useEffect, useRef } from "react";
import SearchForm from "./partial/SearchForm";
import useAxios from "../../hooks/useAxios";
import useCommonActions from "../../hooks/useCommonActions";
import { NpoSearchFormState, NpoProfile } from "../../types/interfaces";
import { PageToolbar, TooltipWrapper } from "../common";
import ContentLoader from "../common/ContentLoader";
import Pagination from "../common/Pagination";
import { hasAuthorization } from "../../_helpers/hasAuthorization";
import badges from "../../_helpers/badgeHelper";
import { Link } from "react-router-dom";
import helpers from "../../_helpers/common";

const List: React.FC = () => {
  const axiosInstance = useAxios();
  const { changeApprovalStatus, changeItemStatus, deleteItem } =
    useCommonActions();
  const [searchForm, setSearchForm] = useState<NpoSearchFormState>({
    organisation_name: "",
    search_string: "",
    registration_status: "",
    approval_status: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  const [results, setResults] = useState<NpoProfile[] | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialRender = useRef(false);

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
        url: "users/npo-list",
        method: "GET",
        data: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
          organisation_name: searchForm.organisation_name,
          search_string: searchForm.search_string,
          registration_status: searchForm.registration_status,
          approval_status: searchForm.approval_status,
        },
      });
      // console.log("npo list response", response);
      setResults(response.data.npolists.docs);
      setTotalItems(response.data.npolists.totalDocs);
    } catch (error: any) {
      console.error("Error in api request:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, searchForm]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false; // Mark as rendered
      return; //Skip the first execution
    }
    getListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]); //Dependency array

  /*Change Admin approval status*/
  const updateApprovalStatus = async (
    itemId?: string,
    approvalstatusname?: string
  ) => {
    changeApprovalStatus({
      itemId,
      url: "users/update-approval-status",
      selectedOption: approvalstatusname,
      callback: getListData,
    });
  };

  /*Change selected item status*/
  const changeNPOStatus = async (itemid?: string, status?: number) => {
    const newStatus = status === 1 ? 2 : 1;
    const message = `Are you sure you want to ${
      status === 1 ? "block" : "unblock"
    } the NPO?`;
    changeItemStatus(
      itemid,
      newStatus,
      "users/update-user-status",
      message,
      getListData
    );
  };

  /*Delete selected item*/
  const deleteNpoProfile = async (itemid?: string) => {
    const message = `Are you sure you want to delete the NPO profile?`;
    deleteItem(`users/delete-npo/${itemid}`, message, getListData);
  };

  const getNotificationColor = (item: NpoProfile | null) => {
    if (item?.npo_user_id?.is_logged_in) {
      return "bg-success";
    } else {
      return "bg-danger";
    }
  };

  return (
    <>
      {/*Page toolbar Area Start*/}
      <PageToolbar title="NPO List" />
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
                    <th className="min-w-200px">Contact Info</th>
                    <th className="min-w-200px">Organization Name</th>
                    <th className="min-w-200px">Registration No</th>
                    <th className="min-w-200px">Registration Status</th>
                    <th className="min-w-150px">Admin Approval</th>
                    <th className="min-w-150px">Created Date</th>
                    <th className="min-w-70px">Status</th>
                    <th className="min-w-70px">Actions</th>
                  </tr>
                </thead>
                <tbody className="fw-semibold text-gray-600 border-top">
                  {!results || results.length === 0 ? (
                    <tr className="text-center">
                      <td colSpan={10}>No Content Found</td>
                    </tr>
                  ) : (
                    results.map((item) =>
                      item.npo_user_id ? (
                        <tr key={item._id}>
                          <td className="d-flex align-items-center">
                            <span
                              className={`bullet bullet-dot me-5 w-8px h-8px ${getNotificationColor(
                                item
                              )}`}
                            ></span>
                            <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                              <div className="symbol-label">
                                <img
                                  src={item?.npo_user_id?.imagepath}
                                  alt={item.organization_name}
                                  className="w-100 h-100"
                                />
                              </div>
                            </div>
                            <div className="d-flex flex-column">
                              <span className="text-gray-800 text-hover-primary mb-1">
                                {item?.npo_user_id?.fullname || "N/A"}
                              </span>
                              <span>{item?.npo_user_id?.email || "N/A"}</span>
                              <span>
                                {item?.npo_user_id?.phone_country_code
                                  ? (item?.npo_user_id?.phone_country_code).includes(
                                      "+"
                                    )
                                    ? ""
                                    : "+"
                                  : ""}
                                {item?.npo_user_id?.phone_country_code}{" "}
                                {item?.npo_user_id?.phone_no || "N/A"}
                              </span>
                            </div>
                          </td>

                          <td>{item?.organization_name || "N/A"}</td>
                          <td>{item.registration_no || "N/A"}</td>
                          <td>
                            {badges.npoRegistrationStatusBadge(
                              item.registration_status ?? 0,
                              item.registrationstatusname ?? ""
                            )}
                          </td>
                          <td>
                            {badges.adminApprovalBadge(
                              item?.npo_user_id?.approval_status ?? 0,
                              item?.npo_user_id?.approvalstatusname ?? ""
                            )}
                          </td>
                          <td>
                            {helpers.convertDateTime(
                              item?.created_at,
                              "DD MMM YYYY - HH:mm A"
                            ) || "N/A"}
                          </td>
                          <td>
                            {badges.userStatusBadge(
                              item?.npo_user_id?.status ?? 0,
                              item?.npo_user_id?.statusname ?? ""
                            )}
                          </td>
                          <td className="text-center">
                            <div className="d-flex">
                              {hasAuthorization("view", "npo") && (
                                <TooltipWrapper
                                  title="View Details"
                                  placement="top"
                                >
                                  <Link
                                    className="btn btn-sm btn-icon btn-light btn-active-light-primary me-2"
                                    to={`/npo-detail/${item._id}`}
                                  >
                                    <i className="ki-outline ki-eye text-primary fs-2"></i>
                                  </Link>
                                </TooltipWrapper>
                              )}
                              {hasAuthorization("admin_approval", "npo") && (
                                <TooltipWrapper
                                  title="Update Approval Status"
                                  placement="top"
                                >
                                  <span
                                    className="btn btn-sm btn-icon btn-light btn-active-light-warning me-2"
                                    onClick={() =>
                                      updateApprovalStatus(
                                        item?.npo_user_id?._id,
                                        item?.npo_user_id?.approvalstatusname
                                      )
                                    }
                                  >
                                    <i className="ki-outline ki-shield-tick text-warning fs-2"></i>
                                  </span>
                                </TooltipWrapper>
                              )}
                              {hasAuthorization("block_unblock", "npo") && (
                                <TooltipWrapper
                                  title={
                                    item?.npo_user_id?.status === 1
                                      ? "Block"
                                      : "Unblock"
                                  }
                                  placement="top"
                                >
                                  <span
                                    className="btn btn-sm btn-icon btn-light btn-active-light-warning me-2"
                                    onClick={() =>
                                      changeNPOStatus(
                                        item?.npo_user_id?._id,
                                        item?.npo_user_id?.status
                                      )
                                    }
                                  >
                                    <i className="ki-outline ki-switch text-warning fs-2"></i>
                                  </span>
                                </TooltipWrapper>
                              )}
                              {hasAuthorization("delete", "npo") && (
                                <TooltipWrapper
                                  title="Delete Npo"
                                  placement="top"
                                >
                                  <span
                                    className="btn btn-sm btn-icon btn-light btn-active-light-danger"
                                    onClick={() => deleteNpoProfile(item._id)}
                                  >
                                    <i className="ki-outline ki-trash text-danger fs-2"></i>
                                  </span>
                                </TooltipWrapper>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        ""
                      )
                    )
                  )}
                </tbody>
                {/* <tfoot></tfoot> */}
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

export default List;
