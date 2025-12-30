import React, { useEffect, useRef, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { useModalState } from "../../hooks/useModalState";
import useCommonActions from "../../hooks/useCommonActions";
import SearchForm from "./partial/SearchForm";
import CreateUpdateBadgeList from "./CreateUpdateBadgeList";
import { BadgeList, BadgeSearchFormState } from "../../types/interfaces";
import { PageToolbar, TooltipWrapper } from "../common";
import ContentLoader from "../common/ContentLoader";
import Pagination from "../common/Pagination";
import { hasAuthorization } from "../../_helpers/hasAuthorization";
import ViewDetails from "./ViewDetails";
import helpers from "../../_helpers/common";
import badges from "../../_helpers/badgeHelper";

const List: React.FC = () => {
  const axiosInstance = useAxios();
  const { deleteItem } = useCommonActions();
  const { handleOpenModal } = useModalState();
  const isInitialRender = useRef(false);
  const [searchForm, setSearchForm] = useState<BadgeSearchFormState>({
    search_string: "",
    status: "",
    badge_for: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  const [results, setResults] = useState<BadgeList[] | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch list on page change
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    getListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  const searchData = () => {
    getListData();
  };

  const getListData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await axiosInstance({
        url: "badges/get-badge-list",
        method: "GET",
        data: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
          ...searchForm,
        },
      });
      // console.log("Badge management list response", response);
      setResults(response.data.badges.docs);
      setTotalItems(response.data.badges.totalDocs);
    } catch (error: any) {
      console.error("Error in api request:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, searchForm]);

  /*Handle pagination updates*/
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ currentPage: page, pageSize });
  };

  // Delete a badge by ID
  const deleteBadge = (itemid?: string) => {
    const message = `Are you sure you want to delete the Badge?`;
    deleteItem(`badges/delete/${itemid}`, message, getListData);
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        {/*Page toolbar Area Start*/}
        <PageToolbar title="Badge Management List" />
        <div className="d-flex align-items-center">
          <span
            className="btn btn-dark btn-sm fw-bold fs-6 px-4 py-2"
            onClick={() =>
              handleOpenModal(
                <CreateUpdateBadgeList
                  badgeList={null}
                  getListData={getListData}
                />
              )
            }
          >
            Create Badge
          </span>
        </div>
      </div>
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
                    <th className="min-w-250px">Badge Title</th>
                    <th className="min-w-250px">Description</th>
                    <th className="min-w-70px">Status</th>
                    <th className="min-w-200px">Created Date</th>
                    <th className="min-w-100px">Badge For</th>
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
                            <div className="symbol symbol-square symbol-label symbol-55px overflow-hidden me-3">
                              <div className="symbol-label d-flex align-items-center justify-content-center">
                                <img
                                  src={
                                    item?.imagepath
                                      ? item?.imagepath
                                      : "./assets/media/svg/blank-image.svg"
                                  }
                                  alt={item?.title}
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                              <div className="fw-semibold fs-6 text-gray-500">
                                {item?.title || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{item.description}</td>
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
                        <td>
                          <span className="badge py-2 px-3 fs-7 badge-secondary">
                            {item?.badgefor || "N/A"}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-start">
                            {hasAuthorization("view", "badge-list") && (
                              <TooltipWrapper
                                title="View Details"
                                placement="top"
                              >
                                <span
                                  className="btn btn-sm btn-icon btn-light btn-active-light-primary me-2"
                                  onClick={() =>
                                    handleOpenModal(
                                      <ViewDetails badgeInfo={item} />
                                    )
                                  }
                                >
                                  <i className="ki-outline ki-eye text-primary fs-2"></i>
                                </span>
                              </TooltipWrapper>
                            )}

                            {hasAuthorization("edit", "badge-list") && (
                              <TooltipWrapper title="Edit" placement="top">
                                <span
                                  className="btn btn-sm btn-icon btn-light btn-active-light-warning me-2"
                                  onClick={() =>
                                    handleOpenModal(
                                      <CreateUpdateBadgeList
                                        badgeList={item}
                                        getListData={getListData}
                                      />
                                    )
                                  }
                                >
                                  <i className="ki-outline ki-notepad-edit text-warning fs-2"></i>
                                </span>
                              </TooltipWrapper>
                            )}

                            {hasAuthorization("delete", "badge-list") && (
                              <TooltipWrapper
                                title="Delete Badge"
                                placement="top"
                              >
                                <span
                                  className="btn btn-sm btn-icon btn-light btn-active-light-danger"
                                  onClick={() => deleteBadge(item?._id)}
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
