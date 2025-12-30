import React, { useState, useRef } from "react";

interface FileSelectorProps {
  field_name: string;
  info_text: string;
  onFileUpload: (files: File[]) => void;
  multiple?: boolean;
  acceptedFiles?: string; //Example: "image/*,application/pdf"
  maxFileSizeMB?: number; //Max file size in MB
}

const CustomFileSelector: React.FC<FileSelectorProps> = ({
  field_name,
  info_text,
  onFileUpload,
  multiple = true,
  acceptedFiles = "image/*",
  maxFileSizeMB = 1,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    let validFiles: File[] = [];
    let errors: string[] = [];
    for (const file of newFiles) {
      if (!file.type.match(acceptedFiles.replace(/,/g, "|"))) {
        errors.push(`Selected file ${file.name} is not an accepted file type.`);
        continue;
      }
      if (file.size / 1024 / 1024 > maxFileSizeMB) {
        errors.push(
          `Selected file ${file.name} exceeds the ${maxFileSizeMB}MB limit.`
        );
        continue;
      }
      validFiles.push(file);
    }
    if (errors.length) {
      setErrorMessage(errors.join("\n"));
    } else {
      setErrorMessage("");
    }
    setSelectedFiles(multiple ? [...selectedFiles, ...validFiles] : validFiles);
    onFileUpload(multiple ? [...selectedFiles, ...validFiles] : validFiles);
    //setSelectedFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles));
    //onFileUpload(multiple ? [...selectedFiles, ...newFiles] : newFiles);
  };

  const handleRemoveFile = (fileToRemove: File) => {
    const updatedFiles = selectedFiles.filter((file) => file !== fileToRemove);
    setSelectedFiles(updatedFiles);
    onFileUpload(updatedFiles);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFileSelection(event.dataTransfer.files);
  };

  const showIcon = (file_type: string): React.ReactNode => {
    const fileType = file_type.toLowerCase();
    if (fileType.includes("pdf")) {
      return <i className="bi bi-file-earmark-pdf text-danger fs-3"></i>;
    } else if (fileType.includes("image")) {
      return <i className="bi bi-file-earmark-image text-primary"></i>;
    } else if (
      fileType.includes("word") ||
      fileType.includes("msword") ||
      fileType.includes(
        "vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    ) {
      return <i className="bi bi-file-earmark-word text-primary"></i>;
    } else if (
      fileType.includes("excel") ||
      fileType.includes("spreadsheetml")
    ) {
      return <i className="bi bi-file-earmark-excel text-success"></i>;
    } else if (fileType.includes("text")) {
      return <i className="bi bi-file-earmark-text text-secondary"></i>;
    } else if (fileType.includes("zip") || fileType.includes("compressed")) {
      return <i className="bi bi-file-earmark-zip text-warning"></i>;
    } else {
      return <i className="bi bi-file-earmark text-muted"></i>; // Default generic file icon
    }
  };
  return (
    <div className="file-selector-container">
      <div
        className="custom-selector fv-row mb-2"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          id={field_name}
          name={field_name}
          ref={fileInputRef}
          style={{ display: "none" }}
          multiple={multiple}
          accept={acceptedFiles}
          onChange={(e) => handleFileSelection(e.target.files)}
        />
        <div className="">
          <i className="ki-outline ki-file-up text-primary fs-3x"></i>
          <br />
          <div className="ms-4">
            <h3 className="fs-5 fw-bold text-gray-900 mb-1">{info_text}</h3>
            <span className="fs-7 fw-semibold text-gray-500">
              Drop files here or click to upload.
            </span>
          </div>
        </div>
      </div>
      {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
      {selectedFiles.length > 0 && (
        <div className="mt-3">
          <h5>Selected Files:</h5>
          {selectedFiles.map((file, index) => (
            <div className="col-md-6 mb-2">
              <div className="d-flex align-items-center border rounded p-2">
                <div className="symbol symbol-40px me-5">
                  <span className="symbol-label">{showIcon(file.type)}</span>
                </div>
                <div className="d-flex align-items-center flex-stack flex-wrap d-grid gap-1 flex-row-fluid">
                  <div className="me-5">
                    <span className="text-gray-500 fw-bold fs-6">
                      {file.name}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-5">
                    <span className="badge bg-warning">
                      {" "}
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                    <button
                      className="btn btn-sm btn-icon btn-secondary"
                      onClick={() => handleRemoveFile(file)}
                    >
                      <i className="ki-outline ki-trash text-danger fs-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomFileSelector;
