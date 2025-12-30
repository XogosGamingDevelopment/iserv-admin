import React from "react";
type ModalProps = {
  image?: string;
};

const ViewImage: React.FC<ModalProps> = (props) => {
  const { image } = props;
  return (
    <div className="px-4 py-4 d-flex justify-content-center align-items-center">
      <img
        src={image}
        style={{
          width: "624px",
          height: "624px",
          objectFit: "cover",
          borderRadius: "8px",
        }}
        alt="ViewImage"
      />
    </div>
  );
};

export default ViewImage;
