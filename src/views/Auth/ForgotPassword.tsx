import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import helpers from "../../_helpers/common";
import useAxios from "../../hooks/useAxios";
import { CommonInput, SubmitButton } from "../common";

interface ForgotFormState {
  email: string;
}

function ForgotPassword() {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ForgotFormState>({ email: "" });
  const [errors, setErrors] = useState<Partial<ForgotFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*Handle Form Element Value Changed*/
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement |HTMLTextAreaElement>) => {
    //console.log('handle input change called')
    const { name, value } = e.target;
    let clean_val = value;
    // Clear error for this field if it exists
    setErrors({
      ...errors,
      [name]: undefined,
    });
    //set form data in state
    setFormData({
      ...formData,
      [name]: clean_val,
    });
  };

  /*Validate Form*/
  const validate = (): boolean => {
    const newErrors: Partial<ForgotFormState> = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!helpers.isValidEmail(formData.email)) {
      newErrors.email = "Invalid email address";
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
          url: "users/forgot-password",
          method: "POST",
          data: {
            email: formData.email,
            request_type: "send",
            request_for: "admin",
          },
        });
        //after successfull login check user and redirect him correspondingly
        if (!response.error) {
          //navigate('/forgot-password-email-sent', { reset_email: formData.email })
          navigate("/forgot-password-email-sent", {
            state: { reset_email: formData.email },
          });
        }
      } catch (error) {
        console.error("Error in api request:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div
      className="d-flex flex-column justify-content-center flex-root"
      id="kt_app_root"
    >
      <div className="d-flex flex-column flex-column-fluid flex-lg-row">
        <div className="d-flex flex-center w-lg-50 pt-15 pt-lg-0 px-10">
          <div className="d-flex flex-center flex-lg-start flex-column">
            <a href="index.html" className="mb-7">
              <img alt="Logo" src="/admin/mascot-logo.png" />
            </a>
            <h2 className="text-white fw-normal m-0">
              Branding tools designed for your business
            </h2>
          </div>
        </div>
        <div className="d-flex flex-column-fluid flex-lg-row-auto justify-content-center justify-content-lg-end p-12 p-lg-20">
          <div className="bg-body d-flex flex-column align-items-stretch flex-center rounded-4 w-md-600px p-20">
            <div className="d-flex flex-center flex-column flex-column-fluid px-lg-10 pb-15 pb-lg-20">
              <form className="form w-100" id="kt_password_reset_form">
                <div className="text-center mb-10">
                  <h1 className="text-gray-900 fw-bolder mb-3">
                    Forgot Password ?
                  </h1>
                  <div className="text-gray-500 fw-semibold fs-6">
                    Enter your email to reset your password.
                  </div>
                </div>
                <CommonInput
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
                <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
                  <div></div>
                  <Link to="/login" className="link-primary">
                    Continue to Login ?
                  </Link>
                </div>
                <SubmitButton
                  isSubmitting={isSubmitting}
                  onClick={handleSubmit}
                  label="Continue"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
