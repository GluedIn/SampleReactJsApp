import CustomModal from "../common/CustomModal/CustomModal";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const DeleteAccountModal = (props: any) => {
  const { t } = useTranslation();
  return (
    <CustomModal
      isOpen={props.show}
      close={props.handleClose}
      classes={"signupmodel"}
    >
      <div className="modal-content text-center">
        <button type="button" className="close" onClick={props.handleClose}>
          &times;
        </button>
        <div className="modal-body">
          <p>{t("text-DeleteText")}</p>
          <div className="bottom-btn">
            <button
              className="btn btn-danger sure-btn"
              onClick={props.confirmDelete}
            >
              {t("text-sure")}
            </button>
            <button
              className="btn btn-secondary cancel-btn"
              style={{ marginLeft: "5px" }}
              onClick={props.handleClose}
            >
              {t("btn-cancel")}
            </button>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteAccountModal;
