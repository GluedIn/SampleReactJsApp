import LeftArrowIcon from "../assets/icons/LeftArrowIcon";
import RightArrowIcon from "../assets/icons/RightArrowIcon";
import Bottom from "../components/Layouts/Bottom";
import Sidebar from "../components/Layouts/Sidebar";
import VideoItem from "../components/VerticalPlayer/VideoItem";
import { getVideosData } from "../components/VerticalPlayer/helpers";
import useVerticalPlayer from "../components/VerticalPlayer/hooks/useVerticalPlayer";
import Loader from "../components/common/Loader";
import { CONTENT_TYPE } from "../constants";
import gluedin from "gluedin-shorts-js";
import React, { createRef, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";

const userModule = new gluedin.GluedInUserModule();
const videoModule = new gluedin.GluedInVideosModule();
const soundModule = new gluedin.GluedInSoundModule();

const fetchHashTagVideos = async (hashtagName: any) => {
  try {
    const hashTagModule = new gluedin.GluedInHashTag();
    const {
      status,
      data: {
        result: { videos: hashTagVideos },
      },
    } = await hashTagModule.getHashTagDetails({
      limit: 10,
      offset: 1,
      name: hashtagName,
    });

    if (status === 200) {
      return hashTagVideos;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchUserVideos = async (userId: any) => {
  try {
    const {
      status,
      data: { result: videosList },
    } = await userModule.getUserVideoList({
      userId,
    });
    if (status === 200) {
      return videosList;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchVideoById = async (contentId: any) => {
  try {
    const {
      status,
      data: { result: videoResult },
    } = await videoModule.getVideoById(contentId as string);
    if (status === 200) {
      const { videoData } = videoResult;
      return videoData;
    }
    return {};
  } catch (error) {
    console.error(error);
  }
};

const fetchVideoListBySound = async (soundId: any, page: number) => {
  try {
    const limit = 8;
    const {
      data: { statusCode, result: videosList },
    } = await soundModule.fetchVideoListBySoundId({
      limit: limit,
      offset: page || 1,
      soundId: soundId,
    });

    if (statusCode === 2004) {
      return videosList;
    }
  } catch (error) {
    console.error(error);
  }
};

const ContentDetailPage = () => {
  const defaultLanguage = localStorage.getItem("defaultLanguage");
  const { t } = useTranslation();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const contentType = searchParams.get("contentType");
  const offset = Number(searchParams.get("offset")) || 1;
  const { contentId } = useParams();
  const id = searchParams.get("clickedVideoId") || contentId;
  const [page, setPage] = useState(offset);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const videoRefs = useRef<any>(null);
  const { videos, setVideos, setCurrentVideoIndex } = useVerticalPlayer();

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let videosList = [];
        if (contentType === CONTENT_TYPE.HASHTAG) {
          videosList = await fetchHashTagVideos(contentId);
        }

        if (contentType === CONTENT_TYPE.PROFILE) {
          videosList = await fetchUserVideos(contentId);
        }

        if (contentType === CONTENT_TYPE.SOUND) {
          videosList = await fetchVideoListBySound(contentId, page);
        }

        if (
          contentType === CONTENT_TYPE.SHARE ||
          contentType === CONTENT_TYPE.VIDEO
        ) {
          const videoData = await fetchVideoById(contentId);
          videosList = [videoData];
        }

        const videosData = [
          ...videos,
          ...getVideosData(videosList, videos.length),
        ];
        videoRefs.current = [
          ...videosData.map(() => createRef<HTMLVideoElement>()),
        ];
        setVideos(videosData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [contentType, contentId, page]);

  useEffect(() => {
    let timeout: any;
    if (id && videos.length) {
      timeout = setTimeout(() => {
        const clickedVideoElement = document.getElementById(
          `content-video-${id}`
        );
        clickedVideoElement?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 500);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [id, videos.length]);

  if (!videos.length) return <Loader />;

  const loginModalHandler = () => {
    setShowLoginModal(true);
  };

  return (
    <>
      <div className="full-sec">
        <div className="left-sec">
          <Sidebar loginHandler={loginModalHandler} />
        </div>
        <div className="mid-content">
          <div id="vertical-player" className="player_wrapper">
            <div className="profile-head-back">
              <div className="back-btn">
                <button className="back-btn-a" onClick={goBack}>
                  {defaultLanguage === "en" ? (
                    <LeftArrowIcon />
                  ) : (
                    <RightArrowIcon />
                  )}
                  {t("back-btn")}
                </button>
              </div>
            </div>

            {videos.map((video: any, index: number) => (
              <VideoItem
                key={video.videoId}
                ref={videoRefs.current[index]}
                video={video}
                setVideos={setVideos}
                setCurrentVideoIndex={setCurrentVideoIndex}
              />
            ))}
          </div>
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default ContentDetailPage;
