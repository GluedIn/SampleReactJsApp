import LoaderDark from "./LoaderDark/LoaderDark";
import React from "react";
import { useTranslation } from "react-i18next";

export default function LoaderWithText({ text }: any) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center gap-2 mt-20">
      <LoaderDark />
      <span>
        {t("label-loading")} {text}...
      </span>
    </div>
  );
}
