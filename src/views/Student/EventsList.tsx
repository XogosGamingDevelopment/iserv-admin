import React, { useState, useEffect } from "react";
import helpers from "../../_helpers/common";
import Pagination from "../common/Pagination";
import ContentLoader from "../common/ContentLoader";
import useAxios from "../../hooks/useAxios";
import { StudentEventsProps, Events } from "../../types/interfaces";
import { hasAuthorization } from "../../_helpers/hasAuthorization";
import { TooltipWrapper } from "../common";
import { Link } from "react-router-dom";

const EventsList: React.FC<StudentEventsProps> = ({ eventtype, studentId }) => {
  const axiosInstance = useAxios();
  const [results, setResults] = useState<Events[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  //const isInitialRender = useRef(false);

  //Single useEffect for all changes
  useEffect(() => {
    getListData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventtype, currentPage, pageSize]); //No trigger, prevents double calls

  /* Handle `eventtype` change: Reset page and size */
  useEffect(() => {
    setCurrentPage(1); // Reset to first page
    setPageSize(10); // Reset page size
  }, [eventtype]);

  /*Handle pagination data change*/
  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const getListData = async () => {
    setIsLoading(true);
    try {
      let filterType = eventtype === 1 ? "volunteered" : "completed";
      const response: any = await axiosInstance({
        url: "events/student-event-list",
        method: "GET",
        data: {
          page: currentPage,
          limit: pageSize,
          event_status: eventtype,
          filter_type: filterType,
          studentId: studentId,
          age_group: "",
          date_range: "",
          interest: "",
        },
      });
      //console.log("student events response", response);
      if (!response.error) {
        setResults(response.data.eventlists.docs);
        setTotalItems(response.data.eventlists.totalDocs);
      }
    } catch (error: any) {
      console.error("Error in api request:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div
      className={`card card-flush ${isLoading ? "overlay overlay-block" : ""}`}
      style={{ minHeight: "50vh", maxHeight: "50vh" }}
    >
      <div className="card-body pt-0 pb-0 table-responsive">
        <table className="table table-row-bordered gy-4 align-middle fw-bold dataTable w-100">
          <thead
            className={`fs-7 text-gray-500 text-uppercase sticky-table-header ${
              !isLoading ? "table-active" : ""
            }`}
          >
            <tr>
              <th className="min-w-30px">S.No</th>
              <th className="min-w-150px">Event Name</th>
              <th className="min-w-90px">Location</th>
              <th className="min-w-90px">Event Date</th>
              <th className="min-w-90px">Event Time</th>
              <th className="min-w-90px">Recurring</th>
              <th className="min-w-90px">Created On</th>
              <th className="min-w-50px">Volunteers</th>
              <th className="min-w-80px">View Details</th>
            </tr>
          </thead>
          <tbody className="fs-6">
            {!results || results.length === 0 ? (
              <tr className="text-center">
                <td colSpan={9}>No Content Found</td>
              </tr>
            ) : (
              results.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item?.title}</td>
                  <td>{item?.address}</td>
                  <td>
                    {item?.is_recuring === 1
                      ? `${helpers.convertDateTime(
                          item?.start_date,
                          "DD MMM YYYY"
                        )} - ${helpers.convertDateTime(
                          item?.end_date,
                          "DD MMM YYYY"
                        )}`
                      : helpers.convertDateTime(
                          item?.start_date,
                          "DD MMM YYYY"
                        )}
                  </td>
                  <td>{`${item?.start_time} - ${item?.end_time}`}</td>
                  <td>
                    {item?.is_recuring === 1
                      ? item?.recuring_type === 1
                        ? "Weekly"
                        : "Monthly"
                      : "N/A"}
                  </td>
                  <td>
                    {helpers.convertDateTime(
                      item?.created_at,
                      "DD MMM YYYY, HH:mm A"
                    )}
                  </td>
                  <td className="text-center"> {item.volunteers_count} </td>
                  <td className="text-center">
                    {hasAuthorization("view", "student") && (
                      <TooltipWrapper title="View Details" placement="top">
                        <Link
                          className="btn btn-sm btn-icon btn-light btn-active-light-primary me-2"
                          to={`/event-detail/${item?._id}`}
                        >
                          <i className="ki-outline ki-eye text-primary fs-2"></i>
                        </Link>
                      </TooltipWrapper>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot></tfoot>
        </table>
      </div>

      {/*Pagination Start*/}
      {results && results.length > 0 && (
        <div
          className={`sticky-bottom bg-white border rounded p-2 shadow-sm bottom-0 z-2 ${
            isLoading ? "" : "border-top"
          }`}
        >
          <Pagination
            totalItems={totalItems}
            itemsPerPage={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      {/*Pagination End*/}
      {/*Content Loader Start*/}
      {isLoading && <ContentLoader />}
      {/*Content Loader End*/}
    </div>
  );
};

export default EventsList;
