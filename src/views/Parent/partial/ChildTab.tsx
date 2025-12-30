import React from 'react';
import { TooltipWrapper } from "../../common";
import { hasAuthorization } from '../../../_helpers/hasAuthorization';
import badges from "../../../_helpers/badgeHelper";
import helper from '../../../_helpers/common';
import { ParentTeacherStudent } from '../../../types/interfaces';

type ChildTabProps = {
  user: ParentTeacherStudent | null;
  approveChild: (item_id: string,approvalstatusname?: string) => void;
  deleteChild: (item_id: string) => void;
};

const ChildTab: React.FC<ChildTabProps> = ({ user, approveChild, deleteChild }) => {
  if (!user || !user.student_id) return null;

  const {
    _id,
	approval_status,
	approvalstatusname,
    student_id: {
      imagepath,
      fullname,
      email,
      student_profile
    },
  } = user;

  return (
	<div className="card card-dashed h-xl-100 flex-row flex-stack flex-wrap p-6">
		<div className="d-flex flex-column py-2">
		    <div className="d-flex align-items-end fs-4 mb-5">
				<label className="fw-semibold text-muted">Approval Status: </label> {badges.adminApprovalBadge(approval_status ?? 0, approvalstatusname ?? '')}
			</div>
			<div className="d-flex align-items-center">
				<img src={imagepath || '/default-avatar.png'} alt={fullname || '-'} className="me-4" height="60px" width="60px" />
				<div>
					<div className="fs-4 fw-bold">Name: {fullname || '-'}</div>
					<div className="fs-4 fw-bold">Email: {email || '-'}</div>
					<div className="fs-6 fw-semibold text-gray-500">DOB: {helper.convertDateTime((student_profile as any)?.dob, 'DD MMM YYYY') || '-'}</div>
				</div>
			</div>
		</div>
		<div className="d-flex align-items-center py-2">
		  {hasAuthorization('admin_approval', 'student') && (
		    <TooltipWrapper title="Update Approval Status" placement="top">
		     <span className="btn btn-sm btn-icon btn-light btn-active-light-warning me-2" onClick={() => approveChild(_id,approvalstatusname)}>
			   <i className="ki-outline ki-shield-tick text-warning fs-2"></i>
		     </span>
		   </TooltipWrapper>
		)}
		{hasAuthorization('delete', 'parent') && (
		  <TooltipWrapper title="Delete Child" placement="top">
		    <span className="btn btn-sm btn-icon btn-light btn-active-light-danger" onClick={() => deleteChild(_id)}>
			  <i className="ki-outline ki-trash text-danger fs-2"></i>
		    </span>
		  </TooltipWrapper>
	   )}
		</div>
	</div>
  );
};

export default ChildTab;