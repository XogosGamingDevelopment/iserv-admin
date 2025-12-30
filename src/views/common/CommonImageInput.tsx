import React, { useEffect, useRef, useState } from "react";

interface ImageInputProps {
  fieldName: string;
  onImageChange: (file: File | null) => void;
  defaultImage?: string;
  error?: string;
}

const CommonImageInput: React.FC<ImageInputProps> = ({
  fieldName,
  onImageChange,
  defaultImage,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      onImageChange(selectedFile);
    }
  };

  //Set default Image to preview whenever it changes
  useEffect(() => {
    if (defaultImage) {
      setPreview(defaultImage);
    }
  }, [defaultImage]);

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    onImageChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleCancel = () => {
    if (file) {
      setPreview(preview); // Keep current preview
    }
  };

  useEffect(() => {
    return () => {
      // Revoke preview URL when component unmounts
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="text-center">
      <div
        className={`image-input image-input-outline ${
          !preview ? "image-input-empty" : ""
        }`}
        style={{
          backgroundImage: `url('./assets/media/svg/blank-image.svg')`,
        }}
        data-kt-image-input="true"
      >
        <div
          className={`image-input-wrapper w-150px h-150px ${error ? "is-invalid" : ""}`}
          style={{
            backgroundImage: preview ? `url(${preview})` : undefined,
            backgroundSize: "contain",
            backgroundPosition: 'center',
          }}
        ></div>

        {/* Change Button */}
        <label
          className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
          data-kt-image-input-action="change"
        >
          <i className="ki-outline ki-pencil fs-7"></i>
          <input
            type="file"
            name={fieldName}
            accept=".png, .jpg, .jpeg"
            ref={inputRef}
            onChange={handleFileChange}
            hidden
          />
        </label>
        {error && <div className="invalid-feedback">{error}</div>}
        {/* Cancel Button */}
        <span
          className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
          data-kt-image-input-action="cancel"
          onClick={handleCancel}
        >
          <i className="ki-outline ki-cross fs-2"></i>
        </span>

        {/* Remove Button */}
        <span
          className="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
          data-kt-image-input-action="remove"
          onClick={handleRemove}
        >
          <i className="ki-outline ki-cross fs-2"></i>
        </span>
      </div>
      {/* {error && <div className="invalid-feedback">{error}</div>} */}
    </div>
  );
};

export default CommonImageInput;
