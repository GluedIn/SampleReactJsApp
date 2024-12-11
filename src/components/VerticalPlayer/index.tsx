import { useLoginModalContext } from "../../contexts/LoginModal";
import Bottom from "../Layouts/Bottom";
import Sidebar from "../Layouts/Sidebar";
import Loader from "../common/Loader";
import DownArrow from "./Icons/DownArrow";
import UpArrow from "./Icons/UpArrow";
import VideoItem from "./VideoItem";
import { getVideosData } from "./helpers";
import useVerticalPlayer from "./hooks/useVerticalPlayer";
import gluedin from "gluedin-shorts-js";
import React, { createRef, useEffect, useRef, useState } from "react";

const feedModule = new gluedin.GluedInFeedModule();

const VerticalPlayer = () => {
  const { videos, setVideos, currentVideoIndex, setCurrentVideoIndex } =
    useVerticalPlayer();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { setShowLoginModal } = useLoginModalContext();

  const verticalPlayerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<any>(null);

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
