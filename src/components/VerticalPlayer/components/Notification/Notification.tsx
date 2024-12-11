import ErrorInfo from "../../../../assets/icons/ErrorInfo";
import InfoIcon from "../../../../assets/icons/InfoIcon";
import { TOAST_TYPES } from "../../../../constants";
import CloseIcon from "../../Icons/Close";
import "./Notification.css";
import React from "react";

export default function ToastNotification({
  show,
  onClose,
  title,
  subTitle,
  type = TOAST_TYPES.INFO,
}: {
  show?: boolean;
  onClose: () => void;
  title?: string;
  subTitle?: string;
  type?: string;
}) {
  const classNames = (() => {
    if (type === TOAST_TYPES.INFO) return "bg-white-100";
    if (type === TOAST_TYPES.ERROR) return "primary-bg-light";
    if (type === TOAST_TYPES.SUCCESS) return "bg-green-100";
  })();

  return (
    <>
      {show ? (
        <div className={`toastContainer`}>
          <div className={`toast-container ${classNames}`}>
            {type === TOAST_TYPES.ERROR ? <ErrorInfo /> : <InfoIcon />}
            <div>
              <button onClick={onClose} className="btn_transparent">
                <CloseIcon />
              </button>
              <div className="toast-header">
                <strong className="me-auto">{title}</strong>
              </div>
              <div className="toast-body">{subTitle}</div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
