import React, { useState, useEffect, useRef } from "react";
import SearchForm from "./partial/SearchForm";
import useAxios from "../../hooks/useAxios";
import useCommonActions from "../../hooks/useCommonActions";
import { UserSearchFormState, User } from "../../types/interfaces";
import { PageToolbar, TooltipWrapper } from "../common";
import ContentLoader from "../common/ContentLoader";
import Pagination from "../common/Pagination";
import badges from "../../_helpers/badgeHelper";
import helpers from "../../_helpers/common";
import { hasAuthorization } from "../../_helpers/hasAuthorization";
import { Link } from "react-router-dom";

const List: React.FC = () => {
  const axiosInstance = useAxios();
  const { changeApprovalStatus, changeItemStatus, deleteItem } =
    useCommonActions();
  const [searchForm, setSearchForm] = useState<UserSearchFormState>({
    search_string: "",
    approval_status: "",
    status: "",
  });
  const [results, setResults] = useState<User[] | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });
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
        url: "users/parent-list",
        method: "GET",
        data: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
          search_string: searchForm.search_string,
          approval_status: searchForm.approval_status,
          status: searchForm.status,
        },
      });
      // console.log('Parent list response', response);
      setResults(response.data.parentslists.docs);
      setTotalItems(response.data.parentslists.totalDocs);
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
  const changeParentStatus = async (userid?: string, status?: number) => {
    const newStatus = status === 1 ? 2 : 1;
    const message = `Are you sure you want to ${
      status === 1 ? "block" : "unblock"
    } the user?`;
    changeItemStatus(
      userid,
      newStatus,
      "users/update-user-status",
      message,
      getListData
    );
  };

  /*Delete selected item*/
  const deleteParent = async (itemid?: string) => {
    const message = `Are you sure you want to delete the Parent?`;
    deleteItem(`users/delete-parent/${itemid}`, message, getListData);
  };

  const getNotificationColor = (item: User | null) => {
    if (item?.is_logged_in) {
      return "bg-success";
    } else {
      return "bg-danger";
    }
  };

  return (
    <>
      {/*Page toolbar Area Start*/}
      <PageToolbar title="Parent List" />
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
                    <th className="min-w-200px">Name</th>
                    <th className="min-w-200px">Email</th>
                    <th className="min-w-200px">Phone No</th>
                    <th className="min-w-150px">Admin Approval</th>
                    <th className="min-w-150px">Created Date</th>
                    <th className="min-w-70px">Status</th>
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
                            <span
                              className={`bullet bullet-dot me-5 w-8px h-8px ${getNotificationColor(
                                item
                              )}`}
                            ></span>
                            <div className="symbol symbol-circle symbol-40px overflow-hidden me-3">
                              <div className="symbol-label">
                                <img
                                  src={item.imagepath}
                                  alt={item.fullname}
                                  className="w-100 h-100"
                                />
                              </div>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <div className="fw-semibold fs-6 text-gray-500">
                                {item.fullname || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{item.email || "N/A"}</td>
                        {/* <td>{item?.phone_no || "N/A"}</td> */}
                        <td>
                          <span>
                            {item?.phone_country_code
                              ? (item?.phone_country_code).includes("+")
                                ? ""
                                : "+"
                              : ""}
                            {item?.phone_country_code} {item?.phone_no || "N/A"}
                          </span>
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
                        <td>
                          {badges.userStatusBadge(
                            item?.status ?? 0,
                            item?.statusname ?? ""
                          )}
                        </td>
                        <td className="text-center">
                          <div className="d-flex">
                            {hasAuthorization("view", "parent") && (
                              <TooltipWrapper
                                title="View Details"
                                placement="top"
                              >
                                <Link
                                  className="btn btn-sm btn-icon btn-light btn-active-light-primary me-2"
                                  to={`/parent-detail/${item._id}`}
                                >
                                  <i className="ki-outline ki-eye text-primary fs-2"></i>
                                </Link>
                              </TooltipWrapper>
                            )}
                            {hasAuthorization("admin_approval", "parent") && (
                              <TooltipWrapper
                                title="Update Approval Status"
                                placement="top"
                              >
                                <span
                                  className="btn btn-sm btn-icon btn-light btn-active-light-warning me-2"
                                  onClick={() =>
                                    updateApprovalStatus(
                                      item?._id,
                                      item?.approvalstatusname
                                    )
                                  }
                                >
                                  <i className="ki-outline ki-shield-tick text-warning fs-2"></i>
                                </span>
                              </TooltipWrapper>
                            )}
                            {hasAuthorization("block_unblock", "parent") && (
                              <TooltipWrapper
                                title={item.status === 1 ? "Block" : "Unblock"}
                                placement="top"
                              >
                                <span
                                  className="btn btn-sm btn-icon btn-light btn-active-light-warning me-2"
                                  onClick={() =>
                                    changeParentStatus(item?._id, item?.status)
                                  }
                                >
                                  <i className="ki-outline ki-switch text-warning fs-2"></i>
                                </span>
                              </TooltipWrapper>
                            )}
                            {hasAuthorization("delete", "parent") && (
                              <TooltipWrapper
                                title="Delete Volunteer"
                                placement="top"
                              >
                                <span
                                  className="btn btn-sm btn-icon btn-light btn-active-light-danger"
                                  onClick={() => deleteParent(item._id)}
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

export default List;
