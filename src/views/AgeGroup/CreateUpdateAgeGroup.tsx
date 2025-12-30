import React, { useEffect, useState } from 'react';
import { CommonInput } from '../common';
import { AgeGroup } from '../../types/interfaces';
import useAxios from '../../hooks/useAxios';
import { AgeGroupFormState } from './List';
import { useModalState } from '../../hooks/useModalState';

type ModalProps = {
  ageGroup?: AgeGroup | null;
  getListData: () => void;
};

const CreateUpdateAgeGroup: React.FC<ModalProps> = (props) => {
  const { ageGroup, getListData } = props;
  const axiosInstance = useAxios();
  const { handleCloseModal } = useModalState();
  const [errors, setErrors] = useState<Partial<AgeGroupFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AgeGroupFormState>({
    _id: '',
    title: '',
    description: '',
  });
  const [isFormChanged, setIsFormChanged] = useState<Boolean>(false);

  useEffect(() => {
    if (ageGroup) {
      setFormData((prev) => ({
        ...prev,
        _id: ageGroup._id ?? '',
        title: ageGroup.title ?? '',
        description: ageGroup.description ?? '',
      }));
    }
  }, [ageGroup]);

  const handleClose = () => {
    const newErrors: Partial<AgeGroupFormState> = {};
    setErrors(newErrors);
    getListData();
    handleCloseModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement |HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsFormChanged(true);
  };

  const validate = (): boolean => {
    const newErrors: Partial<AgeGroupFormState> = {};
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (validate()) {
      if(!isFormChanged){
        handleCloseModal();
        return;
      }
      setIsSubmitting(true);
      try {
        const response: any = await axiosInstance({
          url: 'event-age-group/create-update',
          method: 'POST',
          data: formData,
        });
        if (!response.error) {
          handleClose();
        }
      } catch (error: any) {
        if (error?.response?.data?.type === 'validation_error') {
          let errors = error.response.data.message.errors; // API returned an error message
          setErrors(errors);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <div className='modal-header'>
        <h2>{ageGroup ? 'Update Age Group' : 'Create Age Group'}</h2>
      </div>
      <div className='modal-body mx-xl-5'>
        <form className='form'>
          <label className='required fs-6 fw-semibold form-label mb-1'>
            Title
          </label>
          <CommonInput
            type='text'
            name='title'
            placeholder='Enter title'
            value={formData.title}
            onChange={handleInputChange}
            error={errors.title}
            limit={50}
          />
          <label className='required fs-6 fw-semibold form-label mb-1'>
            Description
          </label>
          <CommonInput
            type='text'
            name='description'
            placeholder='Enter description'
            value={formData.description}
            onChange={handleInputChange}
            error={errors.description}
            // className={`form-control form-control-solid ${
            //   errors.description ? "is-invalid" : ""
            // }`}
          />

          <div className='border-top mb-2' />
          <div className='text-center'>
            <button
              type='button'
              className='btn btn-light me-3'
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            {isSubmitting ? (
              <button
                type='button'
                id='kt_modal_new_card_submit'
                className='btn btn-primary'
                disabled={true}
              >
                <span
                  className='indicator-progress'
                  style={{ display: 'block' }}
                >
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              </button>
            ) : (
              <button
                type='button'
                id='kt_modal_new_card_submit'
                className='btn btn-primary'
                onClick={handleSubmit}
              >
                <span className='indicator-label'>Submit</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateUpdateAgeGroup;
