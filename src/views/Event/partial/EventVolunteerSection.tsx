import moment from "moment";
import helpers from "../../../_helpers/common";
import { TooltipWrapper } from "../../common";
import badges from "../../../_helpers/badgeHelper";
import { Link } from "react-router-dom";
import React from "react";
import { EventDates, Events, EventStudent } from "../../../types/interfaces";
import { GroupedVolunteers } from "../ViewDetails";

interface props {
  results: Events | null;
  students: EventStudent[];
  activeVolunteers: EventStudent[] | GroupedVolunteers;
  eventDates: EventDates[];
}

const EventVolunteerSection: React.FC<props> = ({
  results,
  students,
  activeVolunteers,
  eventDates,
}) => {
  const renderVolunteerRow = (volunteer: EventStudent) => {
    let e_status = results?.event_status;
    let status_name = results?.statusname;
    if (results?.is_recuring === 1) {
      const date_info = recuringEventInfo(volunteer.event_date);
      if (date_info) {
        e_status = date_info.event_status;
        status_name = date_info.statusname;
      }
    }
    return (
      <tr key={volunteer._id} className="bg-white dark:bg-gray-800">
        <td className="py-2 px-2">
          <div className="d-flex gap-2 align-items-center">
            <div className="symbol symbol-circle symbol-45px overflow-hidden me-3">
              <div className="symbol-label">
                <img
                  src={volunteer.student_id?.imagepath}
                  alt={volunteer.student_id?.fullname}
                  className="w-100 h-100"
                />
              </div>
            </div>
            <div className="flex flex-col w-42 leading-tight">
              <p className="text-black m-0">{volunteer.student_id?.fullname}</p>
              <p className="text-sm font-light text-[#676767]">
                {volunteer.student_id?.email}
              </p>
            </div>
          </div>
        </td>
        <td>
          <p className="text-sm font-light">
            {helpers.convertDateTime(volunteer.event_date, "DD MMM, YYYY")}
          </p>
        </td>
        <td>
          <p className="text-sm font-light">
            {badges.eventStatusBadge(e_status ?? 0, status_name ?? "")}
          </p>
        </td>
        <td>
          <p className="text-sm font-light">
            {badges.adminApprovalBadge(
              volunteer.approval_status ?? 0,
              volunteer.approvalstatusname
            )}
          </p>
        </td>
        <td>
          {volunteer.waiverpath ? (
            <TooltipWrapper
              title="Volunteer Uploaded Waiver Form"
              placement="top"
            >
              <Link to={volunteer.waiverpath} target="_blank">
                <img
                  src="/assets/pdf-icon.svg"
                  alt="waiver-form"
                  height="30"
                  width="30"
                />
              </Link>
            </TooltipWrapper>
          ) : (
            <span className="text-gray-500 text-sm">Not Uploaded</span>
          )}
        </td>
        <td>{volunteer?.studentstatus}</td>
        <td className="text-center">
          <p className="text-sm text-[#676767] mb-0">
            {!volunteer.attendence_marked ? (
              <span className="text-black">N/A</span>
            ) : (
              `${volunteer.attendence_start_time} - ${volunteer.attendence_end_time}`
            )}
          </p>
        </td>
      </tr>
    );
  };

  const recuringEventInfo = (apply_date: Date) => {
    let filterd_date = eventDates?.filter((item) => item.date === apply_date);
    if (filterd_date && filterd_date.length > 0) {
      //return filterd_date[0].event_status;
      return filterd_date[0];
    }
  };

  return (
    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 max-h-96 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#141522]">Volunteers</h2>
        <p className="text-[#676767]">
          {results?.is_recuring !== 1
            ? `${results?.volunteers.length}/${results?.volunteers_count}`
            : `${results.volunteers_count} (Per Event)`}
        </p>
        {!students?.length || !activeVolunteers?.length ? (
          <div className="p-3 border rounded-md text-center text-gray-500">
            No Volunteers Found
          </div>
        ) : (
          <div
            className="overflow-x-auto"
            style={{ maxHeight: "50vh", overflowY: "auto" }}
          >
            <table className="w-100 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-2">Student</th>
                  <th className="px-4 py-2">Event Date</th>
                  <th className="px-4 py-2">Event Status</th>
                  <th className="px-4 py-2">Admin Approval</th>
                  <th className="px-4 py-2">Waiver</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {results?.is_recuring === 1 &&
                typeof activeVolunteers === "object" &&
                !Array.isArray(activeVolunteers) ? (
                  Object.entries(activeVolunteers).map(([date, vols]) => (
                    <React.Fragment key={date}>
                      <tr className="bg-gray-50">
                        <td
                          colSpan={7}
                          className="px-6 py-2 font-semibold text-gray-700"
                        >
                          <div className="d-flex gap-4">
                            <div>
                              Event Date:{" "}
                              {helpers.convertDateTime(
                                moment(date).toDate(),
                                "DD MMM, YYYY"
                              )}
                            </div>
                            <div>|</div>
                            <div>Volunteer Count: {vols.length}</div>
                          </div>
                        </td>
                      </tr>
                      {vols.map(renderVolunteerRow)}
                    </React.Fragment>
                  ))
                ) : Array.isArray(activeVolunteers) &&
                  activeVolunteers.length > 0 ? (
                  activeVolunteers.map(renderVolunteerRow)
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      No Volunteer Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventVolunteerSection;
