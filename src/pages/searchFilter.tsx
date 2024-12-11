import HashtagRail from "../components/HashtagRail/HashtagRail";
import Bottom from "../components/Layouts/Bottom";
import HeaderSearch from "../components/Layouts/HeaderSearch";
import Sidebar from "../components/Layouts/Sidebar";
import UserRail from "../components/UserRail/UserRail";
import VideoRail from "../components/VideoRail/VideoRail";
import LoaderDark from "../components/common/LoaderDark/LoaderDark";
import LoaderWithText from "../components/common/LoaderWithText";
import { SEARCH_TABS, TOAST_TYPES } from "../constants";
import { useLoginModalContext } from "../contexts/LoginModal";
import { useNotification } from "../contexts/Notification";
import gluedin from "gluedin-shorts-js";
import debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const discoverModule = new gluedin.GluedInDiscover();

const SearchFilter = () => {
  const { t } = useTranslation();
  const { setShowLoginModal } = useLoginModalContext();
  const { showNotification } = useNotification();

  const [activeTab, setActiveTab] = useState(SEARCH_TABS.ALL);
  const [userData, setUserData] = useState(null);
  const [videodata, setVideoData] = useState(null);
  const [hashtagData, setHashtagData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [userDataCheck, setUserDataCheck] = useState(true);
  const [videoDataCheck, setVideoDataCheck] = useState(true);
  const [hagDataCheck, setHagDataCheck] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "All") window.scrollTo(0, 0);
  };

  useEffect(() => {
    fetchSearchResults(searchValue);
  }, [searchValue]);

  const topProfilesPromise = async (searchTerm: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const topProfileData = await discoverModule.getDiscoverTopProfiles({
          search: searchTerm,
        });
        resolve(topProfileData);
      } catch (error) {
        reject(error);
      }
    });
  };

  const allVideosPromise = async (searchTerm: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const allVideos = await discoverModule.getDiscoverAllVideos({
          search: searchTerm,
          limit: 10,
          offset: 1,
        });
        resolve(allVideos);
      } catch (error) {
        reject(error);
      }
    });
  };

  const fetchSearchResults = async (searchKeyword: string) => {
    setIsLoading(true);

    Promise.all([
      topProfilesPromise(searchKeyword),
      allVideosPromise(searchKeyword),
    ])
      .then((response) => {
        const [topProfileData = {}, allVideos = {}]: any = response ?? [];
        const users: any = { railName: "Profiles" };
        console.log("🚀 ~ .then ~ response:", response);
        users.itemList = topProfileData.data.result.map((profile: any) => {
          return { profile };
        });
        if (users.itemList.length === 0) {
          setUserDataCheck(false);
        } else if (users.itemList.length !== 0) {
          setUserDataCheck(true);
        }
        setUserData(users);
        const videos: any = { railName: "Videos" };
        videos.itemList = allVideos.data.result.videos;
        if (videos.itemList.length === 0) {
          setVideoDataCheck(false);
        } else if (videos.itemList.length !== 0) {
          setVideoDataCheck(true);
        }

        setVideoData(videos);
        const hashtags: any = { railName: "Hashtags" };
        hashtags.itemList = allVideos.data.result.hashtags.map(
          (hashtag: any) => {
            return { hashtag };
          }
        );
        if (hashtags.itemList.length === 0) {
          setHagDataCheck(false);
        } else if (hashtags.itemList.length !== 0) {
          setHagDataCheck(true);
        }
        setHashtagData(hashtags);
        setIsLoading(false);
      })
      .catch((error) => {
        showNotification({
          title: "Search",
          subTitle: "Something went wrong",
          type: TOAST_TYPES.ERROR,
        });
        setIsLoading(false);
      });
  };

  const handleOnChange = async (event: any) => {
    const searchKeyword = event.target.value;
    debouncedValue(searchKeyword);
  };

  const debouncedValue = debounce(async (value) => {
    await setSearchValue(value);
  }, 800);

  const loginModalHandler = () => {
    setShowLoginModal(true);
  };

  return (
    <>
      <div className="full-sec">
        <div className="left-sec">
          <Sidebar loginHandler={loginModalHandler} />
        </div>
        <div className="right-sec profile-content-list search-filter">
          <HeaderSearch
            redirect={false}
            searchData={handleOnChange}
            isLoading={isLoading}
            autoFocus
          />
          {isLoading ? (
            <LoaderWithText />
          ) : (
            <>
              <div className="tabs-section">
                <ul id="tabs-nav">
                  <li
                    onClick={() => handleTabClick(SEARCH_TABS.ALL)}
                    className={activeTab === SEARCH_TABS.ALL ? "active" : ""}
                  >
                    <a href="#tab1">{t("search-All")}</a>
                  </li>
                  {userDataCheck && (
                    <li
                      onClick={() => handleTabClick(SEARCH_TABS.PROFILES)}
                      className={
                        activeTab === SEARCH_TABS.PROFILES ? "active" : ""
                      }
                    >
                      <a href="#tab2">{t("search-profile")}</a>
                    </li>
                  )}
                  {hagDataCheck && (
                    <li
                      onClick={() => handleTabClick(SEARCH_TABS.HASHTAGS)}
                      className={
                        activeTab === SEARCH_TABS.HASHTAGS ? "active" : ""
                      }
                    >
                      <a href="#tab3">{t("search-hashtag")}</a>
                    </li>
                  )}
                  {videoDataCheck && (
                    <li
                      onClick={() => handleTabClick(SEARCH_TABS.VIDEOS)}
                      className={
                        activeTab === SEARCH_TABS.VIDEOS ? "active" : ""
                      }
                    >
                      <a href="#tab5">{t("search-video")}</a>
                    </li>
                  )}
                </ul>
              </div>
              <div id="tabs-container">
                {activeTab === SEARCH_TABS.ALL && (
                  <div id="tab1">
                    {userDataCheck && (
                      <UserRail data={userData} isLoading={isLoading} />
                    )}
                    {hagDataCheck && (
                      <HashtagRail data={hashtagData} isLoading={isLoading} />
                    )}
                    {videoDataCheck && (
                      <VideoRail data={videodata} isLoading={isLoading} />
                    )}
                  </div>
                )}
                {activeTab === SEARCH_TABS.PROFILES && (
                  <div id="tab2">
                    <UserRail data={userData} isLoading={isLoading} />
                  </div>
                )}
                {activeTab === SEARCH_TABS.HASHTAGS && (
                  <div id="tab3">
                    <HashtagRail data={hashtagData} isLoading={isLoading} />
                  </div>
                )}
                {activeTab === SEARCH_TABS.VIDEOS && (
                  <div id="tab5">
                    <VideoRail data={videodata} isLoading={isLoading} />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default SearchFilter;
