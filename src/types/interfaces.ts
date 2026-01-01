export interface Setting {
  _id: string;
  name: string;
  slug: string;
  value: string;
  status: number; //1=Active, 0=Inactive
  statusname?: string;
  is_deleted: boolean;
  created_by?: string;
  updated_by?: string;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface SettingSearchFormState {
  search_string: string;
  status: string;
}

export interface NewsLetterEmail {
  _id: string;
  email: string;
  is_verified: number; //1=Yes, 0=No
  verifiedname: string;
  status: number; //1=Active, 0=Inactive
  statusname?: string;
  is_deleted: boolean;
  created_by?: string;
  updated_by?: string;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface NewsLetterEmailSearchFormState {
  search_string: string;
  status: string;
  is_verified: string;
}

export interface IDashboard {
  event_count: number;
  npo_count: number;
  student_count: number;
  parent_count: number;
  teacher_count: number;
  complaint_count: number;
  image_approval_count: number;
  volunteer_approval_count: number;
  review_approval_count: number;
  cancelled_event_count: number;
  completed_event_count: number;
}

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_country_code: string;
  phone_no: string;
  address: string;
  location: {
    type: "Point";
    coordinates: number[];
  };
  password?: string;
  google_id?: string | null;
  xogo_id?: string | null;
  token?: string | null;
  verify_token?: string | null;
  user_image?: string | null;
  imagepath: string;
  agree_term: number;
  role_id: number;
  status: number;
  approval_status: number;
  is_logged_in: boolean;
  terms_accepted: boolean;
  profile_completed: boolean;
  student_profile?: string | null;
  npo_profile?: string | null;
  child_id?: string | null;
  is_deleted: boolean;
  created_by?: string | null;
  updated_by?: string | null;
  deleted_by?: string | null;
  last_login_at?: Date | null;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  fullname?: string;
  rolename?: string;
  statusname?: string;
  approvalstatusname?: string;
}

export interface UserSearchFormState {
  search_string: string;
  approval_status: string;
  status: string;
}

export interface Badge {
  _id: string;
  badge_for: number; //1=Student,2=NPO
  title: string;
  description: string;
  points: number;
  hours: number;
  image: string;
  status: number;
  statusname: string;
  is_deleted: boolean;
  created_by?: string;
  updated_by?: string;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface StudentProfile {
  _id: string;
  student_id?: User | null;
  dob?: Date | null;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  address: string;
  reason_to_join: string;
  hear_about_us: string;
  event_count: number; //Student total event count
  event_hours: number; //Student total event hours
  total_rating: number; //Student total rating count
  average_rating: string; //Student average rating
  total_coins: number; //Student total coins collected
  current_coins: number; //Student total coins collected
  points: number; //Student total points collected
  badge_id: string; //Student badge
  status: number; //1=Active, 0=Inactive
  is_deleted: boolean;
  created_by?: string;
  updated_by?: string;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface NpoSearchFormState {
  organisation_name: string;
  search_string: string;
  registration_status: string;
  approval_status: string;
  // status: string;
  //[key: string]: string; //to allow Record<string,string> in searchForm
}

export interface NpoProfile {
  _id: string;
  npo_user_id?: User | null;
  organization_name: string;
  organization_about: string;
  contact_name: string;
  organisation_email: string;
  phone_country_code: string;
  organisation_phone: string;
  mailing_address: string;
  physical_address: string;
  location: {
    type: "Point";
    coordinates: number[];
  };
  registration_no: string;
  total_rating: number; //NPO total rating count
  average_rating: string; //NPO average rating
  registration_status: number; //0=Waiting, 1=Registered, 2=Not Registered, 3=Cancelled
  registrationstatusname: string;
  website_link: string;
  points: number; //these are the poinst you get when you complete the event
  badge_id: Badge | null;
  total_event_hours: string;
  total_events: number;
  completed_events: number;
  confirm_npo: boolean;
  accurate_info_provided: boolean;
  status: number; //1=Active, 0=Inactive
  is_deleted: boolean;
  created_by?: string;
  updated_by?: string;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface ParentTeacherStudent {
  _id: string;	
  student_for: number;
  user_id: User | null;
  student_id: User | null;
  approval_status: number;
  approvalstatusname?: string;
  status: number; // 1=Active, 0=Inactive
  is_deleted: boolean;
  created_by?: string;
  updated_by?: string;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface EventInterestSearchFormState {
  search_string: string;
  status: string;
}

export interface EventInterest {
  _id: string;
  title: string;
  slug: string;
  description: string;
  status: number;
  statusname: string;
  is_deleted: boolean;
  created_by?: string;
  updated_by?: string;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface EventSearchFormState {
  npo_id: string;
  search_string: string;
  event_status: string;
  approval_status: string;
}

interface BasicInfo {
  _id: string;
  title: string;
  statusname: string;
  id: string;
}

export interface Events {
  _id: string;
  npo_id?: NpoProfile | null;
  intrest_id?: EventInterest | null;
  title: string;
  age_group: BasicInfo | null;
  description: string;
  special_condition: string;
  address: string;
  location: {
    type: "Point";
    coordinates: number[];
  };
  interest_id: BasicInfo | null;
  volunteers_count: number;
  volunteers: [];
  is_recuring: number;
  rating_count: number;
  recuring_type: number;
  recuring_days: [];
  event_duration: number;
  start_date?: Date;
  end_date?: Date;
  start_time?: string;
  end_time?: string;
  bannerpath: string;
  displaypath: string;
  waiverpath: string;
  images: string;
  event_status: number;
  statusname: string;
  distance_in_km: number;
  approval_status: number;
  approvalstatusname: string;
  filtered_start_date?: Date;
  filtered_end_date?: Date;
  filtered_dates_count?: number;
  is_deleted: boolean;
  created_by?: string;
  updated_by?: string;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface EventStudent {
  _id: string;
  event_id: Events | null;
  student_id: User | null;
  message: string;
  rejection_reason: string;
  application_status: number; //1=Applied,2=Accepted,3=Rejected
  applicationstatus: string;
  attendence_marked: boolean;
  attendence_start_time: string;
  attendence_end_time: string;
  review_given: boolean; //NPO has given review to student
  npo_review_given: boolean; //Student has given review to NPO
  student_status: number; //1=ON Time,2=Running Late,3=Emergency,4=Other Reason
  student_message: string; //Other reason message
  status: number; //1=Active,0=Inactive
  studentstatus?: string;
  cancel_volunteer: boolean; //This flag is raised if volunteer has cancel volunteering
  cancel_reason: string; //Message why volunteer cancel volunteering
  approval_status: number; // 0=Pending, 1=Approved, 2=Disapproved
  approvalstatusname: string;
  is_reported: boolean; //This flag is raised if volunteer is reported
  reporting_reason: string;
  waiver_form: string | null;
  waiverpath: string | null;
  event_date: Date;
  is_deleted: boolean;
  created_by?: User | null;
  updated_by?: User | null;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface EventImages {
  _id: string;
  approval_status: number;
  approvalstatusname: string;
  event_date: Date;
  event_id: string;
  filepath: string;
  is_deleted: Boolean;
  mime: string;
  size: number;
  created_by : User | null;
  updated_by : User | null;
  created_at: Date | null;
  deleted_at: Date | null;
  updated_at: Date | null;
}

export interface EventDates {
  _id: string;
  date: Date | null;
  event_status: number;
  statusname: string;
  status: number;
  cancel_reason: string;
  approval_status: number;
  approvalstatusname: string;
  created_by : User | null;
  updated_by : User | null;
  created_at: Date | null;
  deleted_at: Date | null;
  updated_at: Date | null;
  deleted_by: User | null;
}

export interface ReviewSearchFormState {
  age_group: string;
  date_range: string;
  interest: string;
}

export interface ImageSearchFormState {
  age_group: string;
  date_range: string;
  interest: string;
}

export interface EventReview {
  _id: string;
  event_id?: Events | null;
  npo_id?: NpoProfile | null;
  rating_for: number;
  student_id?: User | null;
  rating: number;
  title: string;
  message: string;
  event_date: Date;
  approvalstatusname: string;
  approval_status: number; //1=Active, 0=Inactive
  statusname: string;
  status: number; //1=Active, 0=Inactive
  is_archived: boolean;
  is_deleted: boolean;
  created_by?: User | null;
  updated_by?: string;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface EventImage {
  _id: string;
  event_id?: Events | null;
  name: string;
  uploaded_by: number; // 1=NPO, 2=Student
  filepath: string;
  path: string;
  mime: string;
  size: string;
  event_date: Date;
  approvalstatusname: string;
  approval_status: number; //1=Active, 0=Inactive
  statusname: string;
  status: number; //1=Active, 0=Inactive
  is_deleted: boolean;
  created_by?: User | null;
  updated_by?: string;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface NpoEventsProps {
  eventtype: number;
  npoId?: string;
}

export interface EventReviewProps {
  reviewtype: number;
  eventId?: string;
}

export interface StudentEventsProps {
  eventtype: number;
  studentId?: string;
}

export interface EventInterest {
  _id: string;
  title: string;
  slug: string;
  description: string;
  status: number;
  statusname: string;
  is_deleted: boolean;
  created_by?: string;
  updated_by?: string;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface EventAgeGroup {
  _id: string;
  title: string;
  slug: string;
  description: string;
  status: number;
  statusname: string;
  is_deleted: boolean;
  created_by?: string;
  updated_by?: string;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface AgeGroup {
  _id: string;
  title: string;
  slug: string;
  description: string;
  status: number;
  statusname: string;
  is_deleted: boolean;
  created_by?: string;
  updated_by?: string;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface AgeGroupSearchFormState {
  search_string: string;
  status: string;
}

export interface ReportedSearchFormState {
  can_search: boolean;
  date_range: string;
  reported_status: string;
}

export interface Reported {
  _id: string;
  reported_type: number; //1=Event Review,2=Student Review,3=Event Image,4=Event Volunteer
  item_type: number; //1=Complaint,2=Reported
  item_id?: User | null;
  event_id: Events | null;
  message: string;
  reported_status: number; //0=Pending,1=Accepted,2=Rejected,3=Resolved
  reportedstatusname: string;
  reported_user: User | null;
  status: number; //0=Inactive,1=Active
  statusname: string;
  is_deleted: boolean;
  created_by?: User | null;
  updated_by?: string;
  deleted_by?: User | null;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface BadgeList {
  _id: string;
  status: number;
  statusname: string;
  title: string;
  description: string;
  imagepath: string;
  image: string;
  hours: string;
  points: string;
  badge_for: string;
  badgefor?: string;
  is_deleted: boolean;
  created_by?: string;
  updated_by?: string;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}

export interface BadgeSearchFormState {
  search_string: string;
  status: string;
  badge_for: string;
}

export interface ChangeApprovalStatusParams {
  itemId?: string;
  url?: string;
  is_recuring?: number;
  selectedOption?: string;
  callback?: () => void;
}

interface PostAsset {
  post_id: string;
  item_type: number;
  name: string;
  path: string;
  mime: string;
  size: string;
  filepath:string;
};

export interface Post {
  _id: string;	
  message: string;
  post_assets?: PostAsset[];
  is_reported: boolean;
  reported_status: number;//0=Pending,1=Accepted,2=Rejected,3=Resolved
  status: number;//0=Inactive,1=Active
  is_deleted: boolean;
  is_blocked: boolean;
  // created_by?: string;
  updated_by?: string;
  deleted_by?: string;
  created_by?: User;
  deleted_at?: Date | null;
  created_at?: Date | null;
  updated_at?: Date | null;
}