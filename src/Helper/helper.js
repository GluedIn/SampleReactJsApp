import gluedin from "gluedin-shorts-js";

const defaultLanguage = localStorage.getItem("defaultLanguage");

export const getLocalisedText = (obj, defaultKey) => {
  const localisedValue =
    obj?.[
      `localised${defaultKey.charAt(0).toUpperCase()}${defaultKey.slice(1)}`
    ]?.[defaultLanguage];
  return localisedValue || obj?.[defaultKey] || "";
};

export const isLoggedin = async () => {
  try {
    const accessToken = await new gluedin.GluedInAuthModule().getAccessToken();
    return !!accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    return false;
  }
};

export const formatUserStories = (data, offset) => {
  return data.map((user) => {
    if (user.stories.length > 0) {
      user = {
        userId: user.userId,
        totalStories: user.totalStories,
        fullName: user.stories[0].user.fullName,
        userName: user.stories[0].user.userName,
        profileImageUrl: user.stories[0].user.profileImageUrl,
        stories: user.stories,
        offset: offset
      };
    }
    return user;
  });
};
