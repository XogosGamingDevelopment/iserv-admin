// src/routes/clientRoutes.tsx
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../views/ProtectedRoute';
import AdminLayout from '../views/layout/AdminLayout'
import Dashboard from '../views/Dashboard';
import AdminList from '../views/Admin/List';
import SettingList from '../views/Setting/List';
import WaiverManagement from '../views/Setting/WaiverManagement';
import NpoList from '../views/Npo/List';
import ViewNpoDetails from '../views/Npo/ViewDetails';
import EventInterestList from '../views/EventInterest/List';
import EventList from '../views/Event/List';
import ViewEventDetail from '../views/Event/ViewDetails';
import CreateEvent from '../views/Event/CreateEvent';
import StudentList from '../views/Student/List';
import ViewStudentDetails from '../views/Student/ViewDetails';
import ParentList from '../views/Parent/List';
import ViewParentDetails from '../views/Parent/ViewDetails';
import TeacherList from '../views/Teacher/List';
import ViewTeacherDetails from '../views/Teacher/ViewDetails';
import ReviewList from '../views/Approval/ReviewList';
import ImageList from '../views/Approval/ImageList';
import VolunteerList from '../views/Approval/VolunteerList';
import ServiceReportList from '../views/Approval/ServiceReportList';
import PhotoGallery from '../views/Approval/PhotoGallery';
import ProjectsMap from '../views/Projects/ProjectsMap';
import AllProjects from '../views/Projects/AllProjects';
import AgeGroupList from '../views/AgeGroup/List';
import ReportedList from '../views/Reported/List';
import BadgeManagementList from '../views/BadgeList/List';
import NewsLettersEmailList from '../views/NewsLettersEmail/List';
import UserPosts from '../views/SocialMedia/PostList';
import ArchivedRating from '../views/ArchivedRating/List';
import OutreachOrganizations from '../views/Outreach/Organizations';
import OutreachSchools from '../views/Outreach/Schools';
import NonprofitDatabase from '../views/Outreach/NonprofitDatabase';
import SchoolsDatabase from '../views/Outreach/SchoolsDatabase';
import DripCampaigns from '../views/Outreach/DripCampaigns';

// Who may open the dashboard pages. The server decides for real (middleware/adminAccess); this only keeps
// people off pages that would refuse them. Sub-admins get everything except Admin Users.
const SUPER_ADMIN = ['super_admin'];
const ADMINS = ['super_admin', 'npo_admin', 'student_admin'];

const ClientRoutes = () => (
	<Route element={<AdminLayout />}>
		<Route path='/dashboard' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <Dashboard />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/admin-list' 
		  element={
		    <ProtectedRoute allowedRoles={SUPER_ADMIN}>
			  <AdminList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/settings-list'
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <SettingList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/waiver-management'
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <WaiverManagement />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/npo-list' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <NpoList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/npo-detail/:npo_id' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <ViewNpoDetails />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/event-interest-list' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <EventInterestList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/event-list' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <EventList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/event-detail/:event_id' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <ViewEventDetail />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/create-update-event/:event_id' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <CreateEvent />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/student-list' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <StudentList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/student-detail/:student_id' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <ViewStudentDetails />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/parent-list' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <ParentList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/parent-detail/:parent_id' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <ViewParentDetails />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/teacher-list' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <TeacherList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/teacher-detail/:teacher_id' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <ViewTeacherDetails />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/approval-review-list' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <ReviewList />
			</ProtectedRoute>
		  }
		/> 
		<Route path='/reported-list' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <ReportedList />
			</ProtectedRoute>
		  }
		/> 
        <Route path='/approval-event-image-list' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <ImageList />
			</ProtectedRoute>
		  }
		/> 
		<Route path='/approval-volunteer-list'
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <VolunteerList />
			</ProtectedRoute>
		  }
		/>
		<Route path='/photo-gallery'
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <PhotoGallery />
			</ProtectedRoute>
		  }
		/>
		<Route path='/projects-map'
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <ProjectsMap />
			</ProtectedRoute>
		  }
		/>
		<Route path='/all-projects'
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <AllProjects />
			</ProtectedRoute>
		  }
		/>
		<Route path='/approval-service-reports'
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <ServiceReportList />
			</ProtectedRoute>
		  }
		/>
		<Route path='/age-group-management' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <AgeGroupList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/badge-management-list' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <BadgeManagementList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/news-letter-email-list' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <NewsLettersEmailList />
          </ProtectedRoute>
         }
		/>
		<Route path='/user-posts' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <UserPosts />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/archived-review-list' 
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <ArchivedRating />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/outreach-organizations'
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <OutreachOrganizations />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/outreach-schools'
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <OutreachSchools />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/nonprofit-database'
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <NonprofitDatabase />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/schools-database'
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <SchoolsDatabase />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/drip-campaigns'
		  element={
		    <ProtectedRoute allowedRoles={ADMINS}>
			  <DripCampaigns />
		    </ProtectedRoute>
		  }
		/>
	</Route>	
);

export default ClientRoutes;
