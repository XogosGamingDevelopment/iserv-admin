import React, { useState, useEffect } from "react";
import { CommonInput } from "../common";
import { EventInterest } from "../../types/interfaces";
import { InterestFormState } from "./List";
import useAxios from "../../hooks/useAxios";
import { useModalState } from "../../hooks/useModalState";

type ModalProps = {
  interest?: EventInterest | null;
  getListData: () => void;
};

const CreateUpdateInterest: React.FC<ModalProps> = ({
  interest,
  getListData,
}) => {
  const axiosInstance = useAxios();
  const { handleCloseModal } = useModalState();
  const [errors, setErrors] = useState<Partial<InterestFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InterestFormState>({
    _id: "",
    title: "",
    description: "",
  });
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);

  useEffect(() => {
    if (interest) {
      setFormData((prev) => ({
        ...prev,
        _id: interest._id ?? "",
        title: interest.title ?? "",
        description: interest.description ?? "",
      }));
    }
  }, [interest]);

  /*Handle Form Element Value Changed*/
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsFormChanged(true);
  };

  /*Validate Form*/
  const validate = (): boolean => {
    const newErrors: Partial<InterestFormState> = {};
    if (!formData.title) {
      newErrors.title = "Title is required";
    }
    if (!formData.description) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*Submit Form*/
  const handleSubmit = async (): Promise<void> => {
    if (validate()) {
      if(!isFormChanged){
        handleCloseModal();
        return;
      }
      setIsSubmitting(true);
      try {
        const response: any = await axiosInstance({
          url: "event-interest/create-update",
          method: "POST",
          data: formData,
        });
        //console.log('create/update response', response.data)
        //on success close the modal
        if (!response.error) {
          handleClose();
        }
      } catch (error: any) {
        //console.error('Error in api request:', error);
        if (error?.response?.data?.type === "validation_error") {
          let errors = error.response.data.message.errors; // API returned an error message
          setErrors(errors);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    const newErrors: Partial<InterestFormState> = {};
    setErrors(newErrors);
    setFormData({ _id: "", title: "", description: "" });
    getListData();
    handleCloseModal();
  };

  return (
    <>
      <div className="modal-header">
        <h2>{interest ? "Update Interest" : "Create Interest"}</h2>
      </div>
      <div className="modal-body mx-xl-5">
        <form className="form">
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
            placeholder="Enter description"
            value={formData.description}
            onChange={handleInputChange}
            error={errors.description}
            // className={`form-control form-control-solid ${
            //   errors.description ? "is-invalid" : ""
            // }`}
          />

          <div className="border-top mb-2" />
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
    </>
  );
};

export default CreateUpdateInterest;
