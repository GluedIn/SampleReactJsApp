import LanguageDropdown from "../common/languageDropdown";
import "./AuthHeader.css";
import React from "react";
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
          <Link to="/" className="logo">
            <img
              src="./gluedin/images/Brand.svg"
              alt="GluedIn"
              width={200}
              height={80}
            />
          </Link>
        </div>

        <div className="sign-ul-parent">
          <ul className="list list-inline sign-ul">
            <li>
              <Link
                to="/sign-in"
                className={isActive === "/sign-in" ? "active" : ""}
              >
                {t("btn-signIn")}
              </Link>
            </li>
            <li>
              <Link
                to="/sign-up"
                className={isActive === "/sign-up" ? "active" : ""}
              >
                {t("btn-signUp")}
              </Link>
            </li>
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
