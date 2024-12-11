import Bottom from "../components/Layouts/Bottom";
import CreateContentSidebar from "../components/Layouts/Sidebar/Content";
import gluedin from "gluedin-shorts-js";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const CreateTextContent = () => {
  const defaultLanguage = localStorage.getItem("defaultLanguage");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [termsChecked, setTermsChecked]: any = useState(false);
  const [errors, setErrors] = useState({
    description: false,
    terms: false,
  });

  const handleOnChange = (event: any) => {
    setValue(event.target.value);
  };

  const handleTermsChange = (event: any) => {
    setTermsChecked(event.target.checked);
    setErrors((state) => ({ ...state, terms: false }));
  };

  const handleCreateTextContent = async (event: any) => {
    event.preventDefault();
    if (!value) {
      setErrors((state) => ({ ...state, description: true }));
      return;
    }

    if (!termsChecked) {
      setErrors((state) => ({ ...state, terms: true }));
      return;
    }

    let formData = {
      description: value,
      contentType: "text",
    };
    const feedModuleObj = new gluedin.GluedInFeedModule();
    const feedModuleResponse = await feedModuleObj.uploadContent(formData);
    if (feedModuleResponse.status === 200) {
      navigate("/");
      setValue("");
    }
  };

  return (
    <>
      <div className="full-sec">
        <div className="left-sec">
          <CreateContentSidebar />
        </div>
        <div className="right-sec text-content-wrapper">
          <div className="full-box">
            <div className="back-header">
              <ul className="list list-inline">
                <li className="back-btn">
                  <a href="/" className="back-btn-a">
                    <img
                      src={
                        defaultLanguage === "en"
                          ? "/gluedin/images/arrow-small-right.svg"
                          : "/gluedin/images/arrow-small-left-g.svg"
                      }
                      alt="back-arrow"
                      width={20}
                      height={20}
                    />
                    {t("back-btn")}
                  </a>
                </li>
                <li className="common-heading">{t("text-createText")}</li>
              </ul>
            </div>
            <div className="main_wrapper">
              <div className="input-grp mt-t-30 term-box">
                <form
                  action="submit"
                  method="POST"
                  id="curation-form"
                  onSubmit={handleCreateTextContent}
                >
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    cols={50}
                    maxLength={500}
                    placeholder={t("placeholder-write-something") || ""}
                    value={value}
                    onChange={handleOnChange}
                  ></textarea>
                  {errors.description && (
                    <label
                      className="error_message text-content-error"
                      id="description_label"
                    >
                      {t("description-required")}
                    </label>
                  )}

                  <div className="word-count">
                    <span id="write-count">{value.length}</span>/
                    <span id="total-count">500</span>
                  </div>

                  <ul className="checkbox_wrapper">
                    <li>
                      <input
                        id="term_cond"
                        type="checkbox"
                        name="term_cond"
                        value={termsChecked}
                        onChange={handleTermsChange}
                      />
                    </li>
                    <li className="sml-text">
                      {t("text-i-agree")} &nbsp;
                      <a
                        href="policy.html"
                        className="terms-link"
                        target="_blank"
                      >
                        {t("text-term")} &amp; {t("text-condition")}
                      </a>
                    </li>
                  </ul>
                  {errors.terms && (
                    <label
                      className="error_message text-content-error"
                      id="checkbox_label"
                    >
                      {t("text-error-select-term-condition")}
                    </label>
                  )}
                  <div className="bottom_btn">
                    <button className="save-draft">
                      {t("text-save-as-draft")}
                    </button>
                    <button
                      className="post-now"
                      onClick={handleCreateTextContent}
                    >
                      {t("post-now-btn")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default CreateTextContent;
