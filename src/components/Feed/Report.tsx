import { useNotification } from "../../contexts/Notification";
import CustomModal from "../common/CustomModal/CustomModal";
import LoaderDark from "../common/LoaderDark/LoaderDark";
import gluedin from "gluedin-shorts-js";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const feedModuleObj = new gluedin.GluedInFeedModule();

function Report({
  show,
  onHide,
  type,
  payloadData,
  handleClose,
  classes,
}: {
  show: boolean;
  onHide: () => void;
  type: string;
  payloadData: any;
  handleClose: () => void;
  classes?: string;
}) {
  const { t } = useTranslation();
  const [selectedReason, setselectedReason] = useState(null);
  const [reportReasons, setReportReasons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReporting, setIsReporting] = useState(false);

  const { showNotification } = useNotification();

  const handleReasonChange = (e: any) => {
    setselectedReason(e.target.value);
  };

  const handleReport = async () => {
    if (!selectedReason) {
      showNotification({
        title: "Report",
        subTitle: "Please select a reason",
      });
      return;
    }
    setIsReporting(true);
    const userData: any = JSON.parse(localStorage.getItem("userData") || "{}");
    const { userId = "", assetId = "", postId = "" } = payloadData || {};
    const payload = {
      userId: userId,
      actingUserId: userData.userId,
      assetId: assetId,
      reason: selectedReason,
      event: "report",
      type: type,
      postId: postId, // postId will only go when we are reporting a comment
    };
    const response = await feedModuleObj.Report(payload);
    if (response.status === 201) {
      setIsReporting(false);
      onHide();
      showNotification({
        title: "Report",
        subTitle: "Reported submitted successfully",
      });
    }
  };

  async function getReportReasons({ type }: any) {
    try {
      const response = await feedModuleObj.ReportReason();
      setReportReasons(response.data.result[type]);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getReportReasons({ type });
  }, [type]);

  return (
    <CustomModal
      isOpen={show}
      close={handleClose}
      classes={classes}
      //   title={t("post-report")}
      //   subTitle={t("text-PostReport")}
      //   onHide={onHide}
      //   id={type === "user" ? "reportUserModal" : "report-modal"}
      //   customClass={isRtl ? "modal-rtl" : ""}
    >
      <h2 className="modal-title">{t("post-report")}</h2>
      <p className="modal-subtitle">{t("text-PostReport")}</p>
      {isLoading && <LoaderDark />}

      {!isLoading && reportReasons.length === 0 && <p>No Result!</p>}

      {!isLoading &&
        reportReasons.length > 0 &&
        reportReasons.map((reason: any) => {
          return (
            <div key={reason} className="radio-inputfield">
              <label htmlFor={reason.replace(" ", "_")}>{reason}</label>
              <input
                type="radio"
                id={reason.replace(" ", "_")}
                name="report_option"
                value={reason}
                onChange={handleReasonChange}
                style={{ backgroundColor: "red", color: "white" }}
              />
            </div>
          );
        })}

      <div className="bottom-button-group">
        <button className="close" onClick={handleClose}>
          {t("btn-cancel")}
        </button>
        <button
          onClick={handleReport}
          disabled={isReporting}
          className="report flex items-center justify-center gap-2"
        >
          {isReporting && <LoaderDark />} {t("btn-report")}
        </button>
      </div>
    </CustomModal>
  );
}

Report.propTypes = {
  isOpen: PropTypes.bool,
  onHide: PropTypes.func,
  type: PropTypes.string,
  payloadData: PropTypes.object,
  classes: PropTypes.string,
};

export default Report;
