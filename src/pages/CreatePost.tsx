import LeftArrowIcon from "../assets/icons/LeftArrowIcon";
import RightArrowIcon from "../assets/icons/RightArrowIcon";
import Bottom from "../components/Layouts/Bottom";
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
      <div className="main_page">
        <div className="main_container">
          <div className="main_header">
            <button onClick={() => navigate("/vertical-player")} className="btn_back">
              {defaultLanguage === "en" ? (
                <LeftArrowIcon />
              ) : (
                <RightArrowIcon />
              )}
              {t("back-btn")}
            </button>
            <h2 className="main_heading">{t("text-createContent")}</h2>
          </div>
          <CreatePost />
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default CreateContent;
