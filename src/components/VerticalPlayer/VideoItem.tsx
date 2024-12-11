import PauseIcon from "../../assets/icons/PauseIcon";
import PlayIcon from "../../assets/icons/PlayIcon";
import SoundWave from "../../assets/icons/SoundWave";
import { CONTENT_TYPE, EVENTS } from "../../constants";
import { useLoginModalContext } from "../../contexts/LoginModal";
import useAnalytics from "../../hooks/useAnalytics";
import useElementOnScreen from "../../hooks/useElementOnScreen";
import useLikedVideo from "../../hooks/useLikedVideo";
import useSound from "../../hooks/useSound";
import Report from "../Feed/Report";
import CustomModal from "../common/CustomModal/CustomModal";
import LoaderDark from "../common/LoaderDark/LoaderDark";
import CommentIcon from "./Icons/Comment";
import ShopIcon from "./Icons/DisLike";
import LikeIcon from "./Icons/Like";
import Mute from "./Icons/Mute";
import OptionsIcon from "./Icons/Options";
import ReportIcon from "./Icons/Report";
import RepostIcon from "./Icons/RepostIcon";
import ShareIcon from "./Icons/Share";
import UnLikeIcon from "./Icons/UnLike";
import Unmute from "./Icons/Unmute";
import Comments from "./components/Comments";
import VerticalPlayerProducts from "./components/Products";
import RepostModal from "./components/Repost/Modal";
import Share from "./components/Share";
import {
  convertKToNumeric,
  formatLargeNumber,
  parseDescription,
} from "./helpers";
import { Menu, Transition } from "@headlessui/react";
import gluedin from "gluedin-shorts-js";
import Hls from "hls.js";
import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  Fragment,
} from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

const activityTimelineModule = new gluedin.GluedInActivityTimeline();
const authModule = new gluedin.GluedInAuthModule();
const userModule = new gluedin.GluedInUserModule();

const PlayPauseButtons = ({
  className,
  handlePlayAndPause,
  isPlaying,
  showControls,
}: any) => (
  <button
    className={className}
    onClick={handlePlayAndPause}
    style={{
      opacity: showControls || !isPlaying ? 1 : 0,
    }}
  >
    {isPlaying ? <PlayIcon /> : <PauseIcon />}
  </button>
);

