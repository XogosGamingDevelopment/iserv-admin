import React, { useEffect } from "react";
import { useModalState } from "../../hooks/useModalState";

const CommonModal: React.FC = () => {
  const { modalContent, handleCloseModal, } = useModalState();

  useEffect(() => {
    const handleEscapeKey = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) handleCloseModal();
    };
    if (modalContent) { // Add event listener when the modal is open
      document?.addEventListener("keydown", handleEscapeKey);

      // Prevent background scroll
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    }

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);

      // Re-enable scroll when modal closes
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    };
  }, [modalContent, handleCloseModal]);

  // handle click on backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // close only if click is directly on backdrop, not inside modal dialog
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  if (!modalContent) return null;

  return (
    <>
      {/* Fullscreen wrapper that listens for clicks */}
      <div
        className="modal fade show"
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        style={{ display: "block" }}
        onClick={handleBackdropClick}
      >
        <div className="modal-dialog modal-dialog-centered mw-650px">
          <div className="modal-content position-relative">
            {/* Close button */}
            <button
              type="button"
              className="btn btn-icon btn-active-color-primary position-absolute"
              style={{ top: "10px", right: "10px", zIndex: 10 }}
              onClick={handleCloseModal}
            >
              ✖
            </button>

            {/* Modal Content */}
            {modalContent}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default CommonModal;
