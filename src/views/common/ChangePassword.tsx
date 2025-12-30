import React, { useState } from "react";
import { CommonInput } from "./index";
import { User } from "../../types/interfaces";
import useAxios from "../../hooks/useAxios";

interface PasswordFormState {
  current_password: string;
  password: string;
  confirm_password: string;
}

type ModalProps = {
  show: boolean;
  onClose: (e?: React.MouseEvent<HTMLElement> | boolean) => void;
  user?: User | null;
};

const ChangePassword: React.FC<ModalProps> = ({ show, onClose, user }) => {
  const axiosInstance = useAxios();
  const [formData, setFormData] = useState<PasswordFormState>({
    current_password: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<Partial<PasswordFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*Handle Form Element Value Changed*/
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement |HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setErrors({
      ...errors,
      [name]: undefined,
    });
    //set form data in state
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /*Validate Form*/
  const validate = (): boolean => {
    const newErrors: Partial<PasswordFormState> = {};
    if (!formData.current_password) {
      newErrors.current_password = "Current password is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (!formData.confirm_password) {
      newErrors.confirm_password = "Confirm Password is required";
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Confirm Password must be same as password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*Submit Form*/
  const handleSubmit = async (): Promise<void> => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response: any = await axiosInstance({
          url: "users/change-password",
          method: "POST",
          data: {
            current_password: formData.current_password,
            password: formData.password,
            confirm_password: formData.confirm_password,
          },
        });
        //console.log('login response', response.data)
        //after successfull login check user and redirect him correspondingly
        if (!response.error) {
          onClose(true);
        }
      } catch (error: any) {
        //console.error("Error in api request:", error);
        if (error?.response?.data?.type === "validation_error") {
          let errors = error.response.data.message.errors; // API returned an error message
          setErrors(errors);
          //console.error("errors:", errors);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCloseClicked = () => {
    const newErrors: Partial<PasswordFormState> = {};
    setErrors(newErrors);
    onClose(true);
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop with opacity */}
      <div className="modal-backdrop fade show" onClick={onClose} />
		<div className="modal" tabIndex={-1} aria-modal="true" role="dialog" style={{ display: "block" }}>
			<div className="modal-dialog modal-dialog-centered mw-650px">
				<div className="modal-content">
					<div className="modal-header">
						<h2>Change Password</h2>
						<button className="btn btn-sm btn-icon btn-active-color-primary" onClick={handleCloseClicked}>✖</button>
					</div>
					<div className="modal-body mx-xl-5">
						<form className="form">
							<label className="required fs-6 fw-semibold form-label mb-1">Current Password</label>
							<CommonInput
								type="password"
								name="current_password"
								placeholder="Enter current password"
								value={formData.current_password}
								onChange={handleInputChange}
								error={errors.current_password}
							/>
							<label className="required fs-6 fw-semibold form-label mb-1">Password</label>
							<CommonInput
								type="password"
								name="password"
								placeholder="Enter new password"
								value={formData.password}
								onChange={handleInputChange}
								error={errors.password}
							/>
							<label className="required fs-6 fw-semibold form-label mb-2">Confirm Password</label>
							<CommonInput
								type="password"
								name="confirm_password"
								placeholder="Confirm password"
								value={formData.confirm_password}
								onChange={handleInputChange}
								error={errors.confirm_password}
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

export default ChangePassword;