const VideoItem = forwardRef(
  ({ video, setVideos, setCurrentVideoIndex, allVideoRefs }: any, ref: any) => {
    const {
      indexNo,
      id,
      url,
      playing: isPlaying,
      muted: isMuted,
      thumbnailUrl,
      user,
      title,
      description = "",
      taggedUsers,
      commentCount,
      likeCount,
      shareCount,
      products = [],
      repost = false,
      repostCount,
      soundId,
      soundThumbnail,
      soundName,
      videoId,
    } = video;
    const { userId, fullName, profileImageUrl } = user ?? {};
    const [showControls, setShowControls] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLikingVideo, setIsLikingVideo] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showCommentReportModal, setShowCommentReportModal] = useState(false);
    const [showLike, setShowLike] = useState(false);
    const [showRepost, setShowRepost] = useState(false);
    const [commentPostId, setCommentPostId] = useState("");
    const [videoCommentCount, setVideoCommentCount] = useState(commentCount);

    const { t } = useTranslation();
    // const [showHighlightedComment, setShowHighlightedComment] = useState(false);
    const hls = useRef<Hls>();

    const { setShowLoginModal } = useLoginModalContext();
    const navigate = useNavigate();
    const { trackEvent } = useAnalytics();
    const parsedDescription = parseDescription(description, taggedUsers);
    const [showVideoError, setShowVideoError] = useState(false);

    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const videoRef = ref;
    const videoControls = useRef<HTMLDivElement>(null);
    const options = {
      root: document.getElementsByClassName("player_wrapper")[0],
      rootMargin: "0px",
      threshold: 0.5,
    };
    const [videoErrorMessage, setVideoErrorMessage] = useState("");

    // const { sound = {} } = useSound(soundId);

    const isVisible = useElementOnScreen(options, videoRef);

    const {
      isVideoLiked,
      isLoading: isCheckingForLikedVideo,
      setIsVideoLiked,
    } = useLikedVideo(videoId);

    const updateVideos = (type: string, status: boolean) => {
      setVideos((videos: any) => {
        const newVideos = videos.map((video: any) => {
          if (video.id === id) {
            video[type] = status;
          }
          return video;
        });
        return newVideos;
      });
    };

    const showErrorPopup = (message: any) => {
      setVideoErrorMessage(message);
      setShowVideoError(true);
    };

    useEffect(() => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      // Check file extension to determine video type
      const fileExtension = url?.split(".").pop()?.toLowerCase();

      if (fileExtension === "m3u8") {
        // HLS video

        if (Hls.isSupported()) {
          // Initialize HLS.js
          hls.current = new Hls();
          hls.current.loadSource(url);
          hls.current.attachMedia(videoElement);

          hls.current.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.error(
                    "Network error. Please check your internet connection."
                  );
                  showErrorPopup(
                    "Network error. Please check your internet connection."
                  );
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.error("Media error. Unable to play the video.");
                  showErrorPopup("Media error. Unable to play the video.");
                  break;
                default:
                  console.error("An unknown error occurred.");
                  showErrorPopup("An unknown error occurred.");
                  break;
              }
            }
          });
        } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
          videoElement.src = url;
          videoElement.addEventListener("error", () => {
            console.error("An error occurred while playing the video.");
            showErrorPopup("An error occurred while playing the video.");
          });
        } else {
          console.error("HLS is not supported in this browser.");
          showErrorPopup("HLS is not supported in this browser.");
        }
      } else if (["mp4", "mov", "m4v"].includes(fileExtension)) {
        // MP4 video
        videoElement.src = url;
      } else {
        console.error("Unsupported video format.");
      }

      // Cleanup
      return () => {
        if (hls.current) {
          hls.current.destroy();
        }
      };
    }, [url, videoRef]);

    const toggleReportModal = () => {
      setShowReportModal((prev) => !prev);
    };

    const toggleCommentReportModal = () => {
      setShowCommentReportModal((prev) => !prev);
    };

    useEffect(() => {
      if (Object.keys(userData).length !== 0) {
        let followingList: any = localStorage.getItem("following");
        if (followingList) {
          followingList = JSON.parse(followingList);
          if (followingList.includes(userId)) {
            setIsFollowing(true);
          } else {
            setIsFollowing(false);
          }
        }
      }
      if (videoRef.current) {
        if (isVisible) {
          setCurrentVideoIndex(indexNo);
          videoRef.current?.play().catch((error: any) => {
            // Handle error
            console.error("Autoplay error:", error);
          });
          updateVideos("playing", true);
        } else {
          videoRef.current?.pause();
          updateVideos("playing", false);
        }
      }
    }, [isVisible]);

    const isLoggedin = async () => {
      const accessToken =
        await new gluedin.GluedInAuthModule().getAccessToken();
      if (accessToken) {
        return true;
      } else {
        return false;
      }
    };

    const handlePlayAndPause = () => {
      const allVideos = document.getElementsByClassName("video_player");
      if (allVideos.length > 0) {
        const allVideoElements = Array.from(allVideos);
        allVideoElements.forEach((video: any) => {
          if (video.id !== videoRef.current?.id) {
            video.pause();
            setVideos((videos: any) => {
              const newVideos = videos.map((video: any) => {
                if (video.id !== videoRef.current?.id) {
                  video.playing = false;
                }
                return video;
              });
              return newVideos;
            });
          }
        });
      }
      if (videoRef.current?.paused) {
        videoRef.current?.play().catch((error: any) => {
          console.error("Autoplay error:", error);
        });
        updateVideos("playing", true);
        trackEvent({
          event: EVENTS.CONTENT_PLAY,
          content: video,
        });
      } else {
        videoRef.current?.pause();
        updateVideos("playing", false);
        trackEvent({
          event: EVENTS.CONTENT_STOP_PLAY,
          content: {
            ...video,
            timeElapsed: Math.floor(videoRef.current?.currentTime),
          },
        });
      }
    };

    const handleMuteUnmute = () => {
      if (videoRef?.current) {
        if (isMuted) {
          videoRef.current.muted = false;
          updateVideos("muted", false);
        } else {
          videoRef.current.muted = true;
          updateVideos("muted", true);
        }
      }
    };

    const handleMouseOver = () => {
      setShowControls(true);
    };

    const handleMouseOut = () => {
      setShowControls(false);
    };

    const handleFollowEvent = async (
      event: any,
      userId: any,
      followStatus: boolean
    ) => {
      try {
        const isUserLoggedIn: any = await isLoggedin();
        if (!isUserLoggedIn) {
          setShowLoginModal(true);
          return;
        }
        let accessToken = await authModule.getAccessToken();
        if (
          accessToken === "" ||
          accessToken === undefined ||
          accessToken === null
        ) {
          // open Login Modal
          setShowLoginModal(true);
          return;
        }
        let followingList: any = localStorage.getItem("following");
        followingList = JSON.parse(followingList);
        var formData = {
          followingId: userId,
          isFollow: followStatus,
        };
        userModule.followUser(formData);
        if (followStatus) {
          followingList.push(userId);
          localStorage.setItem("following", JSON.stringify(followingList));
          setIsFollowing(true);
        } else {
          const newFollowing = followingList.filter((id: any) => id !== userId);
          localStorage.setItem("following", JSON.stringify(newFollowing));
          setIsFollowing(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleLikeEvent = async (e: any, videoId: string) => {
      e.preventDefault();
      setIsLikingVideo(true);
      let selfTarget = e.currentTarget;
      let likeElement: any = document.getElementById("like-count-" + videoId);
      const videoLikedByMe = selfTarget.classList.contains("active");
      const isUserLoggedIn = await isLoggedin();
      if (!isUserLoggedIn) {
        setShowLoginModal(true);
        setIsLikingVideo(false);
        return;
      }
      if (isVideoLiked) {
        const userPostedComment =
          await activityTimelineModule.activityTimelineUnLike({
            assetId: videoId,
          });
        const { status } = userPostedComment ?? {};
        if (status === 200) {
          trackEvent({
            event: EVENTS.CONTENT_UNLIKE,
            content: video,
          });
          selfTarget.classList.remove("active");
          let likeNumber: any = convertKToNumeric(likeElement.innerHTML);
          likeNumber--;
          likeNumber = likeNumber >= 0 ? likeNumber : 0;
          const likeCount = formatLargeNumber(likeNumber);
          likeElement.innerHTML = likeCount;
          setIsVideoLiked(false);
          setIsLikingVideo(false);
        }
      } else {
        activityTimelineModule
          .activityTimelineLike({ assetId: videoId })
          .then((response: any) => {
            const { status } = response ?? {};
            if (status === 200) {
              trackEvent({
                event: EVENTS.CONTENT_LIKE,
                content: video,
              });
              selfTarget.classList.add("active");
              let likeNumber: any = convertKToNumeric(likeElement.innerHTML);
              likeNumber++;
              let likeCount = formatLargeNumber(likeNumber);
              likeElement.innerHTML = likeCount;
              setIsVideoLiked(true);
              setIsLikingVideo(false);
            }
          });
      }
    };

    const toggleRepostModal = () => {
      setShowRepost((prev) => !prev);
    };
    const reDirectToOriginalVideo = () => {
      trackEvent({
        event: EVENTS.VIEW_IMPRESSION,
        content: video,
      });
      navigate(
        // `/content/${video.videoId}`
        `/content/${video.user.userId}?contentType=${CONTENT_TYPE.PROFILE}&clickedVideoId=${video.originalVideoId}`
      );
    };

    const handleClickOnSound = () => {
      navigate(`/sound-track/${soundId}`);
    };

    // Convert array to string if parsedDescription is an array
    const videoDescription = Array.isArray(parsedDescription)
      ? parsedDescription.join(" ") // Join array elements into a single string with spaces
      : typeof parsedDescription === "string"
      ? parsedDescription
      : "";

    return (
      <>
        <div className="player_item_wrapper">
          <div
            id={`content-video-${video._id}`}
            className="player_item"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <video
              id={`video_player_${id}`}
              ref={videoRef}
              className="video_player"
              src={url}
              poster={thumbnailUrl}
              controls={false}
              muted={isMuted}
              preload="metadata"
              playsInline
              autoPlay={isPlaying}
              loop
            >
              <source src={`${url}#t=0.5`} type="video/mp4" />
            </video>

            <PlayPauseButtons
              className="play_button"
              handlePlayAndPause={handlePlayAndPause}
              isPlaying={isPlaying}
              showControls={showControls}
            />

            <div
              className="video_controls"
              style={{
                opacity: showControls || !isPlaying ? 1 : 0,
              }}
              ref={videoControls}
            >
              <PlayPauseButtons
                className="play_pause_button"
                handlePlayAndPause={handlePlayAndPause}
                isPlaying={isPlaying}
                showControls={showControls}
              />
              <button className="mute_unmute_button" onClick={handleMuteUnmute}>
                {isMuted ? <Mute /> : <Unmute />}
              </button>
            </div>

            <div className="user_info">
              {repost && (
                <div className="repost_text">
                  <button onClick={reDirectToOriginalVideo}>
                    <span>
                      <RepostIcon />
                    </span>
                    Reposted
                    <span className="dash">-</span>
                    Original Video
                  </button>
                </div>
              )}
              <div className={`top_info ${showComments ? "pr_6" : ""}`}>
                <a href={`/profile/${userId}`}>
                  <div className="img_name">
                    <img
                      src={
                        profileImageUrl
                          ? profileImageUrl
                          : "/gluedin/images/Profile.png"
                      }
                      alt={`${fullName} profile pic`}
                    />
                    <h6 className="user_name">{fullName}</h6>
                  </div>
                </a>
                {userData?.userId !== userId && !isFollowing && (
                  <button
                    className="follow_btn"
                    onClick={() => handleFollowEvent(video, user.userId, true)}
                  >
                    <i className="fa fa-plus"></i>
                    {t("follow-btn")}
                  </button>
                )}
                {userData?.userId !== userId && isFollowing && (
                  <button
                    className="follow_btn"
                    onClick={() => handleFollowEvent(video, user.userId, false)}
                  >
                    {t("unfollow-btn")}
                  </button>
                )}
              </div>

              <div className={`post_desc ${showComments ? "pr_6" : ""}`}>
                <h5 className="title">{title}</h5>
                <p className="desc">
                  {/* {showMore
                    ? description
                    : description.substring(0, 100)} */}
                  {/* {Array.isArray(parsedDescription)
                    ? (parsedDescription as any).map((item: any) => item)
                    : parsedDescription} */}
                  {/* {description?.length > 100 && (
                    <button
                      className="text-b show-more-content"
                      onClick={() => setShowMore((prev) => !prev)}
                    >
                      {" "}
                      {showMore ? "Show Less" : "Show More"}
                    </button>
                  )} */}
                  {/* <br /> */}
                  {Array.isArray(parsedDescription) ? (
                    parsedDescription.map((item, index) => item)
                  ) : (
                    <div>
                      {typeof videoDescription === "string" && (
                        <>
                          {showMore
                            ? videoDescription
                            : videoDescription.substring(0, 100)}
                          {videoDescription.length > 100 && (
                            <button
                              className="text-b show-more-content"
                              onClick={() => setShowMore((prev) => !prev)}
                            >
                              {showMore ? "Show Less" : "Show More"}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </p>
              </div>
              {products?.length > 0 && (
                <VerticalPlayerProducts show={true} products={products || []} />
              )}
            </div>
            <div
              className={`post_icons ${
                products?.length > 0 && "post_icons_responsive"
              } ${
                showComments
                  ? `post_active post_icon_rtl ${
                      products?.length > 0 && "icons-transform"
                    }`
                  : ""
              }`}
            >
              {/* Like Icon  */}
              {(video?.likeEnabled || video?.likeEnabled === true) && (
                <button
                  className="like_icon"
                  title="I like this"
                  disabled={isLikingVideo}
                  onClick={(e) => handleLikeEvent(e, video.videoId)}
                >
                  {isLikingVideo ? (
                    <LoaderDark />
                  ) : (
                    <div className="icon">
                      {isVideoLiked ? <LikeIcon /> : <UnLikeIcon />}
                    </div>
                  )}
                  <div
                    className={`icon-count like-count-${video.videoId}`}
                    id={`like-count-${video?.videoId}`}
                  >
                    {likeCount}
                  </div>
                </button>
              )}

              {/* Comment Icon  */}
              {(video?.commentEnabled || video?.commentEnabled === true) && (
                <button
                  className="comment_icon"
                  title="Comments"
                  onClick={() => {
                    setShowComments((prev) => !prev);
                    // setShowHighlightedComment((prev) => !prev);
                    if (videoRef.current) {
                      videoRef.current.classList.toggle("video-player-radius");
                      videoControls.current?.classList.toggle(
                        "video-player-radius"
                      );
                    }
                  }}
                >
                  <div className="icon">
                    <CommentIcon />
                  </div>
                  <div className="icon-count comment_count">
                    {videoCommentCount}
                  </div>
                </button>
              )}

              {/* Share Icon  */}
              {(video?.shareEnabled || video?.shareEnabled === true) && (
                <button
                  className="share_icon"
                  title="Share"
                  onClick={() => setShowShare((prev) => !prev)}
                >
                  <div className="icon">
                    <ShareIcon />
                  </div>
                  <div className="icon-count share_count">
                    {shareCount || 0}
                  </div>
                </button>
              )}

              {/* Repost Icon */}
              <button
                className="repost_icon"
                title="Repost"
                onClick={toggleRepostModal}
              >
                <div className="icon">
                  <RepostIcon />
                </div>
                <div className="icon-count repost_count">
                  {repostCount || 0}
                </div>
              </button>

              {false && (
                <button
                  className="shop_icon"
                  title="I dislike this"
                  onClick={async () => {
                    const isUserLoggedIn = await isLoggedin();
                    if (isUserLoggedIn) {
                      // setShowProducts((prev) => !prev);
                    } else {
                      setShowLoginModal(true);
                    }
                  }}
                >
                  <div className="icon">
                    <ShopIcon />
                  </div>
                </button>
              )}

              <div className="misc_options_wrapper">
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900">
                    <OptionsIcon />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute top-0 right-16 w-56 origin-top-left rounded-md focus:outline-none shadow-[0_0_32px_#00000014] cursor-pointer directionRtl">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="#"
                            onClick={async (event) => {
                              event.preventDefault();
                              const isUserLoggedIn = await isLoggedin();
                              if (isUserLoggedIn) {
                                toggleReportModal();
                              } else {
                                setShowLoginModal(true);
                              }
                            }}
                            className="reply_btn reply_actions p-2 block"
                          >
                            <div className="btn-wrap pb-2">
                              <span>
                                <ReportIcon />
                              </span>
                              <p>{t("report")}</p>
                            </div>
                          </Link>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              {soundId && (
                <div className="profile_thumbnail">
                  <button onClick={soundId ? handleClickOnSound : () => {}}>
                    {soundThumbnail && (
                      <img
                        src={soundThumbnail && soundThumbnail}
                        alt={`${soundName}-thumbnail`}
                      />
                    )}

                    {!soundThumbnail && (
                      <>
                        <div className="icon">
                          <SoundWave />
                        </div>
                        <div></div>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className={`video_expanded ${
              showComments ? "video_expanded_visible" : "video_expanded_hidden"
            }`}
          >
            <Comments
              video={video}
              setShowComments={setShowComments}
              videoRef={videoRef}
              videoControls={videoControls}
              setShowCommentReportModal={setShowCommentReportModal}
              setCommentPostId={setCommentPostId}
              commentCount={videoCommentCount}
              setCommentCount={setVideoCommentCount}
            />
          </div>

          {showComments && <div className="mobile-backdrop"></div>}

          <RepostModal
            show={showRepost}
            onHide={toggleRepostModal}
            video={video}
          />

          <Share
            video={video}
            show={showShare}
            handleClose={() => setShowShare(false)}
          />

          {showReportModal && (
            <Report
              onHide={toggleReportModal}
              show={showReportModal}
              type="video"
              payloadData={{ userId, assetId: video.videoId }}
              handleClose={toggleReportModal}
            />
          )}

          {showCommentReportModal && (
            <Report
              show={showCommentReportModal}
              onHide={toggleCommentReportModal}
              type="comment"
              payloadData={{
                userId,
                assetId: video.videoId,
                postId: commentPostId,
              }}
              handleClose={toggleCommentReportModal}
              classes={"comment-report-modal"}
            />
          )}
        </div>

        {showVideoError && (
          <CustomModal
            isOpen={showVideoError}
            close={() => setShowVideoError(false)}
          >
            <h2>{videoErrorMessage}</h2>
          </CustomModal>
        )}
      </>
    );
  }
);

export default VideoItem;
