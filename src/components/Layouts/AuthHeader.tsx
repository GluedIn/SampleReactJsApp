import LanguageDropdown from "../common/languageDropdown";
import "./AuthHeader.css";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const AuthHeader = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isActive = location.pathname;
  return (
    <header>
      <div className="container-flex">
        <div className="logo-sec">
          <a href="/" className="logo">
            <img
              src="https://dev-console.gluedin.io/assets/img/brand_logo.svg"
              alt="GluedIn"
              width={200}
              height={80}
            />
          </a>
        </div>

        <div className="sign-ul-parent">
          <ul className="list list-inline sign-ul">
            <li>
              <a
                href="sign-in"
                className={isActive == "/sign-in" ? "active" : ""}
              >
                {t("btn-signIn")}
              </a>
            </li>
            {/* <li>
              <a
                href="sign-up"
                className={isActive == "/sign-up" ? "active" : ""}
              >
                {t("btn-signUp")}
              </a>
            </li> */}
            <li>
              <LanguageDropdown />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default AuthHeader;
