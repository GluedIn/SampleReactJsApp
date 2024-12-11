import LeftArrowIcon from "../assets/icons/LeftArrowIcon";
import RightArrowIcon from "../assets/icons/RightArrowIcon";
import Bottom from "../components/Layouts/Bottom";
import Sidebar from "../components/Layouts/Sidebar";
import React from "react";
import { useTranslation } from "react-i18next";

const FeedDetail = () => {
  const defaultLanguage = localStorage.getItem("defaultLanguage");
  const { t } = useTranslation();
  const goBack = () => {
    window.history.back();
  };
  return (
    <>
      <div className="full-sec">
        <div className="left-sec">
          <Sidebar />
        </div>
        <div className="mid-content">
          <div id="vertical-player" className="player_wrapper">
            <div className="profile-head-back">
              <div className="back-btn">
                <button className="back-btn-a" onClick={goBack}>
                  {defaultLanguage === "en" ? (
                    <LeftArrowIcon />
                  ) : (
                    <RightArrowIcon />
                  )}
                  {t("back-btn")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default FeedDetail;
