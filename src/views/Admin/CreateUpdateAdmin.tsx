import React, { useState, useEffect } from "react";
import { CommonInput, CommonImageInput } from "../common";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { setUser } from "../../redux/userSlice";
import { User } from "../../types/interfaces";
import useAxios from "../../hooks/useAxios";
import { useModalState } from "../../hooks/useModalState";
import helpers from "../../_helpers/common";

interface ProfileFormState {
  role_id: string;
  fullname: string;
  email: string;
  password?: string;
  confirm_password?: string;
  phone_no: string;
  profileimage: string;
}

type ModalProps = {
  user?: User | null;
  getListData: () => void;
};

const emptyObj = {
  role_id: "",
  fullname: "",
  email: "",
  password: "",
  confirm_password: "",
  phone_no: "",
  profileimage: "",
};

const CreateUpdateAdmin: React.FC<ModalProps> = ({ user, getListData }) => {
  const axiosInstance = useAxios();
  const dispatch = useDispatch<AppDispatch>();
  const { handleCloseModal } = useModalState();
  const [formData, setFormData] = useState<ProfileFormState>(emptyObj);
  const [profileimage, setProfileImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<ProfileFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        role_id: user.role_id?.toString() ?? "",
        fullname: user.fullname ?? "",
        email: user.email ?? "",
        phone_no: user.phone_no ?? "",
        profileimage: user.imagepath ?? "",
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsFormChanged(true);
  };

  const validate = (): boolean => {
    const newErrors: Partial<ProfileFormState> = {};

    if (!formData.fullname) newErrors.fullname = "Name is required";
    else if (!helpers.isValidName) newErrors.fullname = "Name is not valid";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!helpers.isValidEmail(formData.email))
      newErrors.email = "Please enter a valid email address";

    if (!formData.phone_no) newErrors.phone_no = "Phone no is required";
    else if (!helpers.isValidPhoneNo(formData.phone_no))
      newErrors.phone_no = "Please enter a valid Phone no";

    if (!formData.role_id) newErrors.role_id = "Role is required";
    if (!formData.profileimage && !profileimage)
      newErrors.profileimage = "Profile Image is required";

    if (!user) {
      if (!formData.password) newErrors.password = "Password is required";
      else {
        let error = helpers.isValidFormatForPassword(formData.password);
        if (error) newErrors.password = error;
      }

      if (!formData.confirm_password)
        newErrors.confirm_password = "Confirm Password is required";
      if (
        formData.password &&
        formData.confirm_password &&
        formData.password !== formData.confirm_password
      ) {
        newErrors.confirm_password = "Confirm Password must match Password";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;
    if (!isFormChanged) {
      handleCloseModal();
      return;
    }
    setIsSubmitting(true);

    try {
      const form_Data = new FormData();

      if (profileimage) form_Data.append("profileimage", profileimage);
      form_Data.append("role_id", formData.role_id);
      form_Data.append("fullname", formData.fullname);
      form_Data.append("email", formData.email);
      form_Data.append("phone_no", formData.phone_no);

      if (!user) {
        form_Data.append("password", formData.password ?? "");
        form_Data.append("confirm_password", formData.confirm_password ?? "");
      }

      const url_path = user
        ? `users/update-admin-profile/${user._id}`
        : `users/create-admin`;

      const response: any = await axiosInstance({
        url: url_path,
        method: user ? "PUT" : "POST",
        headers: { "Content-Type": "multipart/form-data" },
        data: form_Data,
      });

      if (!response.error) {
        const details = response.data.updated_user;
        if (details) {
          localStorage.setItem("user", JSON.stringify(details));
          dispatch(setUser(details));
        }

        handleClose();
      }
    } catch (error: any) {
      if (error?.response?.data?.type === "validation_error") {
        setErrors(error.response.data.message.errors ?? {});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setFormData(emptyObj);
    setProfileImage(null);
    getListData();
    handleCloseModal();
  };

  const handleFileChange = (file: File | null) => {
    setProfileImage(file);
    if (!file) {
      setFormData((prev) => ({ ...prev, profileimage: "" }));
      return;
    }
    setErrors((prev) => ({ ...prev, profileimage: undefined }));
    setIsFormChanged(true);
  };

  return (
    <>
      <div className="modal-header">
        <h2>{user ? "Update Admin User" : "Create Admin User"}</h2>
      </div>
      <div className="modal-body mx-xl-5">
        <form className="form">
          <CommonImageInput
            fieldName="profileimage"
            onImageChange={handleFileChange}
            defaultImage={formData.profileimage}
            error={errors.profileimage}
          />
          <label className="required fs-6 fw-semibold form-label mb-1">
            Full Name
          </label>
          <CommonInput
            type="text"
            name="fullname"
            placeholder="Enter name"
            value={formData.fullname}
            onChange={handleInputChange}
            error={errors.fullname}
            limit={50}
            onKeyDown={(e) => {
              if (
                !/[a-zA-Z\s]+/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Tab" &&
                e.key !== "ArrowLeft" &&
                e.key !== "ArrowRight" &&
                e.key !== "Delete"
              ) {
                e.preventDefault();
              }
            }}
          />
          <label className="required fs-6 fw-semibold form-label mb-1">
            Email
          </label>
          <CommonInput
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
          />
          {!user && (
            <>
              <label className="required fs-6 fw-semibold form-label mb-1">
                Password
              </label>
              <CommonInput
                type="password"
                name="password"
                placeholder="Enter new password"
                value={formData.password ?? ""}
                onChange={handleInputChange}
                error={errors.password}
              />

              <label className="required fs-6 fw-semibold form-label mb-2">
                Confirm Password
              </label>
              <CommonInput
                type="password"
                name="confirm_password"
                placeholder="Confirm password"
                value={formData.confirm_password ?? ""}
                onChange={handleInputChange}
                error={errors.confirm_password}
              />
            </>
          )}
          <div className="mb-8 fv-row">
            <label className="required fs-6 fw-semibold form-label mb-1">
              Role
            </label>
            <select
              className="form-select"
              name="role_id"
              value={formData.role_id}
              onChange={handleInputChange}
            >
              <option value="">Select Role</option>
              <option value="2">NPO Admin</option>
              <option value="3">Student Admin</option>
            </select>
            {errors.role_id && (
              <div className="invalid-feedback">{errors.role_id}</div>
            )}
          </div>
          <label className="required fs-6 fw-semibold form-label mb-1">
            Phone No
          </label>
          <CommonInput
            type="text"
            name="phone_no"
            placeholder="Enter phone no"
            value={formData.phone_no}
            onChange={handleInputChange}
            error={errors.phone_no}
            limit={15}
            autoComplete="off"
            onKeyDown={(e) => {
              if (
                !/[0-9]/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Tab" &&
                e.key !== "ArrowLeft" &&
                e.key !== "ArrowRight" &&
                e.key !== "Delete"
              ) {
                e.preventDefault();
              }
            }}
          />
          <div className="border-top mb-2" />
          <div className="text-end mt-5">
            <button
              type="button"
              className="btn btn-light me-3"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            {isSubmitting ? (
              <button type="button" className="btn btn-primary" disabled>
                <span
                  className="indicator-progress"
                  style={{ display: "block" }}
                >
                  Please wait...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                <span className="indicator-label">Submit</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateUpdateAdmin;
