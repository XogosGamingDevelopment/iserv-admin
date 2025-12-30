/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from "react";
import {
  CommonImageInput,
  CommonInput,
  PageToolbar,
  QuillEditor,
  CommonDatePicker,
  CommonTimePicker,
  CustomFileSelector,
  EventMapLeaflet,
} from "../common";
// import useAxios from "../../hooks/useAxios";

interface EventFormState {
  title: string;
  description: string;
  special_condition: string;
  address: string;
  address_lat: string;
  address_long: string;
  volunteers_count: number;
  event_type: number;
  selected_day: string;
  event_date: string;
  event_time: string;
  event_status: number;
  event_duration: number;
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const dates = Array.from({ length: 31 }, (_, i) => i + 1);
const CreateEvent: React.FC = () => {
  // const axiosInstance = useAxios();
  const [formdata, setFormData] = useState<EventFormState>({
    title: "",
    description: "",
    special_condition: "",
    address: "",
    address_lat: "",
    address_long: "",
    volunteers_count: 0,
    event_type: 0,
    selected_day: "",
    event_date: "",
    event_time: "",
    event_status: 0,
    event_duration: 0,
  });
  const [errors, setErrors] = useState<Partial<EventFormState>>({});
  const [thumbnailimage, setThumbnailImage] = useState<File | null>(null);
  const [bannerimage, setBannerImage] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const descriptionRef = useRef<any>(null);
  const conditionRef = useRef<any>(null);

  // Handle form input changes
  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement |HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    //console.log('date range input name', name);
    //console.log('date range input value', value);
    let clean_value: string | number = value;
    if (name === "event_type") {
      clean_value = Number(clean_value);
    } else if (name === "volunteers_count") {
      clean_value = Number(clean_value);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: clean_value,
    }));
  };

  const handleDescriptionChange = (text: string) => {
    setFormData({ ...formdata, description: text });
  };

  const handleSpecialConditionChange = (text: string) => {
    setFormData({ ...formdata, special_condition: text });
  };

  const handleDateChange = (event: { name: string; value: string }) => {
    const { name, value } = event;
    console.log(`name: ${name}, value: ${value}`);
    //console.log('date range input name', name);
    //console.log('date range input value', value);
  };

  const handleTimeChange = (event: { name: string; value: string }) => {
    const { name, value } = event;
    console.log(`name: ${name}, value: ${value}`);
    //console.log('date range input name', name);
    //console.log('date range input value', value);
  };

  const validateForm = () => {};

  const handleSubmit = () => {};
  console.log("current formdata", formdata);
  return (
    <div className="d-flex flex-column flex-column-fluid">
      {/*Page toolbar Area Start*/}
      <PageToolbar title="Create Event" />
      {/*Page toolbar Area End*/}
      {/*Page Conent Area Start*/}
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <form
            id="kt_ecommerce_add_category_form"
            className="form d-flex flex-column flex-lg-row fv-plugins-bootstrap5 fv-plugins-framework"
            data-kt-redirect="apps/ecommerce/catalog/categories.html"
          >
            <div className="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
              <div className="card card-flush py-4">
                <div className="card-body pt-0">
                  <label className="required form-label">Thumbnail</label>
                  <br />
                  <div className="text-center mb-3">
                    <CommonImageInput
                      fieldName="thumbnail_image"
                      defaultImage="/assets/media/svg/blank-image.svg"
                      onImageChange={(file) => setThumbnailImage(file)}
                    />
                  </div>
                  <div className="text-muted fs-7">
                    Set the event thumbnail image. Only *.png, *.jpg and *.jpeg
                    image files are accepted
                  </div>
                </div>
              </div>
              <div className="card card-flush py-4">
                <div className="card-body pt-0">
                  <label className="required form-label">Banner Image</label>
                  <br />
                  <div className="text-center mb-3">
                    <CommonImageInput
                      fieldName="banner_image"
                      defaultImage="/assets/media/svg/blank-image.svg"
                      onImageChange={(file) => setBannerImage(file)}
                    />
                  </div>
                  <div className="text-muted fs-7">
                    Set the event banner image. Only *.png, *.jpg and *.jpeg
                    image files are accepted
                  </div>
                </div>
              </div>
              <div className="card card-flush py-4">
                <div className="card-body pt-0">
                  <label className="required form-label">Location</label>
                  <CommonInput
                    type="text"
                    name="event_address"
                    placeholder="Event address"
                    value={formdata.address}
                    onChange={handleFormInputChange}
                  />
                  <div className="text-muted fs-7">
                    Event location is required.
                  </div>
                  <EventMapLeaflet height="200px" width="240px" />
                </div>
              </div>
              <div className="card card-flush py-4">
                <div className="card-body pt-0">
                  <label className="required form-label">Status</label>
                  <select
                    className="form-select mb-2"
                    name="event_status"
                    value={formdata.event_status}
                    onChange={handleFormInputChange}
                  >
                    <option value="">Select an option</option>
                    <option value="0">Draft</option>
                    <option value="1">Published</option>
                    {/*<option value="scheduled">Completed</option>
						  <option value="unpublished">Cancelled</option>*/}
                  </select>
                  <div className="text-muted text-info fs-7">
                    Set the event status.
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
              <div className="card card-flush py-4">
                <div className="card-header">
                  <div className="card-title">
                    <h2>General Info</h2>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <div className="mb-4 fv-row fv-plugins-icon-container">
                    <label className="required form-label">Event Name</label>
                    <CommonInput
                      type="text"
                      name="title"
                      placeholder="Event Title"
                      value={formdata.title}
                      onChange={handleFormInputChange}
                    />
                    <div className="text-muted fs-7">
                      A event name is required and recommended to be unique.
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="required form-label">Description</label>
                    {/* Use QuillEditor Component */}
                    <QuillEditor
                      ref={descriptionRef}
                      defaultValue={formdata.description}
                      onTextChange={handleDescriptionChange}
                    />
                    <div className="text-muted fs-7">
                      Set a description to the event.
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-10 fv-row fv-plugins-icon-container fv-plugins-bootstrap5-row-valid">
                        <label className="required form-label">
                          Event Type{" "}
                        </label>
                        <div className="row mb-2">
                          <div className="col">
                            <label
                              className={`btn btn-outline btn-outline-dashed btn-active-light-primary w-100 p-3 ${
                                formdata.event_type === 1 ? "active" : ""
                              }`}
                            >
                              <input
                                type="radio"
                                className="btn-check"
                                name="event_type"
                                value={1}
                                onChange={handleFormInputChange}
                              />
                              <span className="fs-0">Once</span>
                            </label>
                          </div>
                          <div className="col">
                            <label
                              className={`btn btn-outline btn-outline-dashed btn-active-light-primary w-100 p-3 ${
                                formdata.event_type === 2 ? "active" : ""
                              }`}
                            >
                              <input
                                type="radio"
                                className="btn-check"
                                name="event_type"
                                value={2}
                                onChange={handleFormInputChange}
                              />
                              <span className="fs-0">Daily</span>
                            </label>
                          </div>
                          <div className="col">
                            <label
                              className={`btn btn-outline btn-outline-dashed btn-active-light-primary w-100 p-3 ${
                                formdata.event_type === 3 ? "active" : ""
                              }`}
                            >
                              <input
                                type="radio"
                                className="btn-check"
                                name="event_type"
                                value={3}
                                onChange={handleFormInputChange}
                              />
                              <span className="fs-0">Weekly</span>
                            </label>
                          </div>
                          <div className="col">
                            <label
                              className={`btn btn-outline btn-outline-dashed btn-active-light-primary w-100 p-3 ${
                                formdata.event_type === 4 ? "active" : ""
                              }`}
                            >
                              <input
                                type="radio"
                                className="btn-check"
                                name="event_type"
                                value={4}
                                onChange={handleFormInputChange}
                              />
                              <span className="fs-0">Monthly</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-5">
                    <div
                      className={`${
                        formdata.event_type === 1 ? "col-md-6" : "col-md-3"
                      } mb-2`}
                    >
                      <label className="required form-label">
                        Event Start Date
                      </label>
                      <CommonDatePicker
                        field_name="event_start_date"
                        handleInputChange={handleDateChange}
                      />
                    </div>
                    {formdata.event_type !== 1 && (
                      <div className="col-md-3 mb-2">
                        <label className="required form-label">
                          Event End Date
                        </label>
                        <CommonDatePicker
                          field_name="event_end_date"
                          handleInputChange={handleDateChange}
                        />
                      </div>
                    )}
                    <div className="col-md-3 mb-2">
                      <label className="required form-label">
                        Event Start Time
                      </label>
                      <CommonTimePicker
                        field_name="event_start_time"
                        handleInputChange={handleTimeChange}
                      />
                    </div>
                    <div className="col-md-3 mb-2">
                      <label className="required form-label">
                        Event End Time
                      </label>
                      <CommonTimePicker
                        field_name="event_end_time"
                        handleInputChange={handleTimeChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    {formdata.event_type === 3 && (
                      <div className="col-md-6">
                        <label className="form-label">Select Day</label>
                        <select
                          className="form-select"
                          name="selected_day"
                          value={formdata.selected_day}
                          onChange={handleFormInputChange}
                        >
                          <option value="">-- Select a Day --</option>
                          {days.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {formdata.event_type === 4 && (
                      <div className="col-md-6">
                        <label htmlFor="dateDropdown" className="form-label">
                          Select Day of Month
                        </label>
                        <select
                          name="selected_day"
                          className="form-select"
                          value={formdata.selected_day}
                          onChange={handleFormInputChange}
                        >
                          <option value="">-- Select a Day --</option>
                          {dates.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="col-md-6">
                      <label className="required form-label">
                        No Of Volunteer
                      </label>
                      <input
                        type="number"
                        name="volunteers_count"
                        placeholder="No Of Volunteer"
                        min={0}
                        value={
                          formdata.volunteers_count
                            ? String(formdata.volunteers_count)
                            : ""
                        }
                        onChange={handleFormInputChange}
                        className={`form-control bg-transparent ${
                          errors.volunteers_count ? "is-invalid" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card card-flush py-4">
                <div className="card-header">
                  <div className="card-title">
                    <h2 className="">Special Conditions</h2>
                  </div>
                </div>
                <div className="card-body pt-0 mb-10">
                  <QuillEditor
                    ref={conditionRef}
                    defaultValue={formdata.special_condition}
                    onTextChange={handleSpecialConditionChange}
                  />
                  <div className="text-muted fs-7">
                    Set a special conditions to the event.
                  </div>
                </div>
              </div>
              <div className="card card-flush py-4">
                <div className="card-header">
                  <div className="card-title">
                    <h2>Upload Waiver Form</h2>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <CustomFileSelector
                    field_name="waiver_form"
                    info_text="Select a pdf file to upload"
                    onFileUpload={setUploadedFiles}
                    multiple={false} // Set to true for multiple files
                    acceptedFiles="application/pdf" // Accept only images
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <a
                  href="apps/ecommerce/catalog/products.html"
                  id="kt_ecommerce_add_product_cancel"
                  className="btn btn-light me-5"
                >
                  Cancel
                </a>
                <button
                  type="submit"
                  id="kt_ecommerce_add_category_submit"
                  className="btn btn-primary"
                >
                  <span className="indicator-label">Save Changes</span>
                  <span className="indicator-progress">
                    Please wait...
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/*Page Conent Area End*/}
    </div>
  );
};

export default CreateEvent;
