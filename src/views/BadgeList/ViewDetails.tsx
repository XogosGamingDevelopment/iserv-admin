import React from "react";
import { BadgeList } from "../../types/interfaces";

interface viewDetailProps {
  badgeInfo: BadgeList | null;
}
const ViewDetails: React.FC<viewDetailProps> = (props) => {
  const { badgeInfo } = props || {};

  return (
    <>
      <div className="modal-header">
        <h2>Badge Detail</h2>
      </div>
      {/* Modal Body */}
      <div className="modal-body mx-xl-1">
        <div className="card ">
          <div className="card-body d-flex flex-center flex-column py-9 px-5">
            <div className="symbol symbol-90px symbol-square p-2 mb-5 border shadow">
              <img
                src={
                  badgeInfo?.imagepath
                    ? badgeInfo?.imagepath
                    : "./assets/media/svg/blank-image.svg"
                }
                alt={badgeInfo?.title}
              />
            </div>

            <span className="fs-4 text-gray-800 text-hover-primary fw-bold mb-0">
              {badgeInfo?.title}
            </span>

            <div className="fw-semibold text-gray-500 mb-6 text-center">
              {badgeInfo?.description}
            </div>

            <div className="d-flex flex-center flex-wrap mb-4">
              <div className="border border-dashed rounded min-w-90px py-3 px-4 mx-2 mb-3">
                <div className="d-flex align-items-center">
                  <i className="ki-duotone ki-abstract-26 fs-3 text-success me-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                  <div className="fs-2 fw-bold counted">
                    {badgeInfo?.points}
                  </div>
                </div>
                <div className="fw-semibold fs-6 text-gray-500">Points</div>
              </div>

              <div className="border border-dashed rounded min-w-90px py-3 px-4 mx-2 mb-3">
                <div className="d-flex align-items-center">
                  <i className="ki-duotone ki-time fs-3 text-info me-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                  <div className="fs-2 fw-bold counted">{badgeInfo?.hours}</div>
                </div>
                <div className="fw-semibold fs-6 text-gray-500">Hours</div>
              </div>
            </div>
            <div className="text-center">
              <span className="fw-semibold text-gray-600 mb-1">
                Badge For:{" "}
              </span>
              <span className="fs-5 fw-bold text-dark mb-0">
                {badgeInfo?.badgefor}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Modal content end */}
    </>
  );
};

export default ViewDetails;
