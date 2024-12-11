import CloseIcon from "../../VerticalPlayer/Icons/Close";
import "./CustomModal.css";
import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen?: boolean;
  close?: () => void; // Specify the type of 'close' prop as a function that returns void
  children?: React.ReactNode; // Correct type for children
  classes?: any;
}

const CustomModal: React.FC<ModalProps> = ({
  isOpen,
  close,
  children,
  classes,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Open the modal after a delay of 100 milliseconds
      const timer = setTimeout(() => {
        setModalOpen(true);
      }, 100);
      // Clear the timeout when the component unmounts or when isOpen changes
      return () => clearTimeout(timer);
    } else {
      setModalOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close && close();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [close, modalOpen]);

  if (!isOpen || !close) return null;

  return (
    <>
      <div className="modal-overlay">
        <div
          className={`modal ${isOpen && "open"} ${
            modalOpen && "slidedown"
          } ${classes}`}
        >
          <div className="modal-content">
            <div className="modal-header">
              <button className="close-button" onClick={close}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomModal;
