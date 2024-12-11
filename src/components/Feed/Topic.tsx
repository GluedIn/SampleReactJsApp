import { getLocalisedText } from "../../Helper/helper";
import "../../assets/css/Feed.css";
import { useLoginModalContext } from "../../contexts/LoginModal";
import Comments from "../common/Comments";
import Report from "./Report";
import gluedin from "gluedin-shorts-js";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function FeedTopic({ contentInfo, videoLikedByUser }: any) {
  const { t } = useTranslation();
  const [showShareIcons, setShowShareIcons] = useState(false);
  const [reportPost, setReportPost] = useState(false);
  const [playerIconHtml, setPlayerIconHtml] = useState(
    '<i class="fa fa-play"></i>'
  );
  const [showMore, setShowMore] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({
    url: null,
    isPlaying: false,
    muted: false,
    id: null,
  });
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const { setShowLoginModal } = useLoginModalContext();

  const toggleReportModal = () => {
    setShowReportModal((state) => !state);
  };
  const isLoggedin = async () => {
    const accessToken = await new gluedin.GluedInAuthModule().getAccessToken();
    if (accessToken) {
      return true;
    } else {
      return false;
    }
  };
  const renderFirstContainer = (contentInfo: any) => {
    return (
      <div className="post-box-parent first_div">
        <div className="post-slider-box-parent">
          {contentInfo.contentType === "multi" ? (
            <div className="post-slider-box owl-carousel owl-theme">
              {contentInfo.contentUrls.map((_imageContent: any) => (
                <div key={_imageContent.urls[0]} className="item">
                  <img
                    src={_imageContent.urls}
                    className="full"
                    alt="UserProfileImage"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="post-slider-box-02 video video-player">
              {contentInfo.contentType === "video"
                ? renderVideoElement(contentInfo)
                : ""}
            </div>
          )}
          {renderProducts(contentInfo)}
          {renderBottomPost(contentInfo)}
        </div>
      </div>
    );
  };

  const renderSecondContainer = (contentInfo: any) => {
    let contentDescription = contentInfo.description;
    let isFollowing = false;
    let followingList: any = localStorage.getItem("following");
    if (
      followingList !== undefined &&
      followingList !== null &&
      followingList !== "undefined"
    ) {
      followingList = JSON.parse(followingList);
      if (followingList.includes(contentInfo.user.userId)) {
        isFollowing = true;
      }
    }
    let profilePictureUrl =
      contentInfo?.user?.profileImageUrl ||
      "https://d3ibngdlgwl8mp.cloudfront.net/Profile.png";
    return (
      <div className="post-detail-box-parent second_div">
        <div className="post-detail-box">
          <div className="top-details">
            <ul>
              <li className="img-li">
                <div className="img-holder">
                  <a href={"profile/" + contentInfo.user.userId}>
                    <img src={profilePictureUrl} alt="profile-icon" />
                  </a>
                </div>
              </li>
              <li>
                <h3 className="ft-500">
                  <a href={"profile/" + contentInfo.user.userId}>
                    {getLocalisedText(contentInfo.user, "fullName")}
                  </a>
                </h3>
              </li>
              <li>
                {userData?.userId !== contentInfo?.user?.userId && (
                  <button
                    className={`follow-user follow-user-${contentInfo?.user?.userId}`}
                    id={`follow-${contentInfo?.user?.userId}`}
                    onClick={(e) =>
                      handleFollowEvent(e, contentInfo?.user?.userId)
                    }
                  >
                    {isFollowing ? t("unfollow-btn") : `${t("follow-btn")} +`}
                  </button>
                )}
              </li>
            </ul>
            <div className="sml-text">
              {getLocalisedText(contentInfo, "title")}
            </div>
            <div className="c-text">
              {showMore
                ? contentDescription
                : `${getLocalisedText(contentInfo, "description").substring(
                    0,
                    100
                  )}`}{" "}
              {renderDescription(
                // description(contentInfo)
                getLocalisedText(contentInfo, "description")
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const formatLargeNumber = (count: number) => {
    if (count < 1000) {
      return count.toString();
    } else if (count < 1000000) {
      return (count / 1000).toFixed(1) + "K";
    } else {
      return (count / 1000000).toFixed(1) + "M";
    }
  };
  const convertKToNumeric = (kValue: any) => {
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
    return null; // Return null for invalid input
  };

  const renderProducts = (contentInfoDetails: any) => {
    if (contentInfoDetails.shoppable) {
      return (
        <div className="horizontal_scroller">
          {/* <OwlCarousel
            dots={false}
            items={4}
            autoplay={true}
            responsive={{
              0: {
                items: 2.5,
                nav: false,
              },
              600: {
                items: 2.5,
                nav: false,
              },
              1000: {
                items: 4,
                loop: false,
              },
            }}
            className="list list-inline profile-box-slider owl-carousel owl-theme top-profile-list"
          >
            {contentInfoDetails.products.map((product: any) => {
              return (
                <div key={product.id} className="card-info d-flex">
                  <div className="left_img">
                    <a href={product.shoppableLink}>
                      <img src={product.imageUrl}></img>
                    </a>
                  </div>
                  <div className="right_info">
                    <h6>
                      <a href={product.shoppableLinks}>
                        {getLocalisedText(product, "productName")}
                      </a>
                    </h6>
                    <h5>${product.mrp}</h5>
                    <a className="add_cart" href={product.shoppableLink}>
                      {getLocalisedText(product, "callToAction") || "More Info"}
                    </a>
                  </div>
                </div>
              );
            })}
          </OwlCarousel> */}
        </div>
      );
    }
  };

  const renderVideoElement = (contentInfo: any) => {
    return renderSimpleVideoElement(contentInfo);
  };

  const renderDescription = (description: any) => {
    return (
      <>
        {description.length > 100 && (
          <>
            <a
              href="javascript:void(0)"
              className="text-b show-more-content"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show Less" : "Show More"}
            </a>
          </>
        )}
      </>
    );
  };

  const renderBottomPost = (contentInfoDetails: any) => {
    let websiteUrl = encodeURI("./");
    var usedHashTagTitle = Array.isArray(contentInfoDetails.hashtagTitles)
      ? contentInfoDetails.hashtagTitles.join(",")
      : "";
    let likeByuser =
      videoLikedByUser.indexOf(contentInfoDetails.videoId) > -1
        ? "active likedByUser"
        : "";
    return (
      <>
        <div className="post-slider-box-bottom">
          <div className="strip">
            <ul className="post-slider-box-bottom-ul">
              <li>
                <a
                  href="#"
                  className={`like-video ${likeByuser} like-post-${contentInfoDetails?.videoId}`}
                  data-videoid={contentInfoDetails.videoId}
                  onClick={(e) =>
                    handleLikeEvent(e, contentInfoDetails?.videoId)
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 33.899 30.435"
                  >
                    <path
                      id="Heart"
                      d="M129.908,216.734a8.443,8.443,0,0,0-6.28-2.734,7.9,7.9,0,0,0-4.934,1.7,10.08,10.08,0,0,0-1.995,2.083A10.091,10.091,0,0,0,114.7,215.7a7.9,7.9,0,0,0-4.933-1.7,8.444,8.444,0,0,0-6.281,2.734,9.814,9.814,0,0,0-2.491,6.7,11.687,11.687,0,0,0,3.114,7.65,66.4,66.4,0,0,0,7.8,7.317c1.08.92,2.3,1.964,3.576,3.076a1.843,1.843,0,0,0,2.427,0c1.271-1.111,2.5-2.156,3.577-3.077a66.366,66.366,0,0,0,7.8-7.316,11.686,11.686,0,0,0,3.114-7.65,9.814,9.814,0,0,0-2.491-6.7Zm0,0"
                      transform="translate(-99.75 -212.75)"
                      fill="none"
                      stroke="#777"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <span
                    className={`like-count`}
                    id={`like-count-${contentInfoDetails?.videoId}`}
                  >
                    {" "}
                    {formatLargeNumber(contentInfoDetails.likeCount)}
                  </span>
                </a>
              </li>
              <li>
                <a href="javascript:void(0);">
                  <img src="./gluedin/images/comment.svg" alt="commentIcon" />
                  <span className="comment-count">
                    {formatLargeNumber(contentInfoDetails.commentCount)}
                  </span>
                </a>
              </li>
              <li>
                <a
                  // href={"content/" + contentInfoDetails.videoId}
                  className="social-share-options"
                  onClick={() => setShowShareIcons((prevState) => !prevState)}
                >
                  <img src="./gluedin/images/share.svg" alt="shareIcon" />
                  <span className="share-count">
                    {formatLargeNumber(contentInfoDetails.shareCount)}
                  </span>
                </a>
                {showShareIcons && (
                  <ul className="social-share">
                    <li>
                      <a
                        href={
                          "https://www.facebook.com/sharer.php?u=" + websiteUrl
                        }
                        target="blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fa fa-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${websiteUrl}&text=${contentInfoDetails.description}&hashtags=${usedHashTagTitle}&`}
                        target="blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fa fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${websiteUrl}`}
                        target="blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fa fa-linkedin"></i>
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li className="feed-options float-r" onClick={toggleReportPost}>
                <button className="vert-dots">
                  <img
                    src="/gluedin/images/blue-dot.svg"
                    className="dot-options"
                    alt=""
                  />
                </button>
                {reportPost && (
                  <ul className="dot-suboption">
                    <li onClick={() => toggleReportModal()}>
                      <a
                        href="javascript:void(0);"
                        className="report-button"
                        data-action="video"
                      >
                        <span>
                          <i
                            className="fa fa-exclamation-circle"
                            aria-hidden="true"
                          ></i>
                        </span>
                        {t("report-post")}
                      </a>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
          <Comments contentInfo={contentInfoDetails} />
        </div>
      </>
    );
  };

  const handleVideoPlay = (videoId: string, videoUrl: string) => {
    const videoPlayerId = `videoPlayer_${videoId}`;
    const player: any = document.getElementById(videoPlayerId);
    const videos: any = document.querySelectorAll(".video_00");
    videos.forEach((video: any) => {
      if (video?.id !== videoPlayerId) {
        video.pause();
      }
    });
    if (player.paused) {
      player.play();
      console.log("if-->>");
      // setPlayerIconHtml('<i class="fa fa-play"></i>');
      setIsPlayerActive(true);
      setCurrentVideo((state: any) => ({
        ...state,
        url: videoUrl,
        isPlaying: true,
        id: videoId,
      }));
    } else {
      player.pause();
      console.log("else -->>");
      setIsPlayerActive(false);
      setCurrentVideo((state: any) => ({
        ...state,
        url: videoUrl,
        isPlaying: false,
        id: videoId,
      }));
    }
  };

  const handleVideoAudio = () => {
    setCurrentVideo((state) => ({ ...state, muted: true }));
  };

  const handleLikeEvent = async (e: any, videoId: string) => {
    e.preventDefault();
    let selfTarget = e.currentTarget;
    let likeElement: any = document.getElementById("like-count-" + videoId);
    let videoLikedByMe = selfTarget.classList.contains("active");
    let accessToken = await new gluedin.GluedInAuthModule().getAccessToken();
    if (
      accessToken === "" ||
      accessToken === undefined ||
      accessToken === null
    ) {
      setShowLoginModal(true);
      return;
    }
    const activityTimelineModuleObj =
      await new gluedin.GluedInActivityTimeline();
    if (videoLikedByMe) {
      let userPostedComment =
        await activityTimelineModuleObj.activityTimelineUnLike({
          assetId: videoId,
        });
      if (userPostedComment && userPostedComment.status == 200) {
        selfTarget.classList.remove("active");
        let likeNumber: any = convertKToNumeric(likeElement.innerHTML);
        likeNumber--;
        likeNumber = likeNumber >= 0 ? likeNumber : 0;
        let likeCount = formatLargeNumber(likeNumber);
        likeElement.innerHTML = likeCount;
      }
    } else {
      activityTimelineModuleObj
        .activityTimelineLike({ assetId: videoId })
        .then((response) => {
          if (response && response.status == 200) {
            selfTarget.classList.add("active");
            let likeNumber: any = convertKToNumeric(likeElement.innerHTML);
            likeNumber++;
            let likeCount = formatLargeNumber(likeNumber);
            likeElement.innerHTML = likeCount;
            return;
          }
        });
    }
  };

  const handleFollowEvent = async (event: any, userId: any) => {
    const isUserLoggedIn: any = await isLoggedin();
    if (!isUserLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    let accessToken = new gluedin.GluedInAuthModule().getAccessToken();
    if (
      accessToken === "" ||
      accessToken === undefined ||
      accessToken === null
    ) {
      // open Login Modal
      setShowLoginModal(true);
      return;
    }
    const userModuleObj = new gluedin.GluedInUserModule();
    let followBtnText = event.target.innerText;
    var formData = {
      followingId: userId,
      isFollow: followBtnText == `${t("follow-btn")} +` ? true : false,
    };
    const userModuleResponse = await userModuleObj.followUser(formData);
    if (
      userModuleResponse.status === 201 ||
      userModuleResponse.status === 200
    ) {
      let followingList: any = localStorage.getItem("following");
      if (
        followingList != undefined &&
        followingList != null &&
        followingList != "undefined"
      ) {
        followingList = JSON.parse(followingList);
        let target: any = document.getElementById("follow-" + userId);
        if (target.innerHTML === `${t("follow-btn")} +`) {
          followingList.push(userId);
          localStorage.setItem("following", JSON.stringify(followingList));
          target.innerHTML = `${t("unfollow-btn")}`;
          const followButtons = document.querySelectorAll(
            ".follow-user-" + userId
          );
          followButtons.forEach(function (fb) {
            fb.innerHTML = `${t("unfollow-btn")}`;
          });
        } else {
          const newFollowing = followingList.filter(
            (value: any) => value !== userId
          );
          localStorage.setItem("following", JSON.stringify(newFollowing));
          target.innerHTML = `${t("follow-btn")} +`;
          const followButtons = document.querySelectorAll(
            ".follow-user-" + userId
          );
          followButtons.forEach(function (fb) {
            fb.innerHTML = `${t("follow-btn")} +`;
          });
        }
      }
    }
  };

  const toggleReportPost = async () => {
    const isUserLoggedIn: any = await isLoggedin();
    if (isUserLoggedIn) {
      setReportPost((state) => !state);
    } else {
      setShowLoginModal(true);
    }
  };
  const _onPlay = (event: any) => {
    let assetId: string = event.target.id;
    assetId = assetId.replace("videoPlayer_", "");
    var activityTimelineModuleObj = new gluedin.GluedInActivityTimeline();
    activityTimelineModuleObj
      .activityTimelineView({ assetId: assetId })
      .then((response) => {
        // write your logic here
        console.log("userViewed === ", response);
      });
  };
  const renderSimpleVideoElement = (contentInfo: any) => {
    let playbackUrl = contentInfo.downloadUrl;
    if (contentInfo.contentUrls && contentInfo.contentUrls.length > 0) {
      if (
        contentInfo.contentUrls[0].urls &&
        contentInfo.contentUrls[0].urls?.length > 1
      ) {
        playbackUrl = contentInfo.contentUrls[0].urls[1];
      } else {
        playbackUrl = contentInfo.contentUrls[0].urls[0];
      }
    } else {
      playbackUrl = contentInfo.downloadUrl;
    }
    // setPlayerIconHtml('<i class="fa fa-pause"></i>');
    // let playerIcon = currentVideo.id === contentInfo.videoId ? '' : playerIconHtml;
    return (
      <>
        <video
          className="video_00"
          width="100%"
          poster={contentInfo.thumbnailUrl}
          id={"videoPlayer_" + contentInfo.videoId}
          data-url={playbackUrl}
          muted={currentVideo.muted}
          onPlay={(event) => _onPlay(event)}
        >
          <source src={playbackUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="player-controls">
          <button
            className={`play-button ${isPlayerActive ? "active" : " "}`}
            title="Play"
            onClick={(e) =>
              handleVideoPlay(contentInfo.videoId, contentInfo.downloadUrl)
            }
            dangerouslySetInnerHTML={{
              __html: isPlayerActive ? "" : playerIconHtml,
            }}
          ></button>
          {currentVideo.isPlaying && (
            <>
              <button
                className="unmute-button"
                title="Mute"
                onClick={() => handleVideoAudio()}
              >
                <i className="fa fa-volume-up" aria-hidden="true"></i>
              </button>
              <button
                className="mute-button"
                title="Unmute"
                onClick={() => handleVideoAudio()}
              >
                <i className="fa fa-volume-off" aria-hidden="true"></i>
              </button>
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="full-post-box ordering">
      {renderFirstContainer(contentInfo)}
      {renderSecondContainer(contentInfo)}
      {showReportModal && (
        <Report
          show={showReportModal}
          onHide={() => toggleReportModal()}
          type="video"
          payloadData={{
            assetId: contentInfo.videoId,
            userId: contentInfo.userId,
          }}
          handleClose={toggleReportModal}
        />
      )}
    </div>
  );
}

FeedTopic.propTypes = {
  contentInfo: PropTypes.object,
  videoLikedByUser: PropTypes.array,
};

export default FeedTopic;
