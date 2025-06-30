/*eslint-disable*/
import DeleteIcon from "../../assets/icons/DeleteIcon";
import MoreIcon from "../../assets/icons/MoreIcon";
import StoryClose from "../../assets/icons/StoryClose";
import StoryLeft from "../../assets/icons/StoryLeft";
import StoryMute from "../../assets/icons/StoryMute";
import StoryPause from "../../assets/icons/StoryPause";
import StoryPlay from "../../assets/icons/StoryPlay";
import StoryRight from "../../assets/icons/StoryRight";
import StoryShare from "../../assets/icons/StoryShare";
import StoryUnmute from "../../assets/icons/StoryUnmute";
import DefaultProfileImage from "../../assets/img/Profile.png";
import { PAGE } from "../../constants";
import { useLoginModalContext } from "../../contexts/LoginModal";
import useIsMobile from "../../hooks/useIsMobile";
import TaggedFriendsList from "../CreatorTools/CreatorFriend/TaggedFriendList";
import SidePanel from "../Layouts/SidePanel/SidePanel";
import LikeIcon from "../VerticalPlayer/Icons/Like";
import UnLikeIcon from "../VerticalPlayer/Icons/UnLike";
import Share from "../VerticalPlayer/components/Share";
import LoaderDark from "../common/LoaderDark/LoaderDark";
import "./Story.css";
import axios from "axios";
import gluedin from "gluedin-shorts-js";
import React, { useState, useEffect, useRef } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

const StoryModule = new gluedin.GluedInStoryModule();
const activityTimelineModule = new gluedin.GluedInActivityTimeline();

