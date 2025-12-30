import React, { createContext, useContext, useState } from "react";

type ModalContextType = {
  modalContent: React.ReactNode;
  handleOpenModal: (component: React.ReactNode) => void;
  handleCloseModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const handleOpenModal = (component: React.ReactNode) => {
    setModalContent(component);
  };

  const handleCloseModal = () => {
    setModalContent(null);
  };
  
  const modalContext:ModalContextType={
    modalContent:modalContent,
    handleOpenModal:handleOpenModal,
    handleCloseModal:handleCloseModal
  }
  return (
    <ModalContext.Provider value={{...modalContext}}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalState = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalState must be used within a ModalProvider");
  }
  return context;
};
