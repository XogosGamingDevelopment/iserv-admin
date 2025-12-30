import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
//import ContentLoader from '../common/ContentLoader';
import EventsList from "./EventsList";
import { PageToolbar } from "../common";
import useAxios from "../../hooks/useAxios";
import { StudentProfile } from "../../types/interfaces";
import useCommonActions from "../../hooks/useCommonActions";

const ViewDetails: React.FC = () => {
  const axiosInstance = useAxios();
  const { blockUnblockUser } = useCommonActions();
  const { student_id } = useParams();
  const [results, setResults] = useState<StudentProfile | null>(null);
  const [eventtype, setEventType] = useState(1);
  // const [isLoading, setIsLoading] = useState(false);
  const initialRequest = useRef(false);

  useEffect(() => {
    if (!initialRequest.current) {
      initialRequest.current = true;
      getDetailData();
    }
    return () => {
      setResults(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeEventType = (event_type: number) => {
    setEventType(event_type);
  };

  const getDetailData = async () => {
    // setIsLoading(true);
    try {
      const response: any = await axiosInstance({
        url: "users/student-detail",
        method: "GET",
        data: { studentId: student_id },
      });
      // console.log("student details response", response);
      setResults(response.data.student_detail);
    } catch (error: any) {
      console.error("Error in api request:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const blockStudent = (itemid: string) => {
    let new_status = results?.student_id?.status === 1 ? 2 : 1;
    blockUnblockUser(
      itemid,
      new_status,
      "users/block-unblock-user",
      getDetailData
    );
  };

  return (
    <>
      {/*Page toolbar Area Start*/}
      <PageToolbar
        title="Student Detail"
        step1={{ title: "Student List", link: "/student-list" }}
        step2={{ title: "Student Detail" }}
      />
      {/*Page toolbar Area End*/}
      <div id="kt_content" className="content flex-column-fluid">
        {/* Top Bar Start*/}
        <div className="card mb-5 mb-xxl-8">
          <div className="card-body pt-9 pb-0">
            <div className="d-flex flex-wrap flex-sm-nowrap">
              <div className="me-7 mb-4">
                <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative border">
                  <img
                    className="w-100"
                    src={results?.student_id?.imagepath}
                    alt={results?.student_id?.fullname}
                  />
                  {/*<div className="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-body h-20px w-20px"></div>*/}
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-gray-900 text-hover-primary fs-2 fw-bold me-1">
                        {results?.student_id?.fullname}
                      </span>
                      {results?.student_id?.status === 1 && (
                        <span>
                          <i className="ki-duotone ki-verify fs-1 text-success">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                        </span>
                      )}
                    </div>
                    <div className="d-flex flex-wrap fw-semibold fs-6 mb-4 pe-2">
                      <span className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                        <i className="ki-duotone ki-profile-circle fs-4 me-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                        Student
                      </span>
                      <span className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                        <i className="ki-duotone ki-geolocation fs-4 me-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        {results?.student_id?.address}
                      </span>
                      <span className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                        <i className="ki-duotone ki-sms fs-4 me-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        {results?.student_id?.email}
                      </span>
                      <span className="d-flex align-items-center text-gray-500 text-hover-primary mb-2">
                        <i className="ki-duotone ki-phone fs-4 me-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        {`+` + results?.student_id?.phone_country_code}{" "}
                        {results?.student_id?.phone_no}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex my-4">
                    {results?.student_id?.status !== 0 && (
                      <>
                        <button
                          className="btn btn-sm btn-light btn-active-light-primary me-2 border border-gray-500"
                          onClick={() =>
                            blockStudent(results?.student_id?._id ?? "")
                          }
                        >
                          {results?.student_id?.status === 1
                            ? "Block"
                            : "Unblock"}
                        </button>
                        {/*<button className="btn btn-sm btn-light btn-active-light-primary me-2 border border-gray-500">Delete Profile</button>*/}
                      </>
                    )}
                  </div>
                </div>
                <div className="d-flex flex-wrap flex-stack">
                  <div className="d-flex flex-column flex-grow-1 pe-8">
                    <div className="d-flex flex-wrap">
                      <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                        <div className="d-flex align-items-center">
                          <i className="ki-duotone ki-abstract-26 fs-3 text-success me-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          <div className="fs-2 fw-bold counted">
                            {results?.event_count}
                          </div>
                        </div>
                        <div className="fw-semibold fs-6 text-gray-500">
                          Total Events
                        </div>
                      </div>
                      <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                        <div className="d-flex align-items-center">
                          <i className="ki-duotone ki-abstract-26 fs-3 text-success me-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          <div className="fs-2 fw-bold counted">
                            {results?.total_coins}
                          </div>
                        </div>
                        <div className="fw-semibold fs-6 text-gray-500">
                          Total Coins
                        </div>
                      </div>
                      <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                        <div className="d-flex align-items-center">
                          <i className="ki-duotone ki-calculator fs-3 text-primary me-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          <div className="fs-2 fw-bold counted">
                            {results?.total_rating}
                          </div>
                        </div>
                        <div className="fw-semibold fs-6 text-gray-500">
                          Rating Count
                        </div>
                      </div>
                      <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                        <div className="d-flex align-items-center">
                          <i className="ki-duotone ki-star fs-3 text-warning me-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          <div className="fs-2 fw-bold counted">
                            {results?.average_rating}
                          </div>
                        </div>
                        <div className="fw-semibold fs-6 text-gray-500">
                          Average Rating
                        </div>
                      </div>
                      <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                        <div className="d-flex align-items-center">
                          <i className="ki-duotone ki-time fs-3 text-info me-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          <div className="fs-2 fw-bold counted">
                            {results?.event_hours}
                          </div>
                        </div>
                        <div className="fw-semibold fs-6 text-gray-500">
                          Event Hours
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Top Bar End*/}
        {/*Student Other Info Start*/}
        <div className="card mb-4 bg-light">
          <div className="card-body py-12">
            <div className="fw-bold fs-2 text-gray-500">Reason To Join:</div>
            <span>{results?.reason_to_join}</span>
            <div className="separator mt-5 mb-5"></div>
            <div className="fw-bold fs-2 text-gray-500">Hear About Us:</div>
            <span>{results?.hear_about_us}</span>
          </div>
        </div>
        {/*Student Other Info End*/}
        {/*Detail event list area end*/}
        {/* <div className="card mb-6 mb-xl-9"> */}
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-center mb-5">
              <div className="card-title fs-3 fw-bold px-3">Events</div>
            </div>
          </div>
          <div className="card-body pt-5 pb-0">
            {/* Tabs Start*/}
            <div className="row mt-0 mb-0">
              <div className="d-flex mb-3">
                <span
                  className={`fs-6 ms-5 boder-secondary border-bottom ${
                    eventtype === 2
                      ? "text-gray-900 fw-bold border-dark"
                      : "text-muted fw-semibold"
                  } border-4 cursor-pointer`}
                  onClick={() => changeEventType(2)}
                >
                  Completed
                </span>
                <span
                  className={`fs-6 ms-5 boder-secondary border-bottom ${
                    eventtype === 1
                      ? "text-gray-900 fw-bold border-dark"
                      : "text-muted fw-semibold"
                  } border-4 cursor-pointer`}
                  onClick={() => changeEventType(1)}
                >
                  Volunteered
                </span>
              </div>
            </div>
            <div className="mb-5">
              <EventsList eventtype={eventtype} studentId={student_id} />
            </div>
            {/* Tabs End*/}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewDetails;
