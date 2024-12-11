import LeftArrowIcon from "../assets/icons/LeftArrowIcon";
import RightArrowIcon from "../assets/icons/RightArrowIcon";
import Hashtag from "../components/HashtagRail/Hashtag";
import Bottom from "../components/Layouts/Bottom";
import Sidebar from "../components/Layouts/Sidebar";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const HashtagDetail = () => {
  const defaultLanguage = localStorage.getItem("defaultLanguage");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { t } = useTranslation();
  const goBack = () => {
    window.history.back();
  };

  const loginModalHandler = () => {
    setShowLoginModal(true);
  };

  return (
    <>
      <div className="full-sec">
        <div className="left-sec">
          <Sidebar loginHandler={loginModalHandler} />
        </div>
        <div className="right-sec profile-content-list hastag-wrapper">
          <div className="back-btn hashtags-details">
            <button className="back-btn-a" onClick={goBack}>
              {defaultLanguage === "en" ? (
                <LeftArrowIcon />
              ) : (
                <RightArrowIcon />
              )}
              {t("back-btn")}
            </button>
          </div>
          <Hashtag />
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default HashtagDetail;
