import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import helpers from "../../_helpers/common";
import useAxios from "../../hooks/useAxios";
import { CommonInput, SubmitButton } from "../common";

interface ResetFormState {
  password: string;
  confirm_password: string;
}

// interface FormData {
//   password?: string;
//   confirm_password?: string;
// }

function ResetPassword() {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const { token } = useParams();
  //console.log('token :', token)
  const [formData, setFormData] = useState<ResetFormState>({
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<Partial<ResetFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkTokenIsvalid();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkTokenIsvalid = async (): Promise<void> => {
    try {
      // const response: any = await axiosInstance({
      await axiosInstance({
        url: "users/forgot-password/check-token-is-valid",
        method: "POST",
        data: { token: token },
      });
      //console.log('check token is valid', response.data.response)
      //console.log('login response message', response.message)
      //after successfull login check user and redirect him correspondingly
    } catch (error: any) {
      //console.error("Error in api request:", error);
      if (error?.response?.data?.error) {
        navigate("/forgot-password");
      }
    } finally {
      //setIsSubmitting(false);
    }
  };

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
    const newErrors: Partial<ResetFormState> = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      let error =  helpers.isValidFormatForPassword(formData.password);
        if(error) newErrors.password = error;
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "Confirm password is required";
    } else if (formData.confirm_password !== formData.password) {
      newErrors.confirm_password = "Confirm password must be same as password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*Submit Form*/
  const handleSubmit = async (): Promise<void> => {
    if (validate()) {
      setIsSubmitting(true);
      var form_data = {
        token: token,
        password: formData.password,
        confirm_password: formData.confirm_password,
      };
      try {
        const response: any = await axiosInstance({
          url: "users/reset-password",
          method: "POST",
          data: form_data,
        });

        //console.log('reset response', response)
        if (!response.error) {
          navigate("/login");
        }
      } catch (error: any) {
        console.error("Error in api request:", error);
        if (error?.response?.data?.error) {
          navigate("/forgot-password");
        }
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
                    Setup New Password
                  </h1>
                  <div className="text-gray-500 fw-semibold fs-6">
                    Have you already reset the password ?
                    <Link to="/login" className="link-primary fw-bold">
                      Sign in
                    </Link>
                  </div>
                </div>
                <div className="fv-row mb-8" data-kt-password-meter="true">
                  <div className="mb-1">
                    <div className="position-relative mb-3">
                      <CommonInput
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={errors.password}
                      />
                      <span
                        className="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
                        data-kt-password-meter-control="visibility"
                      >
                        <i className="ki-outline ki-eye-slash fs-2"></i>
                        <i className="ki-outline ki-eye fs-2 d-none"></i>
                      </span>
                    </div>
                    <div
                      className="d-flex align-items-center mb-3"
                      data-kt-password-meter-control="highlight"
                    >
                      <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                      <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                      <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                      <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
                    </div>
                  </div>
                  <div className="text-muted">
                    Use 8 or more characters with a mix of letters, numbers &
                    symbols.
                  </div>
                </div>
                <CommonInput
                  type="password"
                  name="confirm_password"
                  placeholder="Enter same password again"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  error={errors.confirm_password}
                />
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

export default ResetPassword;
