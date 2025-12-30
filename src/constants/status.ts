export interface StatusOption {
  value: string;
  name: string;
}

// NPO Registration status list
export const npoRegistrationStatus: StatusOption[] = [
  { value: "", name: "Select Registration Status" },
  { value: "0", name: "Applied" },
  { value: "1", name: "Registered" },
  { value: "2", name: "Not Registered" },
  { value: "3", name: "Cancelled" },
];

//NPO Approval Status List
export const npoApprovalStatus: StatusOption[] = [
  { value: "", name: "Select Approval Status" },
  { value: "0", name: "Pending" },
  { value: "1", name: "Approved" },
  { value: "2", name: "Disapproved" },
]

// Student List Approval Status
export const studentApprovalStatus: StatusOption[] = [
  { value: "", name: "Select Approval Status" },
  { value: "0", name: "Pending" },
  { value: "1", name: "Approved" },
  { value: "2", name: "Disapproved" },
];

// Student List Status
export const studentStatus: StatusOption[] = [
  { value: "", name: "Select Status" },
  { value: "0", name: "Inactive" },
  { value: "1", name: "Active" },
  { value: "2", name: "Blocked" },
];

//Event Interest List status
export const EventInterestStatus: StatusOption[] = [
  { value: "", name: "Select Status" },
  { value: "0", name: "Inactive" },
  { value: "1", name: "Active" },
];

//Event List status
export const EventStatus: StatusOption[] = [
  { value: "", name: "Select Event Status" },
  { value: "0", name: "Unpublished" },
  { value: "1", name: "Published" },
  { value: "2", name: "Completed" },
  { value: "3", name: "Cancelled" },
];

//Event List Approval Status
export const EventApprovalStatus: StatusOption[] = [
  { value: "", name: "Select Approval Status" },
  { value: "0", name: "Pending" },
  { value: "1", name: "Approved" },
  { value: "2", name: "Disapproved" },
]

//Age Group Management List status
export const AgeGroupStatus: StatusOption[] = [
  { value: "", name: "Select Status" },
  { value: "0", name: "Inactive" },
  { value: "1", name: "Active" },
]

//Badge Management List Status
export const BadgeListStatus: StatusOption[] = [
  { value: "", name: "Select Status" },
  { value: "0", name: "Inactive" },
  { value: "1", name: "Active" },
]

//Badgefor of Badge management list
export const BadgeFor: StatusOption[] = [
  { value: "", name: "Select Badge For" },
  { value: "1", name: "Student" },
  { value: "2", name: "NPO" },
]

export const ReportedStatus: StatusOption[] = [
  { value: "", name: "Select Reported Status"},
  { value: "0", name: "Pending" },
  { value: "1", name: "Accepted" },
  { value: "2", name: "Rejected" },
  { value: "3", name: "Resolved" },
]