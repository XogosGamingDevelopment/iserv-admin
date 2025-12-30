import React, { useState, useEffect } from 'react';
import { CommonInput, CommonImageInput } from "./index";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { setUser } from '../../redux/userSlice';
import {User} from '../../types/interfaces';
import useAxios from '../../hooks/useAxios';

interface ProfileFormState {
  fullname: string;
  email: string;
  phone_no: string;
  profileimage: string;
}

type ModalProps = {
  show: boolean;
  onClose: (e?: React.MouseEvent<HTMLElement> | boolean) => void; 
  user?: User | null;
};

const UpdateProfile: React.FC<ModalProps> = ({ show, onClose, user }) => {
	//if(!show) return;
	//console.log('user', user);
	const axiosInstance = useAxios();
	const dispatch = useDispatch<AppDispatch>();
	const [ formData, setFormData ] = useState<ProfileFormState>({ fullname: '', email: '', phone_no: '', profileimage: '' });
	const [ profileimage, setProfileImage ] = useState<File | null>(null);
	//console.log('profileimage', profileimage);
	const [errors, setErrors] = useState<Partial<ProfileFormState>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	
	useEffect(() => {
	  if (user) {
		setFormData({
		  ...formData,
		  fullname: user?.fullname ?? '',
		  email: user?.email ?? '',
		  phone_no: user?.phone_no ?? '',
		  profileimage: user?.imagepath ?? '',
		});
	  }
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);
	
	/*Handle Form Element Value Changed*/
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement |HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setErrors({
			...errors,
			[name]: undefined
		});
		//set form data in state
		setFormData({
		  ...formData,
		  [name]: value,
		});
	};
	
	/*Validate Form*/
	const validate = (): boolean => {
		
		const newErrors: Partial<ProfileFormState> = {};
		if (!formData.fullname) {
			newErrors.fullname = 'Name is required';
		}
        if (!formData.email) {
			newErrors.email = 'Email is required';
		} 
        if (!formData.phone_no) {
			newErrors.phone_no = 'Phone no is required';
		} 		
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	
	/*Submit Form*/
	const handleSubmit = async (): Promise<void> => {
		if (validate()) {
			setIsSubmitting(true);
			try {
				const form_Data = new FormData();
				if(profileimage){
				  form_Data.append('profileimage', profileimage);
				}
				form_Data.append('fullname', formData.fullname);
				form_Data.append('email', formData.email);
				form_Data.append('phone_no', formData.phone_no);
				
				const response: any = await axiosInstance({
					url: `users/update-admin-profile/${user?._id}`,
					method: "PUT",
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					data: form_Data,
				});
				//console.log('update profile response', response.data)
				if(!response.error){
					let details = response.data.updated_user;
					if(details){
					  localStorage.setItem('user', JSON.stringify(details));
					  //set user data in redux store
					  dispatch(setUser(details));
					}
					handleCloseClicked();
				}
			} catch (error: any) {
			  //console.error("Error in api request:", error);
			  if (error?.response?.data?.type === 'validation_error') {
			    let errors = error.response.data.message.errors; //API returned an error message
			    setErrors(errors);
			    //console.error("errors:", errors);
			  } 
			} finally {
			  setIsSubmitting(false);
			}
		}
	};
	
	const handleCloseClicked = () => {
		const newErrors: Partial<ProfileFormState> = {};
		setErrors(newErrors);
		setProfileImage(null);
		onClose(true);
	}

  if (!show) return null;

  return (
    <>
      {/* Backdrop with opacity */}
      <div className="modal-backdrop fade show" onClick={handleCloseClicked} />
		<div className="modal" tabIndex={-1} aria-modal="true" role="dialog" style={{ display: "block" }}>
			<div className="modal-dialog modal-dialog-centered mw-650px">
				<div className="modal-content">
					<div className="modal-header">
						<h2>My Profile</h2>
						<button className="btn btn-sm btn-icon btn-active-color-primary" onClick={handleCloseClicked}>✖</button>
					</div>
					<div className="modal-body mx-xl-5">
						<form className="form">
						    <CommonImageInput fieldName="profileimage" onImageChange={setProfileImage} defaultImage={formData.profileimage}/>
							<label className="required fs-6 fw-semibold form-label mb-1">Full Name</label>
							<CommonInput
								type="text"
								name="fullname"
								placeholder="Enter you name"
								value={formData.fullname}
								onChange={handleInputChange}
								error={errors.fullname}
							/>
							<label className="required fs-6 fw-semibold form-label mb-1">Email</label>
							<CommonInput
								type="email"
								name="email"
								placeholder="Enter email"
								value={formData.email}
								onChange={handleInputChange}
								error={errors.email}
							/>
							<label className="required fs-6 fw-semibold form-label mb-1">Phone No</label>
							<CommonInput
								type="text"
								name="phone_no"
								placeholder="Enter phone no"
								value={formData.phone_no}
								onChange={handleInputChange}
								error={errors.phone_no}
							/>
							<div className="border-top mb-2" />
							<div className="text-end mt-5">
								<button type="button" className="btn btn-light me-3" onClick={handleCloseClicked}>Cancel</button>
								{isSubmitting ? (
									<button type="button" id="kt_modal_new_card_submit" className="btn btn-primary" disabled={true}>
										<span className="indicator-progress" style={{ display: "block" }}>Please wait... 
										<span className="spinner-border spinner-border-sm align-middle ms-2"></span></span>
									</button>
								) : (
									<button type="button" id="kt_modal_new_card_submit" className="btn btn-primary" onClick={handleSubmit}>
										<span className="indicator-label">Submit</span>
									</button>
								)}
							</div>
						</form>
					</div>
				</div>
			</div>
      </div>
    </>
  );
};

export default UpdateProfile;
