import React, { useCallback, useEffect, useRef, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { PageToolbar } from "../common";
import helpers from "../../_helpers/common";
import ContentLoader from "../common/ContentLoader";

interface ServiceReportStudent {
  _id: string;
  fullname?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

interface ServiceReport {
  _id: string;
  title: string;
  write_up?: string;
  description?: string;
  activity_date: string;
  hours_claimed: number;
  location: string;
  parent_email: string;
  coins_awarded: number;
  beforephotourl?: string | null;
  afterphotourl?: string | null;
  videourl?: string | null;
  parent_response_at?: string | null;
  created_at: string;
  student_id?: ServiceReportStudent | null;
}

/**
 * Admin audit view of parent-VERIFIED self-reported volunteer service
 * projects ("Service Outside iServ"). Read-only — verification is done by
 * parents; this page is for oversight of what was verified and awarded.
 */
const ServiceReportList: React.FC = () => {
  const axiosInstance = useAxios();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const isInitialRender = useRef(false);
  const [results, setResults] = useState<ServiceReport[] | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const getListData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await axiosInstance({
        url: "independent-projects/admin-approved-list",
        method: "GET",
        data: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
        },
      });
      if (response.data.list.docs.length > 0) {
        setResults((prevResults) =>
          pagination.currentPage === 1
            ? response.data.list.docs
            : [...(prevResults ?? []), ...response.data.list.docs]
        );
        setHasMore(response.data.list.hasNextPage);
      } else {
        if (pagination.currentPage === 1) {
          setResults([]);
        }
        setHasMore(false);
      }
    } catch (error: any) {
      console.error("Error in api request:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    getListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 10 &&
        hasMore &&
        !isLoading
      ) {
        setPagination((prev) => ({
          ...prev,
          currentPage: prev.currentPage + 1,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoading]);

  useEffect(() => {
    const listContainer = listRef.current;
    if (listContainer) {
      listContainer.addEventListener("scroll", handleScroll);
      return () => listContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const studentName = (r: ServiceReport) =>
    r.student_id?.fullname ||
    `${r.student_id?.first_name || ""} ${r.student_id?.last_name || ""}`.trim() ||
    "Unknown student";

  return (
    <>
      {/*Page toolbar Area Start*/}
      <PageToolbar title="Verified Service Reports" />
      {/*Page toolbar Area End*/}
      <div id="kt_content" className="content flex-column-fluid">
        <div
          className={`card card-height-width ${
            isLoading ? "overlay overlay-block" : ""
          } `}
          style={{
            minHeight: "74vh",
            maxHeight: "74vh",
          }}
        >
          <div className={"card-body overflow-hidden p-0"}>
            <div
              ref={listRef}
              className="pt-4 pb-4 px-4"
              style={{ maxHeight: "74vh", overflowY: "auto" }}
            >
              {!results?.length ? (
                <div className="d-flex justify-content-center fs-5">
                  No verified service reports yet
                </div>
              ) : (
                results?.map((report) => (
                  <div
                    key={report._id}
                    className="card rounded-4 my-3 mx-auto mb-5 bg-gray-100"
                    style={{ maxWidth: "45vw" }}
                  >
                    <div className="card-body p-4">
                      {/* Header row */}
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <div>
                          <p className="fs-4 fw-bold mb-1">{report.title}</p>
                          <p className="text-muted fs-6 mb-0">
                            by <span className="fw-semibold">{studentName(report)}</span>
                            {report.student_id?.email ? ` (${report.student_id.email})` : ""}
                          </p>
                        </div>
                        <span className="badge badge-light-success fs-6">
                          +{report.coins_awarded} coins awarded
                        </span>
                      </div>

                      {/* Meta */}
                      <div className="d-flex flex-wrap gap-4 text-muted fs-7 mt-2 mb-3">
                        <span>Activity: {helpers.convertDateTime(new Date(report.activity_date), "DD MMM, YYYY")}</span>
                        <span>Hours claimed: {report.hours_claimed}</span>
                        {report.location ? <span>Location: {report.location}</span> : null}
                        <span>Parent: {report.parent_email}</span>
                        {report.parent_response_at ? (
                          <span>
                            Verified: {helpers.convertDateTime(new Date(report.parent_response_at), "DD MMM, YYYY")}
                          </span>
                        ) : null}
                      </div>

                      {/* Write-up */}
                      <p className="fs-6 mb-3" style={{ whiteSpace: "pre-wrap" }}>
                        {report.write_up || report.description}
                      </p>

                      {/* Before / After photos */}
                      <div className="d-flex flex-wrap gap-3">
                        {report.beforephotourl ? (
                          <a href={report.beforephotourl} target="_blank" rel="noopener noreferrer" className="text-center">
                            <img
                              src={report.beforephotourl}
                              alt="before"
                              className="rounded"
                              style={{ height: "10rem", width: "10rem", objectFit: "cover" }}
                            />
                            <div className="fs-8 fw-bold text-danger mt-1">BEFORE</div>
                          </a>
                        ) : null}
                        {report.afterphotourl ? (
                          <a href={report.afterphotourl} target="_blank" rel="noopener noreferrer" className="text-center">
                            <img
                              src={report.afterphotourl}
                              alt="after"
                              className="rounded"
                              style={{ height: "10rem", width: "10rem", objectFit: "cover" }}
                            />
                            <div className="fs-8 fw-bold text-success mt-1">AFTER</div>
                          </a>
                        ) : null}
                      </div>

                      {report.videourl ? (
                        <a
                          href={report.videourl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-light mt-3"
                        >
                          Watch Video
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/*Content Loader Start*/}
          {isLoading ? <ContentLoader /> : null}
          {/*Content Loader End*/}
        </div>
      </div>
    </>
  );
};

export default ServiceReportList;
