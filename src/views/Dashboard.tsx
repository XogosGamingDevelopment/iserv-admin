import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import useAxios from "../hooks/useAxios";
import { User, IDashboard } from "../types/interfaces";
import { Link } from "react-router-dom";

function Dashboard() {
  const axiosInstance = useAxios();
  const user = useSelector((state: RootState) => state.user.user);
  // console.log("user", user);
  const [dashboarddata, setDashboardData] = useState<IDashboard>({
    event_count: 0,
    npo_count: 0,
    student_count: 0,
    parent_count: 0,
    teacher_count: 0,
    complaint_count: 0,
    image_approval_count: 0,
    volunteer_approval_count: 0,
    review_approval_count: 0,
    cancelled_event_count: 0,
    completed_event_count: 0,
  });
  const [currentuser, setCurrentUser] = useState<User | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const isInitialRender = useRef(false);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    getDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDashboardData = async () => {
    // setIsLoading(true);
    try {
      const response: any = await axiosInstance({
        url: "dashboard/dashboard-data",
        method: "GET",
      });
      //console.log('dashboard response', response.data);
      setDashboardData({
        ...dashboarddata,
        event_count: response.data.event_count,
        npo_count: response.data.npo_count,
        student_count: response.data.student_count,
        parent_count: response.data.parent_count,
        teacher_count: response.data.teacher_count,
        complaint_count: response.data.complaint_count,
        image_approval_count: response.data.image_approval_count,
        volunteer_approval_count: response.data.volunteer_approval_count,
        review_approval_count: response.data.review_approval_count,
        cancelled_event_count: response.data.cancelled_event_count,
        completed_event_count: response.data.completed_event_count,
      });
    } catch (error: any) {
      console.error("Error in api request:", error);
    } finally {
      // setTimeout(() => {
      //   setIsLoading(false);
      // }, 500);
    }
  };

  return (
    <div id="kt_content" className="content flex-column-fluid">
      <div className="row gx-5 gx-xl-0 mb-5">
        <div
          className="card border-transparent"
          data-bs-theme="light"
          style={{ backgroundColor: "#1C325E", height: "105px" }}
        >
          <div className="card-body d-flex ps-xl-15">
            <div className="m-0">
              <div className="position-relative fs-2x z-index-2 fw-bold text-white mb-0">
                <span className="me-1">Welcome, {currentuser?.fullname}</span>
              </div>
            </div>
            <img
              src="/assets/media/illustrations/17-dark.png"
              className="position-absolute me-3 bottom-0 end-0 h-100px"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="row gx-5 gx-xl-10">
        {/*Main content area start*/}
        <div className="col-xl-12">
          {/*Tabs content area start*/}
          <div className="row gx-5 gx-xl-10">
            <div className="col-xl-12 mb-10">
              <div className="card card-flush h-xl-100">
                <div className="card-body">
                  <div className="">
                    <div className="row g-3 g-lg-6 mb-5">
                      <Link className="col-12 col-sm-6 col-md-4 col-lg-3 cursor-pointer" to={'/event-list'}>
                        <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                          <div className="symbol symbol-30px me-5 mb-8">
                            <span className="symbol-label">
                              <i className="ki-duotone ki-calendar-tick fs-3x text-primary">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                                <span className="path4"></span>
                                <span className="path5"></span>
                                <span className="path6"></span>
                              </i>
                            </span>
                          </div>
                          <div className="m-0">
                            <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                              {dashboarddata.event_count}
                            </span>
                            <span className="text-gray-500 fw-semibold fs-6">
                              Total Events
                            </span>
                          </div>
                        </div>
                      </Link>
                      <Link className="col-12 col-sm-6 col-md-4 col-lg-3 cursor-pointer" to={'/reported-list'}>
                        <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                          <div className="symbol symbol-30px me-5 mb-8">
                            <span className="symbol-label">
                              <i className="ki-duotone ki-message-notif fs-3x text-primary">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                                <span className="path4"></span>
                                <span className="path5"></span>
                              </i>
                            </span>
                          </div>
                          <div className="m-0">
                            <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                              {dashboarddata.complaint_count}
                            </span>
                            <span className="text-gray-500 fw-semibold fs-6">
                              Complaints & Issue
                            </span>
                          </div>
                        </div>
                      </Link>
                      <Link className="col-12 col-sm-6 col-md-4 col-lg-3 cursor-pointer" to={'/npo-list'}>
                        <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                          <div className="symbol symbol-30px me-5 mb-8">
                            <span className="symbol-label">
                              <i className="ki-duotone ki-people fs-3x text-primary">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                                <span className="path4"></span>
                                <span className="path5"></span>
                              </i>
                            </span>
                          </div>
                          <div className="m-0">
                            <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                              {dashboarddata.npo_count}
                            </span>
                            <span className="text-gray-500 fw-semibold fs-6">
                              Registered NPO
                            </span>
                          </div>
                        </div>
                      </Link>
                      <Link className="col-12 col-sm-6 col-md-4 col-lg-3 cursor-pointer" to={'/student-list'}>
                        <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                          <div className="symbol symbol-30px me-5 mb-8">
                            <span className="symbol-label">
                              <i className="ki-duotone ki-people fs-3x text-primary">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                                <span className="path4"></span>
                                <span className="path5"></span>
                              </i>
                            </span>
                          </div>
                          <div className="m-0">
                            <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                              {dashboarddata.student_count}
                            </span>
                            <span className="text-gray-500 fw-semibold fs-6">
                              Registered Students
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="row g-3 g-lg-6 mb-5">
                      <Link className="col-12 col-sm-6 col-md-4 col-lg-3" to={'/teacher-list'}>
                        <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                          <div className="symbol symbol-30px me-5 mb-8">
                            <span className="symbol-label">
                              <i className="ki-duotone ki-people fs-3x text-primary">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                                <span className="path4"></span>
                                <span className="path5"></span>
                              </i>
                            </span>
                          </div>
                          <div className="m-0">
                            <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                              {dashboarddata.teacher_count}
                            </span>
                            <span className="text-gray-500 fw-semibold fs-6">
                              Registered Teachers
                            </span>
                          </div>
                        </div>
                      </Link>
                      <Link className="col-12 col-sm-6 col-md-4 col-lg-3" to={'/parent-list'}>
                        <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                          <div className="symbol symbol-30px me-5 mb-8">
                            <span className="symbol-label">
                              <i className="ki-duotone ki-people fs-3x text-primary">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                                <span className="path4"></span>
                                <span className="path5"></span>
                              </i>
                            </span>
                          </div>
                          <div className="m-0">
                            <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                              {dashboarddata.parent_count}
                            </span>
                            <span className="text-gray-500 fw-semibold fs-6">
                              Registered Parents
                            </span>
                          </div>
                        </div>
                      </Link>
                      <Link className="col-12 col-sm-6 col-md-4 col-lg-3" to={'/approval-event-image-list'}>
                        <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                          <div className="symbol symbol-30px me-5 mb-8">
                            <span className="symbol-label">
                              <i className="ki-duotone ki-picture fs-3x text-primary">
                                <span className="path1"></span>
                                <span className="path2"></span>
                              </i>
                            </span>
                          </div>
                          <div className="m-0">
                            <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                              {dashboarddata.image_approval_count}
                            </span>
                            <span className="text-gray-500 fw-semibold fs-6">
                              Pending Image Approval
                            </span>
                          </div>
                        </div>
                      </Link>
                      <Link className="col-12 col-sm-6 col-md-4 col-lg-3" to={'/approval-volunteer-list'}>
                        <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                          <div className="symbol symbol-30px me-5 mb-8">
                            <span className="symbol-label">
                              <i className="ki-duotone ki-people fs-3x text-primary">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                                <span className="path4"></span>
                                <span className="path5"></span>
                              </i>
                            </span>
                          </div>
                          <div className="m-0">
                            <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                              {dashboarddata.volunteer_approval_count}
                            </span>
                            <span className="text-gray-500 fw-semibold fs-6">
                              Pending Volunteer Approval
                            </span>
                          </div>
                        </div>
                      </Link>
                      <Link className="col-12 col-sm-6 col-md-4 col-lg-3" to={'/approval-review-list'}>
                        <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                          <div className="symbol symbol-30px me-5 mb-8">
                            <span className="symbol-label">
                              <i className="ki-duotone ki-messages fs-3x text-primary">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                                <span className="path4"></span>
                                <span className="path5"></span>
                              </i>
                            </span>
                          </div>
                          <div className="m-0">
                            <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                              {dashboarddata.review_approval_count}
                            </span>
                            <span className="text-gray-500 fw-semibold fs-6">
                              Pending Feedback Review{" "}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <Link className="col-12 col-sm-6 col-md-4 col-lg-3" to={'/event-list?event_status=3'}>
                        <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                          <div className="symbol symbol-30px me-5 mb-8">
                            <span className="symbol-label">
                              <i className="ki-duotone ki-cross-circle fs-3x text-danger">
                                <span className="path1"></span>
                                <span className="path2"></span>
                              </i>
                            </span>
                          </div>
                          <div className="m-0">
                            <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                              {dashboarddata.cancelled_event_count}
                            </span>
                            <span className="text-gray-500 fw-semibold fs-6">
                              Cancelled Events
                            </span>
                          </div>
                        </div>
                      </Link>
                      <Link className="col-12 col-sm-6 col-md-4 col-lg-3" to={'/event-list?event_status=2'}>
                        <div className="bg-gray-100 bg-opacity-70 rounded-2 px-6 py-5">
                          <div className="symbol symbol-30px me-5 mb-8">
                            <span className="symbol-label">
                              <i className="ki-duotone ki-verify fs-3x text-success">
                                <span className="path1"></span>
                                <span className="path2"></span>
                              </i>
                            </span>
                          </div>
                          <div className="m-0">
                            <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">
                              {dashboarddata.completed_event_count}
                            </span>
                            <span className="text-gray-500 fw-semibold fs-6">
                              Completed Events
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Tabs content area end*/}
          {/*Chart content area start*/}
          {/*<div className="row g-5 g-xl-10">
            <div className="col-xl-12">
              <div className="card card-flush h-xl-100">
                <div className="card-header pt-7">
                  <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bold text-gray-800">
                      Event Statastic
                    </span>
                    <span className="text-gray-500 mt-1 fw-semibold fs-6">
                      Monthly Event
                    </span>
                  </h3>
                </div>
                <div className="card-body d-flex align-items-end px-0 pt-3 pb-5">
                  <div
                    id="kt_charts_widget_18_chart"
                    className="h-325px w-100 min-h-auto ps-4 pe-6"
                    style={{ minHeight: "340px" }}
                  >
                    <div
                      id="apexchartswo6sexmv"
                      className="apexcharts-canvas apexchartswo6sexmv apexcharts-theme-"
                      style={{ width: "935.5px", height: "325px" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
			  </div>*/}
          {/*Chart content area end*/}
        </div>
        {/*Main content area end*/}
        {/*Notification content area start*/}
        {/*<div className="col-xl-3">
          <div className="card card-flush h-xl-100">
            <div className="card-header pt-7">
              <h3 className="card-title align-items-start flex-column">
                <span className="card-label fw-bold text-gray-900">
                  Notifications
                </span>
              </h3>
            </div>
            <div className="card-body">
              <div
                className="hover-scroll-overlay-y pe-6 me-n6"
                style={{ height: "415px" }}
              >
              </div>
            </div>
          </div>
			</div>*/}
        {/*Notification content area end*/}
      </div>
    </div>
  );
}

export default Dashboard;
