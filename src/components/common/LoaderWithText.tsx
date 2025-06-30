import LoaderDark from "./LoaderDark/LoaderDark";
import React from "react";
import { useTranslation } from "react-i18next";

export default function LoaderWithText({ text, showMargin = true }: any) {
  const { t } = useTranslation();
  return (
    <div
      data-margintop={showMargin}
      className="flex items-center justify-center gap-2 data-[margintop=true]:mt-20"
    >
      <LoaderDark />
      <span>{text ? text : t("label-loading")}...</span>
    </div>
  );
}
