import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { setUser } from "../../redux/userSlice";
import helpers from "../../_helpers/common";
import useAxios from "../../hooks/useAxios";
import { CommonInput, SubmitButton } from "../common";

interface LoginFormState {
  email: string;
  password: string;
}
interface FormData {
  login_type?: number;
  email?: string;
  password?: string;
  google_id?: string;
  xogo_id?: string;
  [key: string]: any; // Allow dynamic keys
}

function Login() {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [logintype, setLoginType] = useState(1);
  const [errors, setErrors] = useState<Partial<LoginFormState>>({});
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
    if (logintype !== 1) {
      return true;
    }
    const newErrors: Partial<LoginFormState> = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!helpers.isValidEmail(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Your password length is too short";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*Submit Form*/
  const handleSubmit = async (): Promise<void> => {
    if (validate()) {
      setIsSubmitting(true);
      var form_data = await prepareRequestData();
      try {
        const response: any = await axiosInstance({
          url: "users/admin-login",
          method: "POST",
          data: form_data,
        });
        //console.log('login response', response.data)
        //after successfull login check user and redirect him correspondingly
        if (!response.error) {
          localStorage.setItem("token", response.data.authToken);
          let details = response.data.user;
          if (details) {
            localStorage.setItem("user", JSON.stringify(details));
            //set user data in redux store
            dispatch(setUser(details));
          }
          navigate("/dashboard");
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

  const prepareRequestData = async () => {
    let form_data: FormData = {};
    form_data.login_type = logintype;
    form_data.email = formData.email;
    form_data.password = formData.password;
    form_data.google_id = "";
    form_data.xogo_id = "";
    return form_data;
  };

  return (
    <div className="d-flex flex-column flex-root align-middle">
      <div className="d-flex flex-column flex-column-fluid flex-lg-row">
        <div className="d-flex flex-center w-lg-50 pt-15 pt-lg-0 px-10">
          <div className="d-flex flex-center flex-lg-start flex-column">
            <a href="index.html" className="mb-7">
              <img alt="Logo" src="/mascot-logo.png" />
            </a>
            <h2 className="text-white fw-normal m-0">
              Branding tools designed for your business
            </h2>
          </div>
        </div>
        <div className="d-flex flex-column-fluid flex-lg-row-auto justify-content-center justify-content-lg-end p-12 p-lg-20">
          <div className="bg-body d-flex flex-column align-items-stretch flex-center rounded-4 w-md-600px p-20">
            <div className="d-flex flex-center flex-column flex-column-fluid px-lg-10 pb-15 pb-lg-20">
              <form className="form w-100">
                <div className="text-center mb-11">
                  <h1 className="text-gray-900 fw-bolder mb-3">Sign In</h1>
                  {/*<div className="text-gray-500 fw-semibold fs-6">Your Social Campaigns</div>*/}
                  <div className="text-gray-500 fw-semibold fs-6">
                    Your iServ Account
                  </div>
                </div>
                {/*<div className="row g-3 mb-9">
										<div className="col-md-6">
											<a href="#" className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100">
											<img alt="Logo" src="/assets/media/svg/brand-logos/google-icon.svg" className="h-15px me-3" />Sign in with Google</a>
										</div>
										<div className="col-md-6">
											<a href="#" className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100">
											<img alt="Logo" src="/assets/media/svg/brand-logos/apple-black.svg" className="theme-light-show h-15px me-3" />
											<img alt="Logo" src="/assets/media/svg/brand-logos/apple-black-dark.svg" className="theme-dark-show h-15px me-3" />Sign in with Apple</a>
										</div>
									</div>
									<div className="separator separator-content my-14">
										<span className="w-125px text-gray-500 fw-semibold fs-7">Or with email</span>
									</div>*/}
                <CommonInput
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
                <CommonInput
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  autoComplete="new-password"
                />
                <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
                  <div></div>
                  <Link to="/forgot-password" className="link-primary">
                    Forgot Password ?
                  </Link>
                </div>
                <SubmitButton
                  isSubmitting={isSubmitting}
                  onClick={handleSubmit}
                  label="Sign In"
                />
                <div className="gap-3"></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
