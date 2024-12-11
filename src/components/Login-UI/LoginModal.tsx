import CustomModal from "../common/CustomModal/CustomModal";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const LoginModal = ({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <CustomModal isOpen={show} close={handleClose} classes={"auth-modal"}>
      <h2 className="modal-title">{t("SIGNIN")}</h2>
      <p className="text">{t("login-continue")}</p>
      <Link to="/sign-in" className="btn_primary" onClick={handleClose}>
        {t("SIGNIN")}
      </Link>
    </CustomModal>
  );
};

LoginModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default LoginModal;