const Story: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [usersStories, setUsersStories]: any = useState([]);
  const [currentUserStories, setCurrentUserStories] = useState<any[]>([]);
  const [currentStory, setCurrentStory] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useParams(); // Gets userId from the URL path
  const [searchParams] = useSearchParams();
  const afterKey = searchParams.get("afterkey");
  const offset: any = searchParams.get("offset");
  const [page, setPage] = useState(parseInt(offset!));
  const pageType = searchParams.get("type");
  const [isLikingStory, setIsLikingStory] = useState(false);
  const { setShowLoginModal } = useLoginModalContext();
  const [isStoryLiked, setIsStoryLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(true);
  const isMobile = useIsMobile();
  const [showShare, setShowShare] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const [discoverOffset, setDiscoverOffset] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [userActivity, setUserActivity]: any = useState([]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  async function formatUserStories(data: any) {
    return data.map((user: any) => {
      if (user.stories.length > 0) {
        user = {
          userId: user.userId,
          totalStories: user.totalStories,
          fullName: user.stories[0].user.fullName,
          userName: user.stories[0].user.userName,
          profileImageUrl: user.stories[0].user.profileImageUrl,
          stories: user.stories,
        };
      }
      return user;
    });
  }

  useEffect(() => {
    async function getStories() {
      setIsLoading(true);
      try {
        const getStoryList = await StoryModule.getStory({
          offset: page,
          limit: 6,
          afterKey: afterKey,
        });
        if (getStoryList.status === 200) {
          let stories = await formatUserStories(getStoryList.data.result);
          let selectedUserStories = stories.find(
            (item: any) => item.userId === userId
          );
          let otherUserStories = stories.filter(
            (item: any) => item.userId !== userId
          );
          //   setUsersStories([selectedUserStories, ...otherUserStories]);
          setUsersStories((prev: any) => {
            const existingUserIds = new Set(prev.map((s: any) => s.userId));
            const newStories = otherUserStories.filter(
              (s: any) => !existingUserIds.has(s.userId)
            );
            return [...prev, ...newStories];
          });
        }
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    }

    async function fetchMetaData(userIds: any) {
      setIsLoading(true);
      try {
        var UserModuleObj = new gluedin.GluedInFeedModule();
        var userMetaData = await UserModuleObj.getMetadata({
          type: "storyOwner",
          ids: userIds,
        });
        if (userMetaData.status === 200) {
          const userResponse = userMetaData.data.result;
          let selectedUserStories = userResponse?.storyOwner?.find(
            (item: any) => item.userId === userId
          );
          let otherUserStories = userResponse?.storyOwner?.filter(
            (item: any) => item.userId !== userId
          );
          //   setUsersStories([selectedUserStories, ...otherUserStories]);
          if (selectedUserStories) {
            setUsersStories((prev: any) => {
              const alreadyExists = prev.some((s: any) => s.userId === userId);
              if (!alreadyExists) {
                return [selectedUserStories, ...prev];
              }
              return prev;
            });
          }

          if (pageType === PAGE.FEED) {
            getStories(); // call this after selected user is added
          }
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }

    if (pageType === PAGE.FEED || pageType === PAGE.PROFILE) {
      fetchMetaData([userId]);
      //   getStories();
    } else if (pageType === PAGE.DISCOVER) {
      const userIds = JSON.parse(
        localStorage.getItem("discoverUserIds") ?? "[]"
      ) as string[];
      fetchMetaData(userIds);
    } else {
      alert("PageType is missing....");
    }
  }, [userId, page]);

  useEffect(() => {
    if (usersStories.length > 0 && currentUserIndex < usersStories.length) {
      setCurrentUserStories(usersStories[currentUserIndex]?.stories || []);
    }
  }, [usersStories, currentUserIndex]);

  useEffect(() => {
    if (
      currentUserStories.length > 0 &&
      currentStoryIndex < currentUserStories.length
    ) {
      setCurrentStory(currentUserStories[currentStoryIndex] || null);
    }
  }, [currentUserStories, currentStoryIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      video
        .play()
        .then(() => {
          setProgress(0);
          setIsPaused(false);
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            console.error("Video play failed:", error);
          }
        });
    }
  }, [currentStoryIndex, currentUserIndex]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const startTimer = () => {
    if (isPaused) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const duration =
      currentStory.contentType === "video" && videoRef.current?.duration
        ? videoRef.current.duration * 1000
        : 3000;

    setProgress(0);
    const startTime = Date.now();

    const updateProgress = () => {
      if (isPaused) return;
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / duration) * 100, 100));

      if (elapsed < duration) {
        timerRef.current = window.setTimeout(updateProgress, 100);
      } else {
        nextStory();
      }
    };

    timerRef.current = window.setTimeout(updateProgress, 100);
  };

  const nextStory = () => {
    setProgress(0);
    if (currentStoryIndex + 1 < currentUserStories.length) {
      setCurrentStoryIndex((prev) => prev + 1);
      setUserActivity([]);
    } else if (currentUserIndex + 1 < usersStories.length) {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentStoryIndex(0);
      setActiveIndex((prev) => prev + 1);
      if (currentUserIndex === usersStories.length - 4) {
        setPage((prev) => prev + 1);
      }
    } else {
      onClose();
    }
    setIsPaused(false);
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex((prev) => prev - 1);
      setCurrentStoryIndex(
        usersStories[currentUserIndex - 1].stories.length - 1
      );
      setActiveIndex((prev) => prev - 1);
    }
    setIsPaused(false);
  };

  const handleUserClick = (index: number) => {
    setCurrentUserIndex(index);
    setCurrentStoryIndex(0);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  // Toggle Play/Pause
  const handlePauseToggle = () => {
    setIsPaused((prev) => {
      const newPausedState = !prev;
      if (videoRef.current) {
        if (newPausedState) {
          videoRef.current.pause();
          if (timerRef.current) clearTimeout(timerRef.current);
        } else {
          videoRef.current.play();
          startTimer();
        }
      }
      return newPausedState;
    });
  };

  // Sync Progress Bar with Video Playback
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const moveToIndex = (index: number) => {
    if (index >= 0 && index < usersStories.length) {
      setActiveIndex(index);
      handleUserClick(index);
      if (currentUserIndex === usersStories.length - 4) {
        setPage((prev) => prev + 1);
      }
    }
  };

  const handleStoryClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, currentTarget } = event;
    const divWidth = currentTarget.offsetWidth;
    const clickPosition = clientX - currentTarget.getBoundingClientRect().left;

    if (clickPosition > divWidth / 2) {
      nextStory(); // Clicking on Right Half → Next Story
    } else {
      prevStory(); // Clicking on Left Half → Previous Story
    }
  };

  const handleStorySlider = (
    event: React.MouseEvent<HTMLDivElement>,
    offset: number,
    index: number
  ) => {
    if (offset === 0) {
      handleStoryClick(event);
    } else {
      moveToIndex(index);
    }
  };

  const isLoggedin = async () => {
    const accessToken = await new gluedin.GluedInAuthModule().getAccessToken();
    if (accessToken) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const fetchLikedStory = async () => {
      try {
        const {
          status,
          data: { result: storyInteraction },
        } = await StoryModule.getStoryInteractionByStoryId({
          storyId: currentStory?.storyId,
          offset: discoverOffset,
          limit: 6,
        });
        if (status === 200 || status === 201) {
          if (storyInteraction?.length) {
            const loginUserLikedStories = storyInteraction.find(
              (item: any) => item.userId === userData.userId
            );

            if (loginUserLikedStories) {
              setIsStoryLiked(true);
            } else {
              setIsStoryLiked(false);
            }

            setUserActivity(storyInteraction);
          } else {
            setIsStoryLiked(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (currentStory?.storyId) {
      fetchLikedStory();
    }
  }, [currentStory]);

  const handleLikeEvent = async (e: any, storyId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLikingStory(true);
    let selfTarget = e.currentTarget;
    const isUserLoggedIn = await isLoggedin();
    if (!isUserLoggedIn) {
      setShowLoginModal(true);
      setIsLikingStory(false);
      return;
    }
    if (isStoryLiked) {
      //   const userPostedComment = await axios.post(
      //     "https://stag-v2-api.gluedin.io/v1/activity-timeline/eventAction",
      //     {
      //       assetId: storyId,
      //       posType: "story",
      //       event: "unlike",
      //       metakeys: {},
      //     },
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${userData?.token}`, // Replace with actual token
      //       },
      //     }
      //   );
      const userPostedComment =
        await activityTimelineModule.activityTimelineUnLike({
          assetId: storyId,
          posType: "story",
          event: "unlike",
          metakeys: {},
        });
      const { status } = userPostedComment ?? {};
      if (status === 200) {
        selfTarget.classList.remove("active");
        setIsStoryLiked(false);
        setIsLikingStory(false);
      }
    } else {
      //   await axios
      //     .post(
      //       "https://stag-v2-api.gluedin.io/v1/activity-timeline/eventAction",
      //       {
      //         assetId: storyId,
      //         posType: "story",
      //         event: "like",
      //         metakeys: {},
      //       },
      //       {
      //         headers: {
      //           "Content-Type": "application/json",
      //           Authorization: `Bearer ${userData?.token}`, // Replace with actual token
      //         },
      //       }
      //     )
      //     .then((response: any) => {
      //       const { status } = response ?? {};
      //       if (status === 200) {
      //         selfTarget.classList.add("active");
      //         setIsStoryLiked(true);
      //         setIsLikingStory(false);
      //       }
      //     });

      await activityTimelineModule
        .activityTimelineLike({
          assetId: storyId,
          posType: "story",
          event: "like",
          metakeys: {},
        })
        .then((response: any) => {
          const { status } = response ?? {};
          if (status === 200) {
            selfTarget.classList.add("active");
            setIsStoryLiked(true);
            setIsLikingStory(false);
          }
        });
    }
  };

  const handleStoryDelete = async (storyId: any) => {
    setIsLoading(true);
    try {
      const storyDeleteResponse = await StoryModule.deleteStory(storyId);
      console.log("Story Delete Response", storyDeleteResponse);
      navigate("/my-profile");
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleUserActivity = async (e: any) => {
    e.stopPropagation();
    setIsPanelOpen(true);
    handlePauseToggle();
  };

  const profileImages = userActivity
    .filter(
      (story: any) =>
        story.profileImageUrl !== undefined && story.profileImageUrl !== ""
    )
    .map((story: any) => story.profileImageUrl as string) // Type assertion
    .slice(0, 2); // Get first two images

  return (
    <div className="story">
      <button className="story-close" onClick={onClose}>
        <StoryClose />
      </button>

      <div className="story-carousel-container">
        <div className="story-carousel">
          {isLoading && <LoaderDark />}

          {usersStories.length > 0 && (
            <div className="story-carousel-actions">
              {(currentUserIndex > 0 || currentStoryIndex > 0) && (
                <button className="story-prev" onClick={prevStory}>
                  <StoryLeft />
                </button>
              )}

              {(currentStoryIndex < currentUserStories.length - 1 ||
                currentUserIndex < usersStories.length - 1) && (
                <button className="story-next" onClick={nextStory}>
                  <StoryRight />
                </button>
              )}
            </div>
          )}

          {usersStories?.length > 0 &&
            usersStories?.map((story: any, index: any) => {
              const offset = activeIndex - index;
              const width =
                offset === 0
                  ? isMobile
                    ? "100%"
                    : "calc((100dvh - 30px)* 0.5625)"
                  : "150px";
              const height =
                offset === 0
                  ? isMobile
                    ? "100%"
                    : "calc(100dvh - 30px)"
                  : "300px";
              const opacity = offset > 2 ? 0.4 : 1;
              const translateX = (index - activeIndex) * 360;
              const marginOffset =
                offset === -2 ? "-260px" : offset === 2 ? "260px" : "";

              return (
                <div
                  key={
                    story?.stories?.[0]?.storyId || `${story?.userId}-${index}`
                  }
                  className="story-carousel-item"
                  style={{
                    transform: `translateX(${translateX}px)`,
                    opacity,
                    zIndex: 10 - offset,
                    width: width,
                    height: height,
                    marginLeft: marginOffset,
                  }}
                >
                  {offset === 0 ? (
                    <>
                      <div className="story-item-header">
                        <div className="story-progress-container">
                          {currentUserStories?.map((item: any, index: any) => (
                            <div
                              key={`${item?.storyId}-${index}`}
                              className="progress-segment"
                            >
                              <div
                                className={`progress-segment-item ${
                                  index < currentStoryIndex ? "filled" : ""
                                }`}
                                style={{
                                  width:
                                    index < currentStoryIndex
                                      ? "100%"
                                      : index === currentStoryIndex
                                      ? `${progress}%`
                                      : "0%",
                                  transition:
                                    index === currentStoryIndex && progress > 0
                                      ? "width 0.5s linear"
                                      : "none",
                                }}
                              ></div>
                            </div>
                          ))}
                        </div>

                        <div className="story-info-container">
                          <div className="story-info">
                            <Link to={`/profile/${story?.userId}`}>
                              <img
                                src={
                                  story?.stories[0]?.user?.profileImageUrl
                                    ? story?.stories[0]?.user?.profileImageUrl
                                    : DefaultProfileImage
                                }
                                alt={story?.stories[0]?.user?.fullName}
                                width={44}
                                height={44}
                              />
                            </Link>
                            <div className="story-profile">
                              <h2>{story?.stories[0]?.user?.fullName}</h2>
                              <span>{story?.stories[0]?.user?.userName}</span>
                            </div>
                          </div>

                          <div className="story-actions">
                            {currentStory?.contentType === "video" && (
                              <button onClick={handlePauseToggle}>
                                {isPaused ? <StoryPlay /> : <StoryPause />}
                              </button>
                            )}

                            <button onClick={handleMuteToggle}>
                              {isMuted ? <StoryMute /> : <StoryUnmute />}
                            </button>

                            {userData.userId === userId && (
                              <div className="menu-container">
                                <button
                                  className="menu-button"
                                  onClick={toggleMenu}
                                >
                                  <MoreIcon />
                                </button>

                                {isMenuOpen && (
                                  <div className="menu">
                                    <ul>
                                      <li>
                                        <button
                                          onClick={() =>
                                            handleStoryDelete(
                                              currentStory?.storyId
                                            )
                                          }
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                          >
                                            <g
                                              id="Group_26672"
                                              data-name="Group 26672"
                                              transform="translate(0.111 0.111)"
                                            >
                                              <rect
                                                id="Rectangle_11971"
                                                data-name="Rectangle 11971"
                                                width="16"
                                                height="16"
                                                transform="translate(-0.111 -0.111)"
                                                fill="#fff"
                                                opacity="0"
                                              />
                                              <path
                                                id="Path_18518"
                                                data-name="Path 18518"
                                                d="M10.813,4.35H13.75V5.525H12.575v7.638a.587.587,0,0,1-.588.588H3.763a.588.588,0,0,1-.588-.588V5.525H2V4.35H4.938V2.588A.588.588,0,0,1,5.525,2h4.7a.588.588,0,0,1,.588.588Zm-4.7,2.938v3.525H7.288V7.288Zm2.35,0v3.525H9.638V7.288ZM6.113,3.175V4.35H9.638V3.175Z"
                                                transform="translate(-0.042 -0.042)"
                                                fill="#fff"
                                              />
                                            </g>
                                          </svg>
                                          <span>Delete</span>
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className="story-content"
                        onClick={(e) => handleStorySlider(e, offset, index)}
                      >
                        {currentStory?.contentType === "image" ? (
                          <>
                            <img
                              src={currentStory?.contentUrls[0].urls[0]}
                              alt="story"
                              onLoad={startTimer}
                            />
                            <div
                              className={`story-item-footer-actions ${
                                userData?.userId === currentStory?.userId &&
                                userActivity?.length > 0 &&
                                userActivity?.storyId === currentStory?.storyId
                                  ? "justify-between"
                                  : ""
                              }`}
                            >
                              {userData?.userId === currentStory?.userId &&
                                userActivity?.length > 0 &&
                                userActivity?.storyId ===
                                  currentStory?.storyId && (
                                  <button onClick={handleUserActivity}>
                                    {profileImages?.map(
                                      (url: any, index: any) => (
                                        <img
                                          key={index}
                                          src={url}
                                          alt={`Profile ${index + 1}`}
                                          className={`absolute w-10 h-10 rounded-full border-2 border-white ${
                                            index === 0
                                              ? "left-0 top-0"
                                              : "right-0 bottom-0"
                                          }`}
                                        />
                                      )
                                    )}
                                    Activity
                                  </button>
                                )}

                              <div className="flex items-center gap-4">
                                {!(userData?.userId === story?.userId) && (
                                  <button
                                    disabled={isLikingStory}
                                    onClick={(e) =>
                                      handleLikeEvent(e, currentStory?.storyId)
                                    }
                                    className="btn-like"
                                  >
                                    {isLikingStory ? (
                                      <LoaderDark />
                                    ) : (
                                      <>
                                        {isStoryLiked ? (
                                          <LikeIcon />
                                        ) : (
                                          <UnLikeIcon />
                                        )}
                                      </>
                                    )}
                                  </button>
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowShare((prev) => !prev);
                                  }}
                                >
                                  <StoryShare />
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <video
                              ref={videoRef}
                              src={currentStory?.contentUrls[0].urls[1]}
                              muted={isMuted}
                              autoPlay
                              onLoadedMetadata={startTimer}
                              onTimeUpdate={handleTimeUpdate}
                              onEnded={nextStory}
                              playsInline
                              webkit-playsinline={"true"}
                            />
                            <div
                              className={`story-item-footer-actions ${
                                userData?.userId === currentStory?.userId &&
                                userActivity?.length > 0 &&
                                userActivity.some(
                                  (user: any) =>
                                    user?.storyId === currentStory?.storyId
                                )
                                  ? "justify-between"
                                  : ""
                              }`}
                            >
                              {userData?.userId === currentStory?.userId &&
                                userActivity?.length > 0 &&
                                userActivity.some(
                                  (user: any) =>
                                    user?.storyId === currentStory?.storyId
                                ) && (
                                  <button
                                    className="btn-activity"
                                    onClick={handleUserActivity}
                                  >
                                    <div className="btn-activity-images">
                                      {profileImages?.map(
                                        (url: any, index: any) => (
                                          <img
                                            key={index}
                                            src={url}
                                            alt={`Profile ${index + 1}`}
                                            width={20}
                                            height={20}
                                          />
                                        )
                                      )}
                                    </div>
                                    Activity
                                  </button>
                                )}
                              <div className="flex items-center gap-4">
                                {!(userData?.userId === story?.userId) && (
                                  <button
                                    disabled={isLikingStory}
                                    onClick={(e) =>
                                      handleLikeEvent(e, currentStory?.storyId)
                                    }
                                    className="btn-like"
                                  >
                                    {isLikingStory ? (
                                      <LoaderDark />
                                    ) : (
                                      <>
                                        {isStoryLiked ? (
                                          <LikeIcon />
                                        ) : (
                                          <UnLikeIcon />
                                        )}
                                      </>
                                    )}
                                  </button>
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowShare((prev) => !prev);
                                  }}
                                >
                                  <StoryShare />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="story-item-footer">
                        {currentStory?.taggedUsers?.length > 0 && (
                          <TaggedFriendsList
                            taggedFriends={currentStory?.taggedUsers || []}
                            storyView={true}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="inactive-story"
                        onClick={(e) => handleStorySlider(e, offset, index)}
                      >
                        <div className="inactive-story-thumbnail">
                          <img src={story?.stories[0]?.thumbnailUrl} alt="" />
                        </div>
                        <div className="inactive-story-profile">
                          <img
                            src={
                              story?.profileImageUrl
                                ? story?.profileImageUrl
                                : DefaultProfileImage
                            }
                            alt={story?.fullName}
                          />
                          <p>{story?.fullName}</p>
                        </div>
                        <div className="inactive-story-overlay"></div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {currentStory && (
        <Share
          show={showShare}
          handleClose={() => setShowShare(false)}
          shareType="story"
          currentStory={currentStory}
        />
      )}

      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
          handlePauseToggle();
        }}
        title={"Activity"}
      >
        <div className="userActivity">
          <h2 className="userActivity-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24.549"
              height="20.422"
              viewBox="0 0 24.549 20.422"
            >
              <path
                id="View"
                d="M1.182,13.211a12.483,12.483,0,0,1,24.549,0,12.483,12.483,0,0,1-24.549,0Zm12.274,5.673a5.673,5.673,0,1,0-5.673-5.673A5.673,5.673,0,0,0,13.456,18.884Zm0-2.269a3.4,3.4,0,1,1,3.4-3.4A3.4,3.4,0,0,1,13.456,16.615Z"
                transform="translate(-1.182 -3)"
                fill="#596970"
              />
            </svg>
            Views: {userActivity?.length}
          </h2>
          <div className="userActivity-list">
            {userActivity?.map((user: any) => (
              <div key={user?.storyId} className="userActivity-list-item">
                <div className="user-image">
                  <img
                    src={user?.profileImageUrl}
                    alt={user?.fullName}
                    width={40}
                    height={40}
                  />
                  {user?.storyLiked && (
                    <div className="user-like">
                      <LikeIcon />
                    </div>
                  )}
                  {/* <div className="user-like">
                    {user?.storyViewed ? "Viewed" : "Not Viewed"} |{" "} 
                    {user?.storyShared ? "Shared" : "Not Shared"}
                    {user?.storyLiked && <LikeIcon />}
                  </div> */}
                </div>

                <div className="user-name">
                  <h3>{user?.fullName}</h3>
                  {/* <p className="text-gray-600">@{user?.userName}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SidePanel>
    </div>
  );
};

export default Story;
