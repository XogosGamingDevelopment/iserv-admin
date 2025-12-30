import React, { useState, useEffect, useRef } from "react";
import useAxios from "../../hooks/useAxios";
import SearchForm from "./partial/SearchForm";
import useCommonActions from "../../hooks/useCommonActions";
import {
  NewsLetterEmailSearchFormState,
  NewsLetterEmail,
} from "../../types/interfaces";
import { PageToolbar, TooltipWrapper } from "../common";
import ContentLoader from "../common/ContentLoader";
import Pagination from "../common/Pagination";
import { hasAuthorization } from "../../_helpers/hasAuthorization";
import helpers from "../../_helpers/common";
import badges from "../../_helpers/badgeHelper";

const List: React.FC = () => {
  const axiosInstance = useAxios();
  const { changeItemStatus, deleteItem } = useCommonActions();
  const [searchForm, setSearchForm] = useState<NewsLetterEmailSearchFormState>({
    search_string: "",
    status: "",
    is_verified: "",
  });
  const [results, setResults] = useState<NewsLetterEmail[] | null>(null);
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
        url: "news-letter/list",
        method: "GET",
        data: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
          search_string: searchForm.search_string,
          status: searchForm.status,
          is_verified: searchForm.is_verified,
        },
      });
      // console.log("settings list response", response);
      setResults(response.data.emaillists.docs);
      setTotalItems(response.data.emaillists.totalDocs);
    } catch (error: any) {
      console.error("Error in api request:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, searchForm]);

  /*Change selected item status*/
  const changeEmailStatus = async (itemid?: string, status?: number) => {
    const newStatus = status === 1 ? 0 : 1;
    const message = `Are you sure you want to ${
      status === 1 ? "unverify" : "verify"
    } the Email?`;
    changeItemStatus(
      itemid,
      newStatus,
      "news-letter/update-verification-status",
      message,
      getListData
    );
  };

  /*Delete selected item*/
  const deleteEmail = async (itemid?: string) => {
    const message = `Are you sure you want to delete the Email?`;
    deleteItem(`news-letter/delete/${itemid}`, message, getListData);
  };

  return (
    <>
      {/*Page toolbar Area Start*/}
      <PageToolbar title="News Letter Email List" />
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
                    <th className="min-w-250px">Email</th>
                    <th className="min-w-200px">Is Verified</th>
                    <th className="min-w-70px">Status</th>
                    <th className="min-w-100px">Created Date</th>
                    <th className="min-w-70px">Actions</th>
                  </tr>
                </thead>
                <tbody className="fw-semibold text-gray-600">
                  {!results || results.length === 0 ? (
                    <tr className="text-center">
                      <td colSpan={5}>No Content Found</td>
                    </tr>
                  ) : (
                    results.map((item) => (
                      <tr key={item._id}>
                        <td>{item.email || "N/A"}</td>
                        <td>
                          {badges.eventStatusBadge(
                            item.is_verified ?? 0,
                            item?.verifiedname ?? ""
                          )}
                        </td>
                        <td>
                          {badges.eventStatusBadge(
                            item.status ?? 0,
                            item?.statusname ?? ""
                          )}
                        </td>
                        <td>
                          {helpers.convertDateTime(
                            item?.created_at,
                            "DD MMM YYYY - HH:mm A"
                          ) || "N/A"}
                        </td>
                        <td className="">
                          <div className="d-flex">
                            {hasAuthorization(
                              "update_status",
                              "newsletter-email"
                            ) && (
                              <TooltipWrapper
                                title="Update Verification Status"
                                placement="top"
                              >
                                <span
                                  className="btn btn-sm btn-icon btn-light btn-active-light-warning me-2"
                                  onClick={() =>
                                    changeEmailStatus(
                                      item?._id,
                                      item?.is_verified
                                    )
                                  }
                                >
                                  <i className="ki-outline ki-shield-tick text-warning fs-2"></i>
                                </span>
                              </TooltipWrapper>
                            )}

                            {hasAuthorization("delete", "newsletter-email") && (
                              <TooltipWrapper title="Delete" placement="top">
                                <span
                                  className="btn btn-sm btn-icon btn-light btn-active-light-danger"
                                  onClick={() => deleteEmail(item?._id)}
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
