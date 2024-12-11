import ar from "../languages/ar.json";
import en from "../languages/en.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};
let storedValue = localStorage.getItem("defaultLanguage");
if (!storedValue) {
  localStorage.setItem("defaultLanguage", "en");
  storedValue = "en";
}
i18n.use(initReactI18next).init({ resources, lng: storedValue });
const targetElement = document.getElementById("direction");
if (targetElement) {
  targetElement.setAttribute("dir", i18n.dir());
}
export default i18n;
