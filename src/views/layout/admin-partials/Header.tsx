import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { User } from "../../../types/interfaces";
import ChangePassword from "../../common/ChangePassword";
import UpdateProfile from "../../common/UpdateProfile";

function Header() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const [currentuser, setCurrentUser] = useState<User | null>(null);
  const [updatepassword, setUpdatePassword] = useState(false);
  const [updateprofile, setUpdateProfile] = useState(false);
  
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  const logout = () => {
    localStorage.clear();
    navigate('/login')
  }
	
	return (
		<>
		  <div id="kt_header" className="header " style={{ background: `linear-gradient(90deg, #774ABF 20%, #5578CF 100%)` }}>
		    <div className="container-fluid d-flex flex-stack">
			  <div className="d-flex align-items-center me-5">
				<div className="d-lg-none btn btn-icon btn-active-color-white w-30px h-30px ms-n2 me-3" id="kt_aside_toggle">
				  <i className="ki-duotone ki-abstract-14 fs-2"><span className="path1"></span><span className="path2"></span></i>			
				</div>
				<Link to="#">
				  <img alt="Logo" src="/mascot-logo.png" className="h-45px h-lg-50px" />
				</Link>
			  </div>
			  <div className="d-flex align-items-center flex-shrink-0">
				<div className="d-flex align-items-center ms-1" id="kt_header_user_menu_toggle">
				  <div className="btn btn-flex align-items-center bg-hover-white bg-hover-opacity-10 py-2 px-2 px-md-3" data-kt-menu-trigger="click" data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
				    <div className="d-none d-md-flex flex-column align-items-end justify-content-center me-2 me-md-4">
					  <span className="text-white fs-8 fw-semibold lh-1 mb-1">{currentuser?.fullname}</span>
					  {/*<span className="text-white fs-8 fw-bold lh-1">{common.splitAndCapitalizeFirstWord(currentuser?.rolename || '', '_')}</span>*/}
					  <span className="text-white fs-8 fw-bold lh-1">{currentuser?.email}</span>
				    </div>
				    <div className="symbol symbol-30px symbol-md-40px">
					  <img src={currentuser?.imagepath} alt={currentuser?.fullname} />
				    </div>
				  </div>
				  <div className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px" data-kt-menu="true">
					  <div className="menu-item px-3">
						<div className="menu-content d-flex align-items-center px-3">
						  <div className="symbol symbol-50px me-5">
							<img src={currentuser?.imagepath} alt={currentuser?.fullname} />
						  </div>
						  <div className="d-flex flex-column">
							<div className="fw-bold d-flex align-items-center fs-5">
							  {currentuser?.fullname} {/*<span className="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2">Pro</span>*/}
							</div>
							<Link to="#" className="fw-semibold text-muted text-hover-primary fs-7">
							  {currentuser?.email}
							</Link>
						  </div>
						</div>
					  </div>
				      <div className="separator my-2"></div>
				      <div className="menu-item px-5">
						<span className="menu-link px-5" onClick={() => setUpdateProfile(true)}>My Profile</span>
					  </div>
					  <div className="menu-item px-5 my-1">
						<span className="menu-link px-5" onClick={() => setUpdatePassword(true)}>Change Password</span>
					  </div>
					  <div className="menu-item px-5">
						<span onClick={() => logout()} className="menu-link px-5">Sign Out</span>
					  </div>
				  </div>
				</div>
			  </div>
		    </div>
		  </div>
		  {/*Change Password Modal*/}		
		  <ChangePassword show={updatepassword} onClose={() => setUpdatePassword(false)} user={currentuser}/>
          {/*Update Profile Modal*/}		  
		  <UpdateProfile show={updateprofile} onClose={() => setUpdateProfile(false)} user={currentuser}/>		
		</>	
	);
};

export default Header;
