const defaultLanguage = localStorage.getItem("defaultLanguage");
export const getLocalisedText = (obj, defaultKey) => {
  const localisedValue =
    obj?.[
      `localised${defaultKey.charAt(0).toUpperCase()}${defaultKey.slice(1)}`
    ]?.[defaultLanguage];
  return localisedValue || obj?.[defaultKey] || "";
};
