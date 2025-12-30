import React, { useEffect, useRef, useState } from "react";
import useAxios from "../../hooks/useAxios";
import useCommonActions from "../../hooks/useCommonActions";
import CreateUpdateAgeGroup from "./CreateUpdateAgeGroup";
import SearchForm from "./partial/SearchForm";
import { AgeGroup, AgeGroupSearchFormState } from "../../types/interfaces";
import { useModalState } from "../../hooks/useModalState";
import { PageToolbar, TooltipWrapper } from "../common";
import ContentLoader from "../common/ContentLoader";
import Pagination from "../common/Pagination";
import badges from "../../_helpers/badgeHelper";
import helpers from "../../_helpers/common";
import { hasAuthorization } from "../../_helpers/hasAuthorization";

export interface AgeGroupFormState {
  _id: String;
  title: string;
  description: string;
}

const List: React.FC = () => {
  const axiosInstance = useAxios();
  const { changeItemStatus, deleteItem } = useCommonActions();
  const { handleOpenModal } = useModalState();
  const [searchForm, setSearchForm] = useState<AgeGroupSearchFormState>({
    search_string: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  const [results, setResults] = useState<AgeGroup[] | null>(null);
  const [totalItems, setTotalItems] = useState(0);
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

  const searchData = () => {
    getListData();
  };

  const getListData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await axiosInstance({
        url: "event-age-group/list",
        method: "GET",
        data: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
          ...searchForm,
        },
      });
      // console.log('age group management list response', response);
      setResults(response.data.agegrouplists.docs);
      setTotalItems(response.data.agegrouplists.totalDocs);
    } catch (error: any) {
      console.error("Error in api request:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, searchForm]);

  /*Handle pagination data change*/
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ currentPage: page, pageSize });
  };

  const changeAgeGroupStatus = async (itemid?: string, status?: number) => {
    const newStatus = status === 1 ? 0 : 1;
    const message = `Are you sure you want to ${
      status === 1 ? "deactivate" : "activate"
    } the Interest?`;
    changeItemStatus(
      itemid,
      newStatus,
      "event-age-group/update-status",
      message,
      getListData
    );
  };

  const deleteAgeGroup = (itemid?: string) => {
    const message = `Are you sure you want to delete the Age Group?`;
    deleteItem(`event-age-group/delete/${itemid}`, message, getListData);
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        {/*Page toolbar Area Start*/}
        <PageToolbar title="Age Group Management List" />
        <div className="d-flex align-items-center">
          <span
            className="btn btn-dark btn-sm fw-bold fs-6 px-4 py-2"
            onClick={() =>
              handleOpenModal(
                <CreateUpdateAgeGroup
                  ageGroup={null}
                  getListData={getListData}
                />
              )
            }
          >
            Create Age Group
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
                    <th className="min-w-250px">Title</th>
                    <th className="min-w-200px">Description</th>
                    <th className="min-w-70px">Status</th>
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
                        <td>{item.title || "N/A"}</td>
                        <td>{item.description || "N/A"}</td>
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
                          <div className="">
                            {hasAuthorization("edit", "age-group") && (
                              <TooltipWrapper title="Edit" placement="top">
                                <span
                                  className="btn btn-sm btn-icon btn-light btn-active-light-warning me-2"
                                  onClick={() =>
                                    handleOpenModal(
                                      <CreateUpdateAgeGroup
                                        ageGroup={item}
                                        getListData={getListData}
                                      />
                                    )
                                  }
                                >
                                  <i className="ki-outline ki-notepad-edit text-warning fs-2"></i>
                                </span>
                              </TooltipWrapper>
                            )}
                            {hasAuthorization("update_status", "age-group") && (
                              <TooltipWrapper
                                title="Update Age Group Status"
                                placement="top"
                              >
                                <span
                                  className="btn btn-sm btn-icon btn-light btn-active-light-warning me-2"
                                  onClick={() =>
                                    changeAgeGroupStatus(
                                      item?._id,
                                      item?.status
                                    )
                                  }
                                >
                                  <i className="ki-outline ki-shield-tick text-warning fs-2"></i>
                                </span>
                              </TooltipWrapper>
                            )}
                            {hasAuthorization("delete", "age-group") && (
                              <TooltipWrapper
                                title="Delete Age Group"
                                placement="top"
                              >
                                <span
                                  className="btn btn-sm btn-icon btn-light btn-active-light-danger"
                                  onClick={() => deleteAgeGroup(item?._id)}
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
