import React, { useState, useEffect } from "react";
import { CommonInput } from "../common";
import { Setting } from "../../types/interfaces";
import { SettingFormState } from "./List";
import useAxios from "../../hooks/useAxios";
import { useModalState } from "../../hooks/useModalState";

type ModalProps = {
  setting?: Setting | null;
  getListData: () => void;
};

const CreateUpdateSetting: React.FC<ModalProps> = ({
  setting,
  getListData,
}) => {
  const axiosInstance = useAxios();
  const { handleCloseModal } = useModalState();
  const [errors, setErrors] = useState<Partial<SettingFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SettingFormState>({
    _id: "",
    name: "",
    value: "",
  });
  const [isFormChanged, setIsFormChanged] = useState<Boolean>(false);

  useEffect(() => {
    if (setting) {
      setFormData((prev) => ({
        ...prev,
        _id: setting._id ?? "",
        name: setting.name ?? "",
        value: setting.value ?? "",
      }));
    }
  }, [setting]);

  /*Handle Form Element Value Changed*/
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement |HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsFormChanged(true);
  };

  /*Validate Form*/
  const validate = (): boolean => {
    const newErrors: Partial<SettingFormState> = {};
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.value) {
      newErrors.value = "Value is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*Submit Form*/
  const handleSubmit = async (): Promise<void> => {
    if (validate()) {
      if (!isFormChanged) {
        handleCloseModal();
        return;
      }
      setIsSubmitting(true);
      try {
        const response: any = await axiosInstance({
          url: "settings/create-update",
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
    const newErrors: Partial<SettingFormState> = {};
    setErrors(newErrors);
    getListData();
    handleCloseModal();
  };

  return (
    <>
      <div className="modal-header">
        <h2>{setting ? "Update Setting" : "Create Setting"}</h2>
      </div>
      <div className="modal-body mx-xl-5">
        <form className="form">
          <label className="required fs-6 fw-semibold form-label mb-1">
            Name
          </label>
          <CommonInput
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            limit={50}
          />
          <label className="required fs-6 fw-semibold form-label mb-1">
            Value
          </label>
          <CommonInput
            type="text"
            name="value"
            placeholder="Enter value"
            value={formData.value}
            onChange={handleInputChange}
            error={errors.value}
            limit={100}
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

export default CreateUpdateSetting;
