// src/routes/clientRoutes.tsx
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../views/ProtectedRoute';
import AdminLayout from '../views/layout/AdminLayout'
import Dashboard from '../views/Dashboard';
import AdminList from '../views/Admin/List';
import SettingList from '../views/Setting/List';
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
import AgeGroupList from '../views/AgeGroup/List';
import ReportedList from '../views/Reported/List';
import BadgeManagementList from '../views/BadgeList/List';
import NewsLettersEmailList from '../views/NewsLettersEmail/List';
import UserPosts from '../views/SocialMedia/PostList';
import ArchivedRating from '../views/ArchivedRating/List';

const ClientRoutes = () => (
	<Route element={<AdminLayout />}>
		<Route path='/dashboard' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <Dashboard />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/admin-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <AdminList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/settings-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <SettingList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/npo-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <NpoList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/npo-detail/:npo_id' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <ViewNpoDetails />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/event-interest-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <EventInterestList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/event-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <EventList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/event-detail/:event_id' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <ViewEventDetail />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/create-update-event/:event_id' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <CreateEvent />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/student-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <StudentList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/student-detail/:student_id' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <ViewStudentDetails />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/parent-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <ParentList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/parent-detail/:parent_id' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <ViewParentDetails />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/teacher-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <TeacherList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/teacher-detail/:teacher_id' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <ViewTeacherDetails />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/approval-review-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <ReviewList />
			</ProtectedRoute>
		  }
		/> 
		<Route path='/reported-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <ReportedList />
			</ProtectedRoute>
		  }
		/> 
        <Route path='/approval-event-image-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <ImageList />
			</ProtectedRoute>
		  }
		/> 
		<Route path='/approval-volunteer-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <VolunteerList />
			</ProtectedRoute>
		  }
		/> 
		<Route path='/age-group-management' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <AgeGroupList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/badge-management-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <BadgeManagementList />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/news-letter-email-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <NewsLettersEmailList />
          </ProtectedRoute>
         }
		/>
		<Route path='/user-posts' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <UserPosts />
		    </ProtectedRoute>
		  }
		/>
		<Route path='/archived-review-list' 
		  element={
		    <ProtectedRoute allowedRoles={['super_admin']}>
			  <ArchivedRating />
		    </ProtectedRoute>
		  }
		/>
	</Route>	
);

export default ClientRoutes;
