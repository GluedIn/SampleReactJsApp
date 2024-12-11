import LoaderDark from "../common/LoaderDark/LoaderDark";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const HeaderSearch = (props: any) => {
  const { t } = useTranslation();
  const {
    redirect,
    searchData,
    searchValue,
    isLoading,
    autoFocus = false,
  }: any = props;
  const navigate = useNavigate();

  const handleInputChange = (event: any) => {
    if (redirect) navigate("/search-filter");
  };

  return (
    <div className="full-box">
      <div className="page-search-box">
        <div className="input-box">
          <input
            type="text"
            name="search"
            value={searchValue}
            onChange={searchData}
            onClick={handleInputChange}
            placeholder={t("search-placeholder") || ""}
            autoFocus={autoFocus}
          />
          {isLoading ? (
            <div className="absolute right-0 top-[50%] translate-y-[-50%] pr-4">
              <LoaderDark />
            </div>
          ) : (
            <img
              src="./gluedin/images/search-icon.svg"
              className="search-info"
              alt=""
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderSearch;
