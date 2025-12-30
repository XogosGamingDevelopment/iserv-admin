//React,hooks and components
import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { CommonImageInput, CommonInput } from "../common";

//interfaces
import { BadgeList } from "../../types/interfaces";
import { useModalState } from "../../hooks/useModalState";

interface BadgeListFormState {
  _id: String;
  title: string;
  description: string;
  hours: string;
  points: string;
  badge_for: string;
  imagepath: string;
}

type ModalProps = {
  badgeList?: BadgeList | null;
  getListData: () => void;
};

const emptyObj = {
  _id: "",
  title: "",
  description: "",
  hours: "",
  points: "",
  badge_for: "",
  imagepath: "",
};

const CreateUpdateBadgeList: React.FC<ModalProps> = (props) => {
  const { badgeList, getListData } = props || {}; //destructure data from props and prevent from crash
  const axiosInstance = useAxios();
  const { handleCloseModal } = useModalState();
  const [errors, setErrors] = useState<Partial<BadgeListFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [badgeimage, setBadgeImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<BadgeListFormState>(emptyObj);
  const [isFormChanged, setIsFormChanged] = useState<Boolean>(false);

  // Populate formData when the update modal opens and badge data is available
  useEffect(() => {
    if (badgeList) {
      setFormData((prev) => ({
        ...prev,
        _id: badgeList._id?.toString() ?? "",
        title: badgeList.title ?? "",
        description: badgeList.description ?? "",
        hours: badgeList.hours ?? "",
        points: badgeList.points ?? "",
        badge_for: badgeList.badge_for ?? "",
        imagepath: badgeList.imagepath ?? "",
      }));
    }
  }, [badgeList]);

  const handleClose = () => {
    setErrors({});
    setBadgeImage(null);
    setFormData(emptyObj);
    getListData();
    handleCloseModal();
  };

  // Update Input and error state
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

  //Function to validate the fields of the form
  const validate = (): boolean => {
    const newErrors: Partial<BadgeListFormState> = {};
    const { title, description, points, hours, badge_for, imagepath } =
      formData || {};

    if (!title) newErrors.title = "Title is required";
    if (!description) newErrors.description = "Description is required";
    if (!points) newErrors.points = "Points is required";
    if (!hours) newErrors.hours = "Hours is required";
    if (!badge_for) newErrors.badge_for = "Badge For is required";
    if (!badgeimage && !imagepath)
      newErrors.imagepath = "Badge Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //Function to submit the form
  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;
    if (!isFormChanged) {
      handleCloseModal();
      return;
    }
    setIsSubmitting(true);
    try {
      const formPayload = new FormData();
      if (badgeimage) formPayload.append("image", badgeimage);
      const { title, description, hours, points, badge_for } = formData;

      formPayload.append("title", title);
      formPayload.append("description", description);
      formPayload.append("hours", String(Number(hours)));
      formPayload.append("points", String(Number(points)));
      formPayload.append("badge_for", String(Number(badge_for)));

      // Set API endpoint and method based on modal mode (create or update)
      const url_path = badgeList
        ? `badges/update-badge/${formData?._id}`
        : "badges/save-badge";

      const response: any = await axiosInstance({
        url: url_path,
        method: badgeList ? "PUT" : "POST",
        headers: { "Content-Type": "multipart/form-data" },
        data: formPayload,
      });

      if (!response.error) {
        handleClose();
      }
    } catch (error: any) {
      if (error?.response?.data?.type === "validation_error") {
        let errors = error.response.data.message.errors; // API returned an error message
        setErrors(errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (file: File | null) => {
    setBadgeImage(file);
    if (!file) {
      setFormData((prev) => ({ ...prev, imagepath: "" }));
      return;
    }
    setErrors((prev) => ({ ...prev, imagepath: undefined }));
    setIsFormChanged(true);
  };

  return (
    <>
      <div className="modal-header">
        <h2>{badgeList ? "Update Badge" : "Create Badge"}</h2>
      </div>
      {/* Modal Body Start */}
      <div className="modal-body mx-xl-5">
        <form className="form">
          <CommonImageInput
            fieldName="badgeimage"
            onImageChange={handleFileChange}
            defaultImage={formData.imagepath}
            error={errors.imagepath}
          />
          <label className="required fs-6 fw-semibold form-label mb-1">
            Title
          </label>
          <CommonInput
            type="text"
            name="title"
            placeholder="Enter title"
            value={formData.title}
            onChange={handleInputChange}
            error={errors.title}
            limit={50}
          />
          <label className="required fs-6 fw-semibold form-label mb-1">
            Description
          </label>
          <CommonInput
            type="text"
            name="description"
            value={formData.description}
            placeholder="Enter description"
            onChange={(e) =>
              handleInputChange(e as React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>)
            }
            error={errors.description}
            // className={`form-control form-control-solid ${
            //     errors.description ? "is-invalid" : ""
            //   }`}
          />
          {/* <div className="mb-8 fv-row">
            <textarea
              className={`form-control form-control-solid ${
                errors.description ? "is-invalid" : ""
              }`}
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) =>
                handleInputChange(e as React.ChangeEvent<HTMLTextAreaElement>)
              }
              rows={4}
            />
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </div> */}
          <label className="required fs-6 fw-semibold form-label mb-1">
            Select Badge For
          </label>
          <div className="mb-8 fv-row">
            <select
              className={`form-select ${errors.badge_for ? "is-invalid" : ""}`}
              name="badge_for"
              value={formData.badge_for}
              onChange={handleInputChange}
            >
              <option value="">Select Badge For</option>
              <option value="1">Student</option>
              <option value="2">NPO</option>
            </select>
            {errors.badge_for && (
              <div className="invalid-feedback">{errors.badge_for}</div>
            )}
          </div>
          <label className="required fs-6 fw-semibold form-label mb-1">
            Hours
          </label>
          <CommonInput
            type="number"
            name="hours"
            placeholder="Enter Hours"
            value={formData.hours}
            onChange={handleInputChange}
            error={errors.hours}
          />
          <label className="required fs-6 fw-semibold form-label mb-1">
            Points
          </label>
          <CommonInput
            type="number"
            name="points"
            placeholder="Enter Points"
            value={formData.points}
            onChange={handleInputChange}
            error={errors.points}
          />
          <div className="text-center">
            <button
              type="button"
              className="btn btn-light me-3"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            {isSubmitting ? (
              <button
                type="button"
                id="kt_modal_new_card_submit"
                className="btn btn-primary"
                disabled={true}
              >
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
                id="kt_modal_new_card_submit"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                <span className="indicator-label">Submit</span>
              </button>
            )}
          </div>
        </form>
      </div>
      {/* Modal Body End */}
    </>
  );
};

export default CreateUpdateBadgeList;
