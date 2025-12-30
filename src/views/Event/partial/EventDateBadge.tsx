import helpers from "../../../_helpers/common";
import { EventDates } from "../../../types/interfaces";

interface props {
    eventDates: EventDates[] | null;
}

const EventDateBadge: React.FC<props> = ({ eventDates }) => (
  <div className="w-100 mt-5">
    {/* Heading */}
    <h5 className="mb-3 fw-bold">Event Dates</h5>

    {/* Badge List */}
    <div className="d-flex flex-wrap gap-2">
      {eventDates?.map((event, index) => (
        <span
          key={index}
          className="badge badge-secondary fw-semibold d-inline-flex align-items-center px-4 py-3 fs-6"
        >
          <span className="svg-icon svg-icon-2 me-2 d-flex align-items-center">
            <svg
              stroke="#6c757d"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 2v4"></path>
              <path d="M16 2v4"></path>
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <path d="M3 10h18"></path>
              <path d="m9 16 2 2 4-4"></path>
            </svg>
          </span>
          <span>{helpers.convertDateTime(event?.date, "DD MMM, YYYY")}</span>
        </span>
      ))}
    </div>
  </div>
);

export default EventDateBadge;