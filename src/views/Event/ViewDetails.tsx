import React, { useState, useEffect, useRef } from "react";
import useAxios from "../../hooks/useAxios";
import ReviewsList from "./ReviewsList";
import { PageToolbar, TooltipWrapper, EventMapLeaflet } from "../common";
import InfoBlock from "../common/InfoBlock";
import helpers from "../../_helpers/common";
import { useParams } from "react-router-dom";
import {
  EventDates,
  EventImages,
  Events,
  EventStudent,
} from "../../types/interfaces";
import ImageGallery from "./ImageGallery";
import EventDateBadge from "./partial/EventDateBadge";
import EventVolunteerSection from "./partial/EventVolunteerSection";

export type GroupedVolunteers = { [date: string]: EventStudent[] };

const ViewDetails: React.FC = () => {
  const axiosInstance = useAxios();
  const { event_id } = useParams();
  const [results, setResults] = useState<Events | null>(null);
  const [students, setStudents] = useState<EventStudent[]>([]);
  const [reviewtype, setReviewType] = useState(1);
  const [eventImages, setEventImages] = useState<EventImages[] | null>(null);
  const [eventDates, setEventDates] = useState<EventDates[]>([]);
  const [activeVolunteers, setActiveVolunteers] = useState<
    EventStudent[] | GroupedVolunteers
  >([]);
  const initialRequest = useRef(false);

  useEffect(() => {
    if (!initialRequest.current) {
      initialRequest.current = true;
      getDetailData();
    }
    return () => {
      setResults(null);
      setStudents([]);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (students?.length > 0) {
      //Filter out volunteer canceled and rejected volunteers
      const filtered = students.filter(
        (v) => !v.cancel_volunteer && v.approval_status !== 3
      );

      if (results?.is_recuring === 1) {
        //Group by date
        const grouped = filtered.reduce((acc, volunteer) => {
          const date = new Date(volunteer.event_date)
            .toISOString()
            .split("T")[0];
          if (!acc[date]) acc[date] = [];
          acc[date].push(volunteer);
          return acc;
        }, {} as Record<string, EventStudent[]>);

        setActiveVolunteers(grouped);
      } else {
        //Just use flat array
        setActiveVolunteers(filtered);
      }
    } else {
      //No volunteers
      setActiveVolunteers(results?.is_recuring === 1 ? {} : []);
    }
  }, [students, results?.is_recuring]);

  const getDetailData = async () => {
    try {
      const response: any = await axiosInstance({
        url: "events/event-detail",
        method: "GET",
        data: { eventId: event_id },
      });
      // console.log("event details response", response);
      setResults(response.data.event_details);
      setStudents(response.data.event_volunteers);
      setEventImages(response.data.event_images);
      setEventDates(response.data.event_dates);
    } catch (error: any) {
      console.error("Error in api request:", error);
    }
  };

  return (
    <>
      {/*Page toolbar Area Start*/}
      <PageToolbar
        title="Event Detail"
        step1={{ title: "Event List", link: "/event-list" }}
        step2={{ title: "Event Detail" }}
      />
      {/*Page toolbar Area End*/}
      <div id="kt_content" className="content flex-column-fluid">
        <div className="card mb-6 mb-xl-2">
          {/* Banner Image */}
          <div className="card-body p-5 pb-0 shadow">
            <div
              className="w-100 rounded h-250px"
              style={{
                backgroundImage: `url(${results?.bannerpath})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></div>
          </div>

          {/* Header */}
          <div className="card-header">
            <div className="d-flex flex-center">
              <div className="symbol symbol-80px mb-2 mt-2 me-3">
                <span
                  className="symbol-label"
                  style={{ backgroundImage: `url(${results?.displaypath})` }}
                ></span>
              </div>
              <div className="px-4">
                <div className="card-title fs-3 fw-bold">{results?.title}</div>
                <span className="badge badge-light-primary fs-7">
                  {results?.statusname}
                </span>
              </div>
            </div>
            {/* Right Side approval Status */}
            <div className="d-flex justify-content-end align-items-center gap-3 py-5 mb-5">
              <span className="fw-semibold text-muted">Approval Status:</span>
              <span className="badge badge-light-primary fs-6">
                {results?.approvalstatusname}
              </span>
            </div>
          </div>
          {/* Info */}
          <div className="card-body pt-5 pb-0">
            <div className="row">
              {/* Left column */}
              <div className="col-md-8">
                <div className="row g-4 mb-4">
                  <InfoBlock
                    label="Organization Name"
                    value={results?.npo_id?.organization_name}
                  />
                  <InfoBlock
                    label={
                      results?.is_recuring === 1 ? "Start Date" : "Event Date"
                    }
                    value={helpers.convertDateTime(
                      results?.start_date,
                      "DD MMM YYYY"
                    )}
                  />
                  {results?.is_recuring === 1 && (
                    <InfoBlock
                      label="End Date"
                      value={helpers.convertDateTime(
                        results?.end_date,
                        "DD MMM YYYY"
                      )}
                    />
                  )}
                  <InfoBlock
                    label="Age Group"
                    value={results?.age_group?.title || "-"}
                  />
                  <InfoBlock
                    label="Event Time"
                    value={`${results?.start_time} - ${results?.end_time}`}
                  />
                  <InfoBlock
                    label="Event Interest"
                    value={results?.interest_id?.title || "-"}
                  />
                  {/* Waiver Form */}
                  <div className="col-md-3">
                    <div className="fs-6 fw-semibold mb-2">Waiver Form:</div>
                    <a
                      href={results?.waiverpath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-icon text-danger"
                    >
                      <TooltipWrapper title="View Waiver PDF" placement="top">
                        <i
                          className="bi bi-file-pdf text-danger"
                          style={{ fontSize: "2.5rem" }}
                        ></i>
                        
                      </TooltipWrapper>
                    </a>
                  </div>
                </div>

                {/* Description and Special Condition */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="fs-6 fw-bold mb-2">Description:</div>
                      <div className="text-muted fs-7">
                        {results?.description || "No description provided"}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="fs-6 fw-bold mb-2">
                        Special Condition:
                      </div>
                      <div className="text-muted fs-7">
                        {results?.special_condition ||
                          "No other special conditions are there"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="col-md-4">
                <div className="row mt-5">
                  <div className="col-md-12 mb-5">
                    <div className="fs-5 px-3">
                      <span className="">Location :</span>
                      <span className="fs-1hx fw-bold text-gray-900 me-2 lh-1 ls-n2">
                        {results?.address}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="rounded">
                      <EventMapLeaflet
                        height="200px"
                        width="100%"
                        zoom={5}
                        lat={results?.location?.coordinates[1]}
                        lng={results?.location?.coordinates[0]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-bs-toggle="tab"
                  href="#volunteers"
                >
                  Volunteers
                </a>
              </li>
              {results?.is_recuring === 1 && (
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#event_dates"
                  >
                    Event Dates
                  </a>
                </li>
              )}
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#reviews">
                  Reviews
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#event_images"
                >
                  Event Images
                </a>
              </li>
            </ul>
            <div className="tab-content mb-5" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="volunteers"
                role="tabpanel"
              >
                {/* Event Volunteer Section */}
                <EventVolunteerSection
                  results={results}
                  students={students}
                  activeVolunteers={activeVolunteers}
                  eventDates={eventDates}
                />
              </div>
              <div className="tab-pane fade" id="event_dates" role="tabpanel">
                {/* Event Dates */}
                {results?.is_recuring === 1 && eventDates?.length !== 0 && (
                  <EventDateBadge eventDates={eventDates} />
                )}
              </div>
              <div className="tab-pane fade" id="reviews" role="tabpanel">
                {/*Review Tabs Start*/}
                <div className="row mt-5 mb-5">
                  <h4 className="ms-3">Reviews</h4>
                  <br />
                  <div className="d-flex mb-3">
                    <span
                      className={`fs-6 ms-5 boder-secondary border-bottom ${
                        reviewtype === 1
                          ? "text-gray-900 fw-bold border-dark"
                          : "text-muted fw-semibold"
                      } border-4 cursor-pointer`}
                      onClick={() => setReviewType(1)}
                    >
                      NPO
                    </span>
                    <span
                      className={`fs-6 ms-5 boder-secondary border-bottom ${
                        reviewtype === 2
                          ? "text-gray-900 fw-bold border-dark"
                          : "text-muted fw-semibold"
                      } border-4 cursor-pointer`}
                      onClick={() => setReviewType(2)}
                    >
                      Volunteer
                    </span>
                  </div>
                </div>

                <div className="mb-5" style={{ maxHeight: "50vh", overflowY: "auto" }}>
                  <ReviewsList reviewtype={reviewtype} eventId={results?._id} />
                </div>
                {/*Review Tabs End*/}
              </div>
              <div className="tab-pane fade " id="event_images" role="tabpanel">
                {/* Event Images */}
                <div className="mb-4">
                  <div className="fs-5 fw-bold mb-2">Event Images:</div>
                  {eventImages?.length === 0 ? (
                    <div className="d-flex gap-3 flex-wrap">
                      No Images Uploaded
                    </div>
                  ) : (
                    <div className="card mb-5 px-4 py-4" style={{ maxHeight: "40vh", overflowY: "auto" }}>
                      <ImageGallery eventImages={eventImages} is_recuring={results?.is_recuring}/>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewDetails;
