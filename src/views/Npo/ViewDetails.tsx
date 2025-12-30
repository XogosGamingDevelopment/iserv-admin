import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import EventsList from "./EventsList";
import { PageToolbar } from "../common";
import useAxios from "../../hooks/useAxios";
import { NpoProfile } from "../../types/interfaces";
import useCommonActions from "../../hooks/useCommonActions";

const ViewDetails: React.FC = () => {
  const axiosInstance = useAxios();
  const { blockUnblockUser } = useCommonActions();
  const { npo_id } = useParams();
  const [results, setResults] = useState<NpoProfile | null>(null);
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
        url: "users/npo-details",
        method: "GET",
        data: { npoId: npo_id },
      });
      // console.log('npo details response', response);
      setResults(response.data.npo_details);
    } catch (error: any) {
      console.error("Error in api request:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const blockNpo = (itemid: string) => {
    let new_status = results?.npo_user_id?.status === 1 ? 2 : 1;
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
        title="NPO Details"
        step1={{ title: "NPO List", link: "/npo-list" }}
        step2={{ title: "NPO Details" }}
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
                    src={results?.npo_user_id?.imagepath}
                    alt="profile-image"
                  />
                  {/*<div className="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-body h-20px w-20px"></div>*/}
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-gray-900 text-hover-primary fs-2 fw-bold me-1">
                        {results?.organization_name}
                      </span>
                      {results?.npo_user_id?.status === 1 && (
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
                        NPO
                      </span>
                      <span className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                        <i className="ki-duotone ki-geolocation fs-4 me-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        {results?.physical_address}
                      </span>
                      <span className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                        <i className="ki-duotone ki-sms fs-4 me-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        {results?.organisation_email}
                      </span>
                      <span className="d-flex align-items-center text-gray-500 text-hover-primary mb-2">
                        <i className="ki-duotone ki-phone fs-4 me-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        {`+` + results?.phone_country_code}{" "}
                        {results?.organisation_phone}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex my-4">
                    {results?.npo_user_id?.status !== 0 && (
                      <>
                        <button
                          className="btn btn-sm btn-light btn-active-light-primary me-2 border border-gray-500"
                          onClick={() =>
                            blockNpo(results?.npo_user_id?._id ?? "")
                          }
                        >
                          {results?.npo_user_id?.status === 1
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
                            {results?.total_events}
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
                            {results?.completed_events}
                          </div>
                        </div>
                        <div className="fw-semibold fs-6 text-gray-500">
                          Completed Events
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
                            {results?.total_event_hours}
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
        {/*About NPO Start*/}
        <div className="card mb-4 bg-light">
          <div className="card-body py-12">
            <div className="fw-bold fs-2 text-gray-500">
              About Organisation:
            </div>
            <span>{results?.organization_about}</span>
          </div>
        </div>
        {/*About NPO End*/}
        {/*Event List Start*/}
        <div className="card mb-6 mb-xl-9">
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
                  Upcomming
                </span>
              </div>
            </div>
            <div className="mb-5">
              <EventsList
                eventtype={eventtype}
                npoId={results?.npo_user_id?._id}
              />
            </div>
            {/* Tabs End*/}
          </div>
        </div>
        {/*Event List End*/}
      </div>
    </>
  );
};

export default ViewDetails;
