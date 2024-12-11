import { EVENTS } from "../constants";
import gluedin from "gluedin-shorts-js";
import { deviceDetect } from "react-device-detect";

const userAgent = navigator.userAgent;

async function getUserFollowing(userId: string) {
  try {
    const userModule = new gluedin.GluedInUserModule();
    const {
      status,
      data: { result: followingData },
    } = await userModule.getUserFollowersStatus(userId);
    if (status === 200) {
      return followingData;
    }
  } catch (error) {
    console.error(error);
  }
}

async function getCategoriesData() {
  try {
    const feedModule = new gluedin.GluedInFeedModule();
    let {
      status,
      data: { result: categories },
    } = await feedModule.getCategoryList({
      search: "",
      limit: 100,
      offset: 1,
    });
    if (status === 200) {
      return categories;
    }
  } catch (error) {
    console.error(error);
  }
}

function getDeviceId() {
  const deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    const uniqueID = crypto.randomUUID();
    localStorage.setItem("deviceId", uniqueID);
    return uniqueID;
  } else {
    return deviceId;
  }
}

function getDeviceData() {
  const deviceDetectData = deviceDetect(userAgent);
  const { isBrowser, browserName } = deviceDetectData ?? {};
  const deviceId = getDeviceId();

  return {
    device_ID: deviceId,
    platform_name: isBrowser ? browserName : "Unknown",
  };
}

function getUserData() {
  const userData = JSON.parse(localStorage.getItem("userData")!);
  const { fullName, userId, email } = userData ?? {};

  return {
    user_email: email,
    user_ID: userId,
    user_name: fullName,
  };
}

function getPageData() {
  const getTabName = () => {
    const pathname = window.location.pathname;
    const tabs: Record<string, string> = {
      "/": "Home Feed",
      "/vertical-player": "Home Feed",
      "/discover": "Discover",
      "/challenge": "Challenge",
      "/hashtag": "Hashtag",
      "/creator": "Creator",
    };
    return tabs[pathname] || "Unknown";
  };

  const getPageName = () => {
    const pathname = window.location.pathname;
    const pages: Record<string, string> = {
      "/": "Home",
      "/vertical-player": "Home",
      "/discover": "Discover",
      "/challenge": "Challenge",
      "/hashtag": "Hashtag Detail",
      "/content": "Content Detail",
    };
    return pages[pathname] || "Unknown";
  };

  return {
    tab_name: getTabName(),
    page_name: getPageName(),
  };
}

async function getEventPayload(data: any) {
  const { event, content } = data ?? {};
  const {
    videoId: contentId,
    user: creator,
    hashtags,
    contentType,
    categoryId,
  } = content ?? {};
  const {
    userId: creatorUserId,
    userName: creatorUserName,
    followersCount,
  } = creator ?? {};

  let payload = {
    eventName: event,
    ...getDeviceData(),
    ...getUserData(),
    ...getPageData(),
    ...(contentId && { content_id: contentId }),
  };

  const categories = await getCategoriesData();
  const categoryData = categories.find(
    (category: any) => category.categoryId === categoryId
  );
  const { categoryName = "" } = categoryData ?? {};

  switch (event) {
    case EVENTS.VIEW_IMPRESSION:
      payload = {
        ...payload,
        content_type: contentType,
        creator_userid: creatorUserId,
        creator_username: creatorUserName,
        hashtag: hashtags,
      };
      break;

    case EVENTS.CONTENT_STOP_PLAY:
      payload = {
        ...payload,
        content_played_duration: content.timeElapsed,
      };
      break;

    case EVENTS.CONTENT_LIKE:
    case EVENTS.CONTENT_UNLIKE:
      const { isFollowing: followingCount } = await getUserFollowing(
        creatorUserId
      );
      payload = {
        ...payload,
        button_type: "NA",
        content_type: contentType,
        creator_userid: creatorUserId,
        creator_username: creatorUserName,
        failure_reason: "NA",
        hashtag: hashtags,
        success: true,
        user_follower_count: followersCount,
        user_following_count: followingCount,
        user_isFollow: content.isFollow,
      };
      break;

    case EVENTS.CONTENT_SHARE:
      payload = {
        ...payload,
        content_type: contentType,
        content_genre: categoryName,
        creator_userid: creatorUserId,
        creator_username: creatorUserName,
        hashtag: hashtags,
      };
      break;

    case EVENTS.THUMBNAIL_CLICK:
      payload = {
        ...payload,
        content_type: contentType,
        content_genre: categoryName,
        vertical_index: content.verticalIndex,
        horizontal_index: content.horizontalIndex,
      };
      break;

    default:
      break;
  }

  return payload;
}

export default function useAnalytics() {
  const trackEvent = async (data: any) => {
    // try {
    //   const userModule = new gluedin.GluedInActivityTimeline();
    //   const eventData = await getEventPayload(data);
    //   let event = await userModule.activityTimelineAnalytics(eventData);
    //   if (event.status === 200) {
    //     console.log("Event tracked successfully");
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  };
  return { trackEvent };
}
