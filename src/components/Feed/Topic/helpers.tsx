import gluedin from "gluedin-shorts-js";

export const formatLargeNumber = (count: number) => {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return (count / 1000).toFixed(1) + "K";
  } else {
    return (count / 1000000).toFixed(1) + "M";
  }
};

export const convertKToNumeric = (kValue: any) => {
  if (typeof kValue === "string" && kValue.match(/(\d+(\.\d+)?)(K|M|B)?/)) {
    let match: any = kValue.match(/(\d+(\.\d+)?)(K|M|B)?/);
    let numericValue = parseFloat(match[1]);
    let modifier = match[3];
    if (modifier) {
      if (modifier === "K") {
        numericValue *= 1000;
      } else if (modifier === "M") {
        numericValue *= 1000000;
      } else if (modifier === "B") {
        numericValue *= 1000000000;
      }
    }
    return numericValue;
  }
  return null;
};

export const isLoggedin = async () => {
  const accessToken = await new gluedin.GluedInAuthModule().getAccessToken();
  if (accessToken) return true;
  return false;
};
