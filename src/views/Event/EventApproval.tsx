import React, { useEffect, useRef, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { EventDates } from "../../types/interfaces";
import helpers from "../../_helpers/common";
import ContentLoader from "../common/ContentLoader";
import useCommonActions from "../../hooks/useCommonActions";
import badges from "../../_helpers/badgeHelper";
import { useModalState } from "../../hooks/useModalState";

interface props {
  eventId: string;
  eventTitle: string;
  is_recuring: number;
  getListData: () => void;
}

const EventApproval: React.FC<props> = ({
  eventTitle,
  eventId,
  is_recuring,
  getListData,
}) => {
  const axiosInstance = useAxios();
  const { changeApprovalStatus } = useCommonActions();
    const { handleCloseModal } = useModalState();
  const [eventDates, setEventDates] = useState<EventDates[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isIndeterminate, setIsIndeterminate] = useState<boolean>(false);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const initialRequest = useRef(false);

  useEffect(() => {
    if (!initialRequest.current) {
      initialRequest.current = true;
      getEventDates();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedRows.length) {
      setIsIndeterminate(false);
    } else setIsIndeterminate(true);

    if (selectedRows.length === eventDates.length && eventDates.length > 0) {
      setIsIndeterminate(false);
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedRows, eventDates]);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const getEventDates = async () => {
    setIsLoading(true);
    try {
      const response: any = await axiosInstance({
        url: "events/event-detail",
        method: "GET",
        data: { eventId: eventId },
      });
      console.log("Event Dates Response: ", response.data.event_dates);
      setEventDates(response.data.event_dates);
    } catch (error: any) {
      console.error("Error in api request:", error);
    } finally {
      //setIsLoading(false);
      setSelectedRows([]);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]); //unselect all
    } else {
      setSelectedRows(eventDates.map((item) => item._id)); //select all ids
    }
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id);
      } else {
        setIsIndeterminate(true);
        return [...prev, id];
      }
    });
  };

  const updateApprovalStatus = () => {
    const commaSeparatedIds = selectedRows.join(',');
    changeApprovalStatus({
      itemId: commaSeparatedIds,
      url: "events/update-approval-status",
      is_recuring: is_recuring,
      callback: getListData,
    });
    handleCloseModal();
  };

  return (
    <div className="p-4">
      <h5 className="modal-title">Manage Approval Status</h5>
      <span className="text-muted small ms-2">{eventTitle}</span>

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary p-2"
          type="button"
          onClick={updateApprovalStatus}
          hidden={selectedRows.length === 0} // only show if rows selected
        >
          Select Approval Status
        </button>
      </div>

      {/* Scrollable wrapper for table */}
      <div
        className={` table-responsive ${
          isLoading ? "overlay overlay-block" : ""
        } `}
        style={{ maxHeight: "450px" }}
      >
        <table className="table table-sm table-hover table-rounded table-striped border gy-4 gs-4">
          <thead>
            <tr className="fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200">
              <th className="min-w-50px text-center justify-content-center">
                <div className="form-check form-check-sm">
                  <input
                    className="form-check-input cursor-pointer"
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectAll}
                    ref={checkboxRef}
                    // indeterminate={}
                  />
                </div>
              </th>
              <th className="min-w-200px">Event Date</th>
              <th className="min-w-200px">Approval Status</th>
            </tr>
          </thead>
          <tbody className="fw-semibold text-gray-600">
            {!eventDates || eventDates.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No Content Found
                </td>
              </tr>
            ) : (
              <>
                {eventDates.map((item) => (
                  <tr key={item._id} style={{backgroundColor: '#f1f3f9'}}>
                    <td>
                      <div className="form-check form-check-sm">
                        <input
                          className="form-check-input cursor-pointer"
                          type="checkbox"
                          checked={selectedRows.includes(item._id)}
                          onChange={() => handleRowSelect(item._id)}
                        />
                      </div>
                    </td>
                    <td>
                      {helpers.convertDateTime(item?.date, "DD MMM YYYY")}
                    </td>
                    <td>
                      {badges.adminApprovalBadge(
                        item.approval_status ?? 0,
                        item?.approvalstatusname ?? ""
                      )}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
        {/*Content Loader Start*/}
        {isLoading && <ContentLoader />}
        {/*Content Loader End*/}
      </div>

      {/* Modal Footer */}
      {/* <div className="modal-footer">
        <button type="button" className="btn btn-light" data-bs-dismiss="modal">
          Cancel
        </button>
        <button type="button" className="btn btn-primary">
          Save Changes
        </button>
      </div> */}
    </div>
  );
};

export default EventApproval;
