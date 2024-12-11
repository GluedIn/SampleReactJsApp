import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./languageDropdown.css";

const LanguageDropdown = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const changeLanguage = (language: any) => {
    i18n.changeLanguage(language);
    localStorage.setItem("defaultLanguage", language);
    setSelectedLanguage(language);
    window.location.reload();
    const targetElement = document.getElementById("direction");
    if (targetElement) {
      targetElement.setAttribute("dir", i18n.dir());
    }
  };
  return (
    <div className="language-dropdown">
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        value={selectedLanguage}
      >
        <option value="en">English</option>
        <option value="ar">Arabic</option>
      </select>
    </div>
  );
};

export default LanguageDropdown;
