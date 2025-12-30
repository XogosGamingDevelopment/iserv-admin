import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../redux/store'; // Adjust the path to your store
import AdminLayout from './layout/AdminLayout'
import {User} from '../types/interfaces';

function Dashboard() {
	const user = useSelector((state: RootState) => state.user.user);
	//console.log('user', user);
	const [submiting, setSubmiting] = useState(true);
	//const [currentuser, setCurrentUser] = useState({});
	const [currentuser, setCurrentUser] = useState<User | null>(null);
	
	useEffect(() => {
		if(user){
			//const parse_user = JSON.parse(user);
			//const parse_user = user ? JSON.parse(user) : null;
			setCurrentUser(user);
			//console.log('logged in  user: ', user.fullname);
		}
	}, [user])
	return (
		<div className="d-flex flex-column flex-column-fluid">
			<div id="kt_app_content" className="app-content flex-column-fluid">
				<div id="kt_app_content_container" className="app-container container-fluid">
					<div className="row gx-5 gx-xl-10 mb-5">
						<div className="card border-transparent" data-bs-theme="light" style={{ backgroundColor: '#1C325E', height: '105px' }}>
						   <div className="card-body d-flex ps-xl-15">
							  <div className="m-0">
								 <div className="position-relative fs-2x z-index-2 fw-bold text-white mb-0">
									<span className="me-1">Welcome, {currentuser?.fullname}</span>
								 </div>
							  </div>
							  <img src="/assets/media/illustrations/17-dark.png" className="position-absolute me-3 bottom-0 end-0 h-100px" alt="" />
						   </div>
						</div>
					</div>
					<div className="row gx-5 gx-xl-10">
						{/*Main content area start*/}
						<div className="col-xl-9">
							{/*Tabs content area start*/}
							<div className="row gx-5 gx-xl-10">
							   <div className="col-xl-12 mb-10">
								  <div className="card card-flush h-xl-100">
									 <div className="card-body">
										<div className="">
											<div className="row g-3 g-lg-6 mb-5">
											  <div className="col-3">
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
													   <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">37</span>
													   <span className="text-gray-500 fw-semibold fs-6">Total Events</span>
													</div>
												 </div>
											  </div>
												<div className="col-3">
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
													   <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">6</span>
													   <span className="text-gray-500 fw-semibold fs-6">Complaints & Issue</span>
													</div>
												 </div>
											  </div>									  
											  <div className="col-3">
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
													   <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">37</span>
													   <span className="text-gray-500 fw-semibold fs-6">Registered NPO</span>
													</div>
												 </div>
											  </div>
											  <div className="col-3">
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
													   <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">6</span>
													   <span className="text-gray-500 fw-semibold fs-6">Registered Volunteers</span>
													</div>
												 </div>
											  </div>
										   </div>
										   <div className="row g-3 g-lg-6 mb-5">
											   <div className="col-3">
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
													   <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">4,7</span>
													   <span className="text-gray-500 fw-semibold fs-6">Registered Teachers</span>
													</div>
												 </div>
											  </div>	
											  <div className="col-3">
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
													   <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">822</span>
													   <span className="text-gray-500 fw-semibold fs-6">Registered Parents</span>
													</div>
												 </div>
											  </div>
											  
											  <div className="col-3">
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
													   <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">4,7</span>
													   <span className="text-gray-500 fw-semibold fs-6">Pending Image Review</span>
													</div>
												 </div>
											  </div>
											  <div className="col-3">
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
													   <span className="text-gray-700 fw-bolder d-block fs-2qx lh-1 ls-n1 mb-1">822</span>
													   <span className="text-gray-500 fw-semibold fs-6">Pending Feedback Review </span>
													</div>
												 </div>
											  </div>
										   </div>
										</div>
									 </div>
								  </div>
							   </div>
							</div>
							{/*Tabs content area end*/}
							{/*Chart content area start*/}
							<div className="row g-5 g-xl-10">
							   <div className="col-xl-12">
								  <div className="card card-flush h-xl-100">
									 <div className="card-header pt-7">
										<h3 className="card-title align-items-start flex-column">
										   <span className="card-label fw-bold text-gray-800">Event Statastic</span>
										   <span className="text-gray-500 mt-1 fw-semibold fs-6">Monthly Event</span>
										</h3>
									 </div>
									 <div className="card-body d-flex align-items-end px-0 pt-3 pb-5">
										<div id="kt_charts_widget_18_chart" className="h-325px w-100 min-h-auto ps-4 pe-6" style={{ minHeight: '340px' }}>
											<div id="apexchartswo6sexmv" className="apexcharts-canvas apexchartswo6sexmv apexcharts-theme-" style={{ width: '935.5px', height: '325px'}}>
											  
											</div>
										</div>
									 </div>
								  </div>
							   </div>
							</div>
							{/*Chart content area end*/}
						</div>
						{/*Main content area end*/}
						{/*Notification content area start*/}
						<div className="col-xl-3">
							   <div className="card card-flush h-xl-100">
								  <div className="card-header pt-7">
									 <h3 className="card-title align-items-start flex-column">
										<span className="card-label fw-bold text-gray-900">Notifications</span>
									 </h3>
								  </div>
								  <div className="card-body">
									<div className="hover-scroll-overlay-y pe-6 me-n6" style={{height: '415px'}}>
										<div className="border border-dashed border-gray-300 rounded px-7 py-3 mb-6">
										   <div className="d-flex flex-stack mb-3">
											  <div className="me-3">
												 <img src="/assets/media/stock/ecommerce/210.png" className="w-50px ms-n1 me-1" alt="" />
												 <a href="apps/ecommerce/catalog/edit-product.html" className="text-gray-800 text-hover-primary fw-bold">Elephant 1802</a>
											  </div>
											  <div className="m-0">
												 <button className="btn btn-icon btn-color-gray-500 btn-active-color-primary justify-content-end" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-overflow="true">
												 <i className="ki-outline ki-dots-square fs-1"></i>
												 </button>
												 <div className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px" data-kt-menu="true">
													<div className="menu-item px-3">
													   <div className="menu-content fs-6 text-gray-900 fw-bold px-3 py-4">Quick Actions</div>
													</div>
													<div className="separator mb-3 opacity-75"></div>
													<div className="menu-item px-3">
													   <a href="#" className="menu-link px-3">New Ticket</a>
													</div>
													<div className="menu-item px-3">
													   <a href="#" className="menu-link px-3">New Customer</a>
													</div>
													<div className="menu-item px-3" data-kt-menu-trigger="hover" data-kt-menu-placement="right-start">
													   <a href="#" className="menu-link px-3">
													   <span className="menu-title">New Group</span>
													   <span className="menu-arrow"></span>
													   </a>
													   <div className="menu-sub menu-sub-dropdown w-175px py-4">
														  <div className="menu-item px-3">
															 <a href="#" className="menu-link px-3">Admin Group</a>
														  </div>
														  <div className="menu-item px-3">
															 <a href="#" className="menu-link px-3">Staff Group</a>
														  </div>
														  <div className="menu-item px-3">
															 <a href="#" className="menu-link px-3">Member Group</a>
														  </div>
													   </div>
													</div>
													<div className="menu-item px-3">
													   <a href="#" className="menu-link px-3">New Contact</a>
													</div>
													<div className="separator mt-3 opacity-75"></div>
													<div className="menu-item px-3">
													   <div className="menu-content px-3 py-3">
														  <a className="btn btn-primary btn-sm px-4" href="#">Generate Reports</a>
													   </div>
													</div>
												 </div>
											  </div>
										   </div>
										   <div className="d-flex flex-stack">
											  <span className="text-gray-500 fw-bold">To: 
											  <a href="apps/ecommerce/sales/details.html" className="text-gray-800 text-hover-primary fw-bold">Jason Bourne</a></span>
											  <span className="badge badge-light-success">Delivered</span>
										   </div>
										</div>
									 </div>
								  </div>
							   </div>
						</div>
						{/*Notification content area end*/}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
