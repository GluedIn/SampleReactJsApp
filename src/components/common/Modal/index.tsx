import CustomModal from "../CustomModal/CustomModal";
import PropTypes from "prop-types";
import React from "react";

const CommonModal = ({
  id,
  show,
  onHide,
  title,
  titleProps,
  subTitle,
  children,
  customClass,
}: any) => {
  return (
    <CustomModal isOpen={show} close={onHide}>
      <div className="modal-body">
        {title && (
          <h5 className="topHeading" {...titleProps}>
            <strong>{title}</strong>
          </h5>
        )}
        {subTitle && <p>{subTitle}</p>}
        {children}
      </div>
    </CustomModal>
  );
};

CommonModal.propTypes = {
  id: PropTypes.string,
  show: PropTypes.bool,
  onHide: PropTypes.func,
  children: PropTypes.any,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  titleProps: PropTypes.object,
  customClass: PropTypes.string,
};

export default CommonModal;
