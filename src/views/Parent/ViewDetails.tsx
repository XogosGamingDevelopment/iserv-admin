import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { PageToolbar } from "../common";
import useAxios from "../../hooks/useAxios";
import ChildTab from "./partial/ChildTab";
import { User, ParentTeacherStudent } from "../../types/interfaces";
import useCommonActions from "../../hooks/useCommonActions";

const ViewDetails: React.FC = () => {
  const axiosInstance = useAxios();
  const { changeApprovalStatus, blockUnblockUser, deleteItem } =
    useCommonActions();
  const { parent_id } = useParams();
  const [results, setResults] = useState<User | null>(null);
  const [childrens, setChildrens] = useState<ParentTeacherStudent[]>([]);
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

  const getDetailData = async () => {
    // setIsLoading(true);
    try {
      const response: any = await axiosInstance({
        url: "users/parent-detail",
        method: "GET",
        data: { parentId: parent_id },
      });
      //console.log('parent details response', response);
      if (!response.error) {
        setResults(response.data.parent_detail);
        setChildrens(response.data.childrens);
      }
    } catch (error: any) {
      console.error("Error in api request:", error);
    } finally {
      // setIsLoading(false);
    }
  };

  const blockParent = (itemid: string) => {
    let new_status = results?.status === 1 ? 2 : 1;
    blockUnblockUser(
      itemid,
      new_status,
      "users/block-unblock-user",
      getDetailData
    );
  };

  const approveChild = (itemId: string, approvalstatusname?: string) => {
    changeApprovalStatus({
      itemId,
      url: "parent-child/update-approval-status",
      selectedOption: approvalstatusname,
      callback: getDetailData,
    });
  };

  const deleteChild = (itemid: string) => {
    const message = `Are you sure you want to delete the child?`;
    deleteItem(`parent-child/delete-child/${itemid}`, message, getDetailData);
  };

  return (
    <>
      {/*Page toolbar Area Start*/}
      <PageToolbar
        title="Parent Detail"
        step1={{ title: "Parent List", link: "/parent-list" }}
        step2={{ title: "Parent Detail" }}
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
                    src={results?.imagepath}
                    alt={results?.fullname}
                  />
                  {/*<div className="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-body h-20px w-20px"></div>*/}
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-gray-900 text-hover-primary fs-2 fw-bold me-1">
                        {results?.fullname}
                      </span>
                      {results?.status === 1 && (
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
                        Parent
                      </span>
                      <span className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                        <i className="ki-duotone ki-geolocation fs-4 me-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        {results?.address}
                      </span>
                      <span className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2">
                        <i className="ki-duotone ki-sms fs-4 me-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        {results?.email}
                      </span>
                      <span className="d-flex align-items-center text-gray-500 text-hover-primary mb-2">
                        <i className="ki-duotone ki-phone fs-4 me-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        {`+` + results?.phone_country_code} {results?.phone_no}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex my-4">
                    {results?.status !== 0 && (
                      <>
                        <button
                          className="btn btn-sm btn-light btn-active-light-primary me-2 border border-gray-500"
                          onClick={() => blockParent(results?._id ?? "")}
                        >
                          {results?.status === 1 ? "Block" : "Unblock"}
                        </button>
                        {/*<button className="btn btn-sm btn-light btn-active-light-primary me-2 border border-gray-500">Delete Profile</button>*/}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Top Bar End*/}
        {/*Parent Child List Start*/}
        <div className="card mb-6 mb-xl-9">
          <div className="card-header">
            <div className="d-flex flex-center mb-5">
              <div className="card-title fs-3 fw-bold px-3">Childrens</div>
            </div>
          </div>
          <div className="card-body pt-4 pb-0">
            <div className="row p-5">
              {!childrens || childrens.length === 0 ? (
                <div className="h-75">
                  <p className="text-center">No Children Found</p>
                </div>
              ) : (
                childrens.map((item, index) => (
                  <div key={item._id} className="col-md-6 mb-4">
                    <ChildTab
                      key={item._id}
                      user={item}
                      approveChild={approveChild}
                      deleteChild={deleteChild}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {/*Parent Child List End*/}
      </div>
    </>
  );
};

export default ViewDetails;
