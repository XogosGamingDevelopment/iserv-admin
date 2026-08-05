import React, { useState, useEffect, useCallback } from "react";
import useAxios from "../../hooks/useAxios";
import { PageToolbar } from "../common";
import ContentLoader from "../common/ContentLoader";
import Swal from "sweetalert2";

const WaiverManagement: React.FC = () => {
  const axiosInstance = useAxios();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentWaiver, setCurrentWaiver] = useState<{
    has_waiver: boolean;
    waiver_path: string | null;
    waiver_url: string | null;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchCurrentWaiver = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await axiosInstance({
        url: "settings/default-waiver",
        method: "GET",
      });
      if (response.data) {
        setCurrentWaiver(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching default waiver:", error);
    } finally {
      setIsLoading(false);
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchCurrentWaiver();
  }, [fetchCurrentWaiver]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Please select a PDF file only.",
        });
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        icon: "warning",
        title: "No File Selected",
        text: "Please select a PDF file to upload.",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response: any = await axiosInstance({
        url: "settings/upload-default-waiver",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Default waiver uploaded successfully!",
        });
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById("waiver-file-input") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
        fetchCurrentWaiver();
      }
    } catch (error: any) {
      console.error("Error uploading waiver:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.response?.data?.message || "Failed to upload waiver. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (currentWaiver?.waiver_url) {
      window.open(currentWaiver.waiver_url, "_blank");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <PageToolbar title="Waiver Management" />
      </div>

      <div id="kt_content" className="content flex-column-fluid">
        <div className={`card ${isLoading ? "overlay overlay-block" : ""}`}>
          <div className="card-header border-0 pt-6">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold text-gray-800">Default iServ Waiver</span>
              <span className="text-muted mt-1 fw-semibold fs-7">
                This waiver is required for all students before they can volunteer for any event.
              </span>
            </h3>
          </div>

          <div className="card-body">
            {/* Current Waiver Section */}
            <div className="mb-10">
              <h5 className="fw-bold text-gray-700 mb-4">Current Default Waiver</h5>
              {currentWaiver?.has_waiver ? (
                <div className="d-flex align-items-center p-5 bg-light-primary rounded">
                  <div className="d-flex flex-column flex-grow-1">
                    <span className="text-gray-800 fw-bold fs-6">
                      <i className="ki-outline ki-file-added text-primary fs-2 me-2"></i>
                      Default Waiver PDF
                    </span>
                    <span className="text-muted fs-7 mt-1">
                      Path: {currentWaiver.waiver_path}
                    </span>
                  </div>
                  <div className="d-flex">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={handleDownload}
                    >
                      <i className="ki-outline ki-cloud-download fs-4 me-1"></i>
                      Download
                    </button>
                    <a
                      href={currentWaiver.waiver_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-light-primary"
                    >
                      <i className="ki-outline ki-eye fs-4 me-1"></i>
                      View
                    </a>
                  </div>
                </div>
              ) : (
                <div className="d-flex align-items-center p-5 bg-light-warning rounded">
                  <i className="ki-outline ki-information-4 text-warning fs-2x me-3"></i>
                  <div className="d-flex flex-column">
                    <span className="text-gray-800 fw-bold fs-6">No Default Waiver Set</span>
                    <span className="text-muted fs-7">
                      Please upload a default waiver PDF below.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Section */}
            <div className="separator separator-dashed my-8"></div>

            <div>
              <h5 className="fw-bold text-gray-700 mb-4">
                {currentWaiver?.has_waiver ? "Replace Default Waiver" : "Upload Default Waiver"}
              </h5>
              <div className="mb-5">
                <label className="form-label fw-semibold text-gray-700">
                  Select PDF File
                </label>
                <input
                  id="waiver-file-input"
                  type="file"
                  className="form-control form-control-solid"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                />
                <div className="form-text text-muted">
                  Only PDF files are allowed. This waiver will be presented to all students before they can volunteer.
                </div>
              </div>

              {selectedFile && (
                <div className="d-flex align-items-center p-4 bg-light rounded mb-5">
                  <i className="ki-outline ki-file text-primary fs-2x me-3"></i>
                  <div className="d-flex flex-column flex-grow-1">
                    <span className="text-gray-800 fw-bold">{selectedFile.name}</span>
                    <span className="text-muted fs-7">
                      Size: {(selectedFile.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                  <button
                    className="btn btn-sm btn-light-danger"
                    onClick={() => {
                      setSelectedFile(null);
                      const fileInput = document.getElementById("waiver-file-input") as HTMLInputElement;
                      if (fileInput) {
                        fileInput.value = "";
                      }
                    }}
                  >
                    <i className="ki-outline ki-cross fs-4"></i>
                    Remove
                  </button>
                </div>
              )}

              <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="ki-outline ki-cloud-add fs-4 me-1"></i>
                    {currentWaiver?.has_waiver ? "Replace Waiver" : "Upload Waiver"}
                  </>
                )}
              </button>
            </div>

            {/* Info Section */}
            <div className="separator separator-dashed my-8"></div>

            <div className="notice d-flex bg-light-info rounded border-info border border-dashed p-6">
              <i className="ki-outline ki-information-5 text-info fs-2tx me-4"></i>
              <div className="d-flex flex-stack flex-grow-1">
                <div className="fw-semibold">
                  <h4 className="text-gray-900 fw-bold">How the Waiver System Works</h4>
                  <div className="fs-6 text-gray-700">
                    <ul className="mb-0">
                      <li>Students must sign this iServ waiver once before volunteering for any event.</li>
                      <li>Once signed, the waiver applies to all future events.</li>
                      <li>If an NPO provides their own waiver for an event, students must sign both the iServ waiver and the NPO waiver.</li>
                      <li>Students will download this PDF, print it, sign it physically, scan it, and upload the signed copy.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading && <ContentLoader />}
        </div>
      </div>
    </>
  );
};

export default WaiverManagement;
