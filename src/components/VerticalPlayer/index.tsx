/*eslint-disable*/
import { formatUserStories } from "../../Helper/helper";
import { isLoggedin } from "../../Helper/helper";
import DefaultProfileImage from "../../assets/img/Profile.png";
import { PAGE } from "../../constants";
import { useLoginModalContext } from "../../contexts/LoginModal";
import useIsMobile from "../../hooks/useIsMobile";
import Bottom from "../Layouts/Bottom";
import Sidebar from "../Layouts/Sidebar";
import StoryRailCarousel from "../common/Carousel/StoryRailCarousel/StoryRailCarousel";
import Loader from "../common/Loader";
import DownArrow from "./Icons/DownArrow";
import UpArrow from "./Icons/UpArrow";
import VideoItem from "./VideoItem";
import { getVideosData } from "./helpers";
import useVerticalPlayer from "./hooks/useVerticalPlayer";
import gluedin from "gluedin-shorts-js";
import React, { createRef, useEffect, useRef, useState } from "react";

const feedModule = new gluedin.GluedInFeedModule();
const StoryModule = new gluedin.GluedInStoryModule();

const VerticalPlayer = () => {
  const { videos, setVideos, currentVideoIndex, setCurrentVideoIndex } =
    useVerticalPlayer();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { setShowLoginModal } = useLoginModalContext();
  const verticalPlayerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [story, setStory]: any = useState(null);
  const [storyTotal, setStoryTotal] = useState(0);
  const [afterKey, setAfterKey] = useState(" ");
  const limit = 6;
  const storyContainerRef = useRef(null);
  const [dynamicWidth, setDynamicWidth] = useState("150px");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const userLoginStatus = async () => {
      const isLogin = await isLoggedin();
      console.log("isLogin", isLogin);
      setIsUserLoggedIn(isLogin);
    };

    userLoginStatus();
  }, []);

  const [pagination, setPagination] = useState({
    afterKey: afterKey,
    limit: limit,
    offset: 1,
  });

  useEffect(() => {
    if (storyContainerRef.current) {
      const items = storyContainerRef.current;
      let totalWidth = 0;

      Array.from(items).forEach((item: any) => {
        totalWidth += item.offsetWidth; // Sum up the width of each child item
      });

      setDynamicWidth(isOpen ? `${Math.max(totalWidth, 768)}px` : "150px"); // Ensure a min width
    }
  }, [isOpen]);

  const calculateItemsToShow = () => {
    if (window.innerWidth <= 768) {
      return 5;
    } else if (window.innerWidth <= 1536) {
      return 5;
    } else {
      return 5;
    }
  };

  useEffect(() => {
    async function getStories() {
      try {
        const storyList = await StoryModule.getStory(pagination);
        if (storyList.status === 200) {
          const storyCollectionformat = await formatUserStories(
            storyList?.data?.result,
            pagination.offset
          );
          setStoryTotal(storyList?.data?.total);
          let storyObj = {
            storyCollection: [
              ...(story?.storyCollection || []),
              ...storyCollectionformat,
            ],
            pagination: pagination,
          };
          setStory(storyObj);
          setAfterKey(storyList?.data?.nextAfterKey?.userId);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getStories();
  }, [pagination]);

  const handleNextStory = async () => {
    setPagination((prev: any) => ({
      ...prev,
      afterKey: afterKey,
      offset: prev.offset + 1,
    }));
  };

  const handleStoryNext = async () => {
    const itemsToShow = calculateItemsToShow();
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (
        nextIndex >= story?.storyCollection.length - itemsToShow &&
        story?.storyCollection.length % limit === 0
      ) {
        handleNextStory();
      }
      return nextIndex; // Return updated index
    });
  };

  const handleStoryPrevious = () => {
    console.log("Previous slide");
    console.log("currentIndex before update:", currentIndex);

    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1; // Calculate the new index
      // Ensure we don't go below 0
      if (nextIndex >= 0) {
        return nextIndex; // Update state with the new index
      }
      return prevIndex; // If already at the first slide, retain current index
    });
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const limit = 6;
        const {
          data: { result: feeds = [] },
        } = await feedModule.getFeedList({
          limit: limit,
          offset: page,
          c_type: "video",
        });

        if (
          feeds.length &&
          feeds.filter((video: any) => video.contentType === "video").length ===
            0
        ) {
          setPage((prev) => prev + 1);
        }

        const videosData = [...videos, ...getVideosData(feeds, videos.length)];
        setVideos(videosData);

        videoRefs.current = [
          ...videosData.map(() => createRef<HTMLDivElement>()),
        ];
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVideos();
  }, [page]);

  useEffect(() => {
    if (videoRefs.current && videoRefs.current.length > 0) {
      const currentVideo = videoRefs.current[currentVideoIndex].current;
      if (currentVideo) currentVideo.scrollIntoView({ behavior: "smooth" });
    }

    const handleLoadMore = () => {
      const scrollTop = verticalPlayerRef?.current?.scrollTop!;
      const scrollHeight = verticalPlayerRef?.current?.scrollHeight!;
      const clientHeight = verticalPlayerRef?.current?.clientHeight!;
      if (scrollTop + clientHeight >= scrollHeight) {
        setPage((prev) => prev + 1);
      }
    };

    verticalPlayerRef?.current?.addEventListener("scroll", handleLoadMore);
    return () => {
      verticalPlayerRef?.current?.removeEventListener("scroll", handleLoadMore);
    };
  }, [currentVideoIndex]);

  useEffect(() => {
    if (currentVideoIndex === videos.length - 2) {
      setPage((prev) => prev + 1);
    }
  }, [currentVideoIndex, videos.length]);

  const handleNext = () => {
    setCurrentVideoIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentVideoIndex((prev) => prev - 1);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (
        event.key === "ArrowDown" &&
        currentVideoIndex !== videos.length - 1
      ) {
        handleNext();
      }
    };

    const handleKeyUp = (event: any) => {
      if (event.key === "ArrowUp" && currentVideoIndex !== 0) {
        handlePrev();
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Cleanup: remove event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentVideoIndex, videos.length]);

  const loginModalHandler = () => {
    setShowLoginModal(true);
  };

  return (
    <>
      {(isLoading || videos.length === 0) && <Loader />}
      {!isLoading && videos.length > 0 && (
        <div className="main-wrapper">
          <div className="row-responsive">
            <div className="left_content">
              <Sidebar loginHandler={loginModalHandler} />
            </div>
            <div className="mid-content">
              {currentVideoIndex !== videos.length - 1 && (
                <button onClick={handleNext} className="next-btn">
                  <DownArrow />
                </button>
              )}
              {currentVideoIndex > 0 && (
                <button onClick={handlePrev} className="prev-btn">
                  <UpArrow />
                </button>
              )}
              <div
                ref={verticalPlayerRef}
                id="vertical-player"
                className="player_wrapper"
              >
                {story?.storyCollection?.length > 0 && isUserLoggedIn && (
                  <div
                    className="story-container"
                    ref={storyContainerRef}
                    onClick={(e) => {
                      setIsOpen(true);
                      e.stopPropagation();
                    }}
                    style={{
                      width: isOpen
                        ? isMobile
                          ? "100%"
                          : "fit-content"
                        : "150px",
                      top: isOpen ? "20px" : "45px",
                      maxWidth: "640px",
                    }}
                  >
                    {isOpen ? (
                      <div className="expanding-container">
                        {isOpen && (
                          <StoryRailCarousel
                            carouselItems={story?.storyCollection}
                            autoplay={false}
                            loop={false}
                            onNext={handleStoryNext}
                            onPrevious={handleStoryPrevious}
                            storyType={PAGE.FEED}
                            pagination={story?.pagination}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="expanding-toggle">
                        <img
                          src={
                            story?.storyCollection[0]?.profileImageUrl
                              ? story?.storyCollection[0]?.profileImageUrl
                              : DefaultProfileImage
                          }
                          alt=""
                          width={35}
                          height={35}
                          className="expanding-toggle-img1"
                        />
                        {storyTotal > 1 && (
                          <img
                            src={
                              story?.storyCollection[1]?.profileImageUrl
                                ? story?.storyCollection[1]?.profileImageUrl
                                : DefaultProfileImage
                            }
                            alt=""
                            width={35}
                            height={35}
                            className="expanding-toggle-img2"
                          />
                        )}

                        <span>
                          {storyTotal === 1
                            ? "Story"
                            : `${storyTotal - 1}+ Stories`}
                        </span>
                      </div>
                    )}
                    {isOpen && (
                      <button
                        onClick={(e) => {
                          setIsOpen(!isOpen);
                          e.stopPropagation();
                        }}
                        className="absolute left-[50%] translate-x-[-50%] bottom-[-40px]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="45"
                          height="45"
                          viewBox="0 0 45 45"
                          className="w-[32px] h-[32px]"
                        >
                          <g
                            id="Close_Icon"
                            data-name="Close Icon"
                            transform="translate(-1059 -348)"
                          >
                            <g
                              id="Rectangle_13805"
                              data-name="Rectangle 13805"
                              transform="translate(1059 348)"
                              fill="#fff"
                              stroke="#e4e4e4"
                              strokeWidth="1"
                            >
                              <rect
                                width="45"
                                height="45"
                                rx="22.5"
                                stroke="none"
                              />
                              <rect
                                x="0.5"
                                y="0.5"
                                width="44"
                                height="44"
                                rx="22"
                                fill="none"
                              />
                            </g>
                            <path
                              id="Path_18490"
                              data-name="Path 18490"
                              d="M14.271,12.353l6.716-6.716,1.919,1.919L16.19,14.271l6.716,6.716-1.919,1.919L14.271,16.19,7.556,22.906,5.637,20.987l6.716-6.716L5.637,7.556,7.556,5.637Z"
                              transform="translate(1067.229 356.229)"
                              fill="#181818"
                            />
                          </g>
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {videos.map((video: any, index: number) => (
                  <VideoItem
                    ref={videoRefs.current[index]}
                    video={video}
                    key={video.id}
                    setVideos={setVideos}
                    setCurrentVideoIndex={setCurrentVideoIndex}
                    allVideoRefs={videoRefs}
                  />
                ))}
              </div>
            </div>
            <Bottom />
          </div>
        </div>
      )}
    </>
  );
};

export default VerticalPlayer;
