import { getLocalisedText } from "../../Helper/helper";
import LeftArrowIcon from "../../assets/icons/LeftArrowIcon";
import RightArrowIcon from "../../assets/icons/RightArrowIcon";
import { CONTENT_TYPE, TOAST_TYPES } from "../../constants";
import { useLoginModalContext } from "../../contexts/LoginModal";
import { useNotification } from "../../contexts/Notification";
import Report from "../Feed/Report";
import { isLoggedin } from "../Feed/Topic/helpers";
import FollowModal from "../common/FollowModal";
import Loader from "../common/Loader";
import LoaderDark from "../common/LoaderDark/LoaderDark";
import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

function Profile() {
  const defaultLanguage = localStorage.getItem("defaultLanguage");
  const { t } = useTranslation();
  const [userDetail, setUserDetail]: any = useState(null);
  const [userVideos, setUserVideos]: any = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState(false);
  const [followModal, setFollowModal] = useState({ show: false, type: "" });

  const { setShowLoginModal } = useLoginModalContext();
  const { showNotification } = useNotification();

  const navigate = useNavigate();
  const { userId }: any = useParams();

  const toggleReportModal = () => {
    setShowReportModal((state) => !state);
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const userModuleObj = new gluedin.GluedInUserModule();
        const userModuleResponse = await userModuleObj.getUserDetails(userId);
        const userFollowing = await userModuleObj.getUserFollowersStatus(
          userId
        );
        if (userModuleResponse.status === 200) {
          let userInfo = userModuleResponse.data.result;
          // console.log(userInfo);
          setUserDetail(userInfo);
          setIsFollowing(userFollowing?.data?.result?.isFollowing);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [userId]);

  useEffect(() => {
    async function fetchVideos() {
      setIsLoading(true);
      try {
        const userModuleObj = new gluedin.GluedInUserModule();
        var userVideoModuleResponse = await userModuleObj.getUserVideoList({
          userId: userId,
        });
        if (userVideoModuleResponse.status === 200) {
          let videoList = userVideoModuleResponse.data.result;
          // console.log(videoList);
          setUserVideos(videoList);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchVideos();
  }, [userId]);

  if (!userVideos && !userDetail) {
    return <p>{t("label-loading")}...</p>;
  }

  const handleContentDetail = (video: any) => {
    navigate(
      `/content/${userId}?contentType=${CONTENT_TYPE.PROFILE}&clickedVideoId=${video._id}`
    );
  };

  const handleFollowEvent = async (event: any, userId: any) => {
    setIsFollowingLoading(true);
    try {
      const userModuleObj = new gluedin.GluedInUserModule();
      var formData = {
        followingId: userId,
        isFollow: !isFollowing,
      };
      const userModuleResponse = await userModuleObj.followUser(formData);
      if (
        userModuleResponse.status === 201 ||
        userModuleResponse.status === 200
      ) {
        if (formData.isFollow) userDetail.followersCount++;
        else userDetail.followersCount--;
        let followingList: any = localStorage.getItem("following");
        if (followingList) {
          followingList = JSON.parse(followingList);
          followingList.push(userId);
          localStorage.setItem("following", JSON.stringify(followingList));
          setIsFollowing(!isFollowing);
        }
      }
      setIsFollowingLoading(false);
    } catch (error) {
      setIsFollowingLoading(false);
      showNotification({
        title: "Follow/Unfollow",
        subTitle:
          "Something went wrong while following/unfollowing user. Please try again.",
        type: TOAST_TYPES.ERROR,
      });
    }
  };
  const goBack = () => {
    window.history.back();
  };

  if (isLoading) return <Loader />;

  return (
    <div className="full-box profile-full-box userprofile">
      <div className="profile-head-back">
        <div className="back-btn">
          <button type="button" className="back-btn-a" onClick={goBack}>
            {defaultLanguage === "en" ? <LeftArrowIcon /> : <RightArrowIcon />}
            {t("back-btn")}
          </button>
        </div>
        <div className="profile-follow">
          {isFollowing ? (
            <button
              disabled={isFollowingLoading}
              className="follow-profile flex justify-center items-center gap-2 disabled:opacity-50"
              id={`unfollow-${userDetail?.userId}`}
              onClick={(e) => handleFollowEvent(e, userDetail?.userId)}
            >
              {isFollowingLoading && <LoaderDark />}{" "}
              {isFollowingLoading ? "Unfollowing" : t("unfollow-btn")}
            </button>
          ) : (
            <button
              disabled={isFollowingLoading}
              className="follow-profile flex justify-center items-center gap-2 disabled:opacity-50"
              id={`follow-${userDetail?.userId}`}
              onClick={async (e) => {
                handleFollowEvent(e, userDetail?.userId);
                const isUserLoggedIn = await isLoggedin();
                if (isUserLoggedIn) {
                  return true;
                } else {
                  setShowLoginModal(true);
                }
              }}
            >
              {isFollowingLoading && <LoaderDark />}{" "}
              {isFollowingLoading ? "Following" : `${t("follow-btn")} +`}
            </button>
          )}
        </div>
      </div>

      <div className="profile-page-head">
        <ul className="profile-page-head-ul list-none">
          <li className="profile-page-head-avatar">
            <div className="img-sec">
              <img
                src={
                  userDetail?.profileImageUrl || "/gluedin/images/Profile.png"
                }
                id="profileImage"
                alt="profile"
                className="bg-img-02 profileImage"
              />
            </div>
          </li>

          <li className="profile-page-head-content">
            <ul className="profile-page-head-content-inner">
              <li className="profile-page-info">
                <h4 id="displayName">
                  {userDetail?.fullName.length > 10
                    ? getLocalisedText(userDetail, "fullName").substr(0, 10) +
                      ".."
                    : getLocalisedText(userDetail, "fullName")}
                </h4>
                <h5 id="userId">
                  {userDetail?.userName.length > 10
                    ? userDetail?.userName.substr(0, 10) + ".."
                    : userDetail?.userName}
                </h5>
              </li>

              <ul className="profile-page-list">
                <li
                  role="button"
                  onClick={() => {
                    setFollowModal({ show: true, type: "followers" });
                  }}
                >
                  <div className="font-medium">{t("profile-followers")}</div>
                  <span id="followerCount">
                    {userDetail?.followersCount ?? 0}
                  </span>
                </li>

                <li
                  role="button"
                  onClick={() => {
                    setFollowModal({ show: true, type: "following" });
                  }}
                >
                  <div className="font-medium">{t("profile-following")}</div>
                  <span id="followingCount">
                    {userDetail?.followingCount ?? 0}
                  </span>
                </li>
                <li>
                  <button>{t("profile-posts")}</button>
                  <span id="videoCount">{userDetail?.videoCount ?? 0}</span>
                </li>
              </ul>
            </ul>
            <div className="c-text text-blk mt-t-15" id="userDescription">
              {getLocalisedText(userDetail, "description")}
            </div>
          </li>
        </ul>
      </div>
      <FollowModal
        show={followModal.show}
        onHide={() => setFollowModal({ show: false, type: "" })}
        type={followModal.type}
        userData={userDetail}
      />

      <div className="inner-box arrival-box profile-videos">
        <div id="tabs-content">
          <div className="tab-content userVideoData" id="tab1">
            {userVideos.map((video: any) => {
              let thumbnailUrls = video.thumbnailUrls
                ? video.thumbnailUrls[0]
                : video.thumbnailUrl;
              if (video.contentType === "video") {
                return (
                  <div className="box" key={video.videoId}>
                    <div
                      className="img-box open-video-detail"
                      id={video.videoId}
                      style={{
                        background: `url(${thumbnailUrls}) center`,
                        borderRadius: "8px",
                        backgroundSize: "cover",
                      }}
                      onClick={() => handleContentDetail(video)}
                    >
                      <span className="av-icon">
                        <img
                          src="../gluedin/images/folder-icon.svg"
                          alt="folder-icon"
                        />
                      </span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="box">
                    <div
                      className="img-box open-video-detail text-wrapper"
                      style={{
                        background: "#fff",
                        borderRadius: "8px",
                      }}
                      id={video.videoId}
                    >
                      <span className="av-icon">
                        <img src="../gluedin/images/Text.svg" alt="text-icon" />
                      </span>
                      <p>{getLocalisedText(video, "description")}</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
      {showReportModal && (
        <Report
          show={showReportModal}
          onHide={() => toggleReportModal()}
          type="user"
          payloadData={{ userId }}
          handleClose={toggleReportModal}
        />
      )}
    </div>
  );
}

export default Profile;
