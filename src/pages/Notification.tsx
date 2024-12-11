import React from "react";
import Sidebar from "../components/Layouts/Sidebar";
import Bottom from "../components/Layouts/Bottom";
import NotificationList from "../components/Notification/NotificationList";
import { useTranslation } from "react-i18next";
const Notification = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="full-sec">
        <div className="left-sec">
          <Sidebar />
        </div>
        <div className="right-sec">
          <div className="full-box notification-full-box">
            <div className="heading-header">
              <div className="sub-heading">
                {t("notifications")}
                <span id="notification-count"></span>
              </div>
            </div>
            <div className="notification-box-parent">
              <NotificationList />
            </div>
          </div>
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default Notification;
