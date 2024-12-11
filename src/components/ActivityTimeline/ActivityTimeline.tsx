import { getLocalisedText } from "../../Helper/helper";
import LeftArrowIcon from "../../assets/icons/LeftArrowIcon";
import RightArrowIcon from "../../assets/icons/RightArrowIcon";
import { CONTENT_TYPE } from "../../constants";
import Loader from "../common/Loader";
import LoaderWithText from "../common/LoaderWithText";
import gluedin from "gluedin-shorts-js";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

function ActivityTimeline() {
  const language = localStorage.getItem("defaultLanguage");
  const { t } = useTranslation();
  const [timelineDetails, setTimelineDetails]: any = useState(null);
  const [currentTabData, setCurrentTabData] = useState([]);
  const [isLoading, setIsLoading] = useState({ tab: false, page: false });
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get("tab") || "like";

  useEffect(() => {
    fetchTabData(tab);
  }, [tab]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleContentDetail = (contentInfo: any) => {
    navigate(
      `/content/${contentInfo?.metakeys?.videoId}?contentType=${CONTENT_TYPE.VIDEO}`
    );
  };

  const handleClickOnTab = (tab: any) => {
    navigate(location.pathname + "?" + queryString.stringify({ tab }));
  };

  async function fetchVideos() {
    setIsLoading({ page: true, tab: false });
    try {
      const activityTimelineModuleObj = new gluedin.GluedInActivityTimeline();
      const activityTimelineList =
        await activityTimelineModuleObj.getActivityTimelineUserDetails({
          event: "post",
          limit: 10,
          offset: 1,
        });
      if (activityTimelineList.status === 200) {
        const activityTimelineInfo = activityTimelineList.data.result;
        setTimelineDetails(activityTimelineInfo);
      }
      setIsLoading({ page: false, tab: false });
    } catch (error) {
      setIsLoading({ page: false, tab: false });
      console.error(error);
    }
  }

  async function fetchTabData(tab: any) {
    setIsLoading({ tab: true, page: false });
    try {
      var limit = 10;
      var offset = 1;
      var activityTimelineModuleObj = new gluedin.GluedInActivityTimeline();
      var activityTimelineVideoList =
        await activityTimelineModuleObj.getActivityTimelineList({
          event: tab,
          limit: limit,
          offset: offset,
        });
      if (activityTimelineVideoList.data.statusCode === 2001) {
        let videos = activityTimelineVideoList.data.result;
        setCurrentTabData(videos);
      }
      setIsLoading({ tab: false, page: false });
    } catch (error) {
      setIsLoading({ tab: false, page: false });
      console.error(error);
    }
  }

  if (isLoading.page) return <Loader />;

  return (
    <div className="full-box profile-full-box">
      <div className="profile-page-header">
        <a href="./my-profile" className="back-btn-a">
          {language === "en" ? <LeftArrowIcon /> : <RightArrowIcon />}
          {t("back-btn")}
        </a>
        <h5>{t("text-timeline")}</h5>
      </div>

      <div className="profile-page-head">
        <ul className="profile-page-head-ul list-none">
          <li className="profile-page-head-avatar">
            <div className="img-sec">
              <img
                src={
                  timelineDetails?.profileImageUrl ||
                  "/gluedin/images/Profile.png"
                }
                id="profileImage"
                className="bg-img-02 profileImage"
                alt="ProfileImage"
              />
            </div>
          </li>

          <li className="profile-page-head-content">
            <ul className="profile-page-head-content-inner">
              <li className="profile-page-info">
                <h4 id="displayName">
                  {getLocalisedText(timelineDetails, "fullName")}
                </h4>
                <h5 id="userId">{timelineDetails?.userName}</h5>
                <div className="desk-none">
                  <a href="#" className="res-edit">
                    {t("btn-edit")}
                  </a>
                </div>
              </li>

              <ul className="profile-page-list">
                <li
                  className={tab === "like" ? "active" : ""}
                  onClick={() => handleClickOnTab("like")}
                >
                  <h5>{t("profile-liked")}</h5>
                  <span id="likedCount">{timelineDetails?.likeCount}</span>
                </li>

                <li
                  className={tab === "comment" ? "active" : ""}
                  onClick={() => handleClickOnTab("comment")}
                >
                  <h5>{t("profile-comment")}</h5>
                  <span id="commentCount">{timelineDetails?.commentCount}</span>
                </li>

                <li
                  className={tab === "share" ? "active" : ""}
                  onClick={() => handleClickOnTab("share")}
                >
                  <h5>{t("profile-shared")}</h5>
                  <span id="sharedCount">
                    {timelineDetails?.shareCount ?? 0}
                  </span>
                </li>
                <li className="report-user-button" style={{ display: "none" }}>
                  <button
                    className="report"
                    id="report-user"
                    data-action="user"
                  >
                    {t("btn-report")}
                  </button>
                </li>
              </ul>
            </ul>
            <div className="modal fade" id="reportUserModel" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content text-center">
                  <div className="modal-body">
                    <h5>
                      <strong>{t("post-report")}</strong>
                    </h5>
                    <p>{t("text-PostReport")}</p>
                    <div className="reason-wrpr">
                      <form action="" method="post" id="report-user-form">
                        <div id="report-user-content"></div>
                        <button className="submit-btn btn">
                          {t("btn-submit")}
                        </button>
                        <button className="cancel-btn btn">
                          {t("btn-cancel")}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      {isLoading.tab ? (
        <LoaderWithText center={false} />
      ) : (
        <div className="inner-box arrival-box profile-videos">
          <div className="tab-content userVideoData" id="tab1">
            {currentTabData.length ? (
              currentTabData.map((video: any, index) => {
                let thumbnailUrls = video.metakeys.thumbnailUrls
                  ? video.metakeys.thumbnailUrls[0]
                  : video.metakeys.thumbnailUrl;
                return (
                  <div className="box" key={index}>
                    <div
                      className="img-box open-video-detail"
                      id={video.metakeys.videoId}
                      style={{
                        background: `url(${thumbnailUrls}) center`,
                        borderRadius: "8px",
                        backgroundSize: "cover",
                      }}
                      onClick={() => handleContentDetail(video)}
                    >
                      <span className="av-icon">
                        <img src="/gluedin/images/folder-icon.svg" />
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <h3>{t("text-noData")}</h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityTimeline;
