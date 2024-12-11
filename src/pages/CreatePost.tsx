import LeftArrowIcon from "../assets/icons/LeftArrowIcon";
import RightArrowIcon from "../assets/icons/RightArrowIcon";
import Bottom from "../components/Layouts/Bottom";
import CreateContentSidebar from "../components/Layouts/Sidebar/Content";
import CreatePost from "../components/Post/CreatePost";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CreateContent = () => {
  const defaultLanguage = localStorage.getItem("defaultLanguage");
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <div className="full-sec">
        <div className="left-sec">
          <CreateContentSidebar />
        </div>
        <div className="right-sec creat-right-sec">
          <div className="full-box create-full-box">
            <div className="back-header">
              <ul className="list">
                <li className="back-btn">
                  <a
                    href="javascript:void(0)"
                    className="back-btn-a"
                    onClick={() => navigate("/vertical-player")}
                  >
                    {defaultLanguage == "en" ? (
                      <LeftArrowIcon />
                    ) : (
                      <RightArrowIcon />
                    )}
                    {t("back-btn")}
                  </a>
                </li>
                <li className="common-heading">{t("text-createContent")}</li>
              </ul>
            </div>
            <CreatePost />
          </div>
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default CreateContent;
