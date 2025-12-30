import React from "react";
import { EventReview } from "../../types/interfaces";
import { RatingStar } from "../common";
import helpers from "../../_helpers/common";

interface NPOReviewCardProps {
  reviews: EventReview[];
  reviewtype: number;
}

const NPOReviewCard: React.FC<NPOReviewCardProps> = ({ reviews, reviewtype }) => {
  //console.log('npo reviews', reviews)
  return (
    <>
      {reviews.map((item, index) => (
        <div key={index} className="card mt-5 p-3">
          <div className="row gy-4 align-items-start">
            {/* Profile Info */}
            <div className="col-md-3 col-12 d-flex align-items-start">
                <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                  <div className="symbol-label">
                    <img
                      src={reviewtype === 1 ? item?.created_by?.imagepath : item?.student_id?.imagepath}
                      alt="profile"
                      className="w-100 h-100"
                    />
                  </div>
                </div>
                <div className="d-flex flex-column text-break">
                  <span className="text-gray-800 text-hover-primary fw-semibold">
                    {reviewtype === 1 ? item?.created_by?.fullname : item?.student_id?.fullname}
                  </span>
                  <span>{reviewtype === 1 ? item?.created_by?.email : item?.student_id?.email}</span>
                </div>
            </div>

            {/* Rating, Message */}
            <div className="col-12 col-md-8">
              <div className="d-flex mb-3 flex-column flex-md-row justify-content-between flex-wrap">
                <RatingStar rating={item?.rating} />
                <span className="ms-5 fs-5">
                  {helpers.convertDateTime(item?.created_at, "DD MMM YYYY")}
                </span>
              </div>
              <p className="fw-bold mb-2">{item?.title}</p>
              <p className="mb-3" style={{ overflowWrap: 'anywhere' }}>{item?.message}</p>
            </div>

          </div>
        </div>
      ))}
    </>
  );
};

export default NPOReviewCard;
