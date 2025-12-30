import React, { useState, useEffect } from "react";
import ContentLoader from "../common/ContentLoader";
import { NPOReviewCard } from "../common";
import useAxios from "../../hooks/useAxios";
import { EventReviewProps, EventReview } from "../../types/interfaces";

const ReviewsList: React.FC<EventReviewProps> = ({ reviewtype, eventId }) => {
  const axiosInstance = useAxios();
  const [results, setResults] = useState<EventReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const isInitialRender = useRef(false);

  //Single useEffect for all changes
  useEffect(() => {
    getListData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewtype, eventId]); // No trigger, prevents double calls

  const getListData = async () => {
    //console.log('getListData function called');
    if (eventId) {
      setIsLoading(true);
      try {
        const response: any = await axiosInstance({
          url: "events/single-event-review",
          method: "GET",
          data: { review_type: reviewtype, eventId: eventId },
        });
        // console.log('events review', response);
        if (!response.error) {
          setResults(response.data.event_reviews);
        }
      } catch (error: any) {
        console.error("Error in api request:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    }
  };

  return (
    <div
      className={`card card-flush ${isLoading ? "overlay overlay-block" : ""} `}
      style={{ backgroundColor: "#D9D9D9" }}
    >
      <div className="card-body pt-0">
        <div className="">
          {!results || results.length === 0 ? (
            <div className="d-flex align-items-center justify-content-center">
              <span className="fs-1x fw-bold">No Review Found</span>
            </div>
          ) : (
            <NPOReviewCard reviews={results} reviewtype={reviewtype} />
          )}
        </div>
        {/*Content Loader Start*/}
        {isLoading && <ContentLoader />}
        {/*Content Loader End*/}
      </div>
    </div>
  );
};

export default ReviewsList;
