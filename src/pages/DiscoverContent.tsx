import LeftArrowIcon from "../assets/icons/LeftArrowIcon";
import RightArrowIcon from "../assets/icons/RightArrowIcon";
import Bottom from "../components/Layouts/Bottom";
import Sidebar from "../components/Layouts/Sidebar";
import VideoItem from "../components/VerticalPlayer/VideoItem";
import { getVideosData } from "../components/VerticalPlayer/helpers";
import useVerticalPlayer from "../components/VerticalPlayer/hooks/useVerticalPlayer";
import Loader from "../components/common/Loader";
import LoaderDark from "../components/common/LoaderDark/LoaderDark";
import gluedin from "gluedin-shorts-js";
import React, { createRef, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const curatedContentModule = new gluedin.GluedInCuratedContentModule();

export default function DiscoverContent() {
  const defaultLanguage = localStorage.getItem("defaultLanguage");
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const railId = searchParams.get("railId");
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  const { videos, setVideos, setCurrentVideoIndex } = useVerticalPlayer();
  const videoRefs = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function fetchFeed(railId: any) {
      setIsLoading(true);
      try {
        const {
          status,
          data: { result: curatedContent },
        } = await curatedContentModule.getRailById(railId);
        const { itemList = [] } = curatedContent ?? {};
        if (status === 200) {
          if (itemList.length) {
            const feeds = itemList.map((contentInfo: any) => contentInfo.video);
            const videosData = [
              ...videos,
              ...getVideosData(feeds, videos.length),
            ];
            videoRefs.current = [
              ...videosData.map(() => createRef<HTMLDivElement>()),
            ];
            setVideos(videosData);
          }
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }

    async function fetchMetaData() {
      setIsLoading(true);
      try {
        var userModuleObj = new gluedin.GluedInFeedModule();
        let videoIds: any = localStorage.getItem("ids");
        videoIds = JSON.parse(videoIds);
        var railData = await userModuleObj.getMetadata({
          type: type,
          ids: videoIds,
        });
        if (railData.status === 200) {
          const response = railData.data.result;
          if (response && response.videos && response.videos.length) {
            const videosData = [
              ...videos,
              ...getVideosData(response.videos, videos.length),
            ];
            videoRefs.current = [
              ...videosData.map(() => createRef<HTMLDivElement>()),
            ];
            setVideos(videosData);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    if (railId) {
      fetchFeed(railId);
    }
    if (type) {
      fetchMetaData();
    }
  }, [type, railId]);

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

  const goBack = () => {
    window.history.back();
  };

  if (isLoading) return <Loader />;

  const loginModalHandler = () => {
    setShowLoginModal(true);
  };

  return (
    <>
      <div className="full-sec">
        <div className="left-sec">
          <Sidebar showProfile={true} loginHandler={loginModalHandler} />
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
                ref={videoRefs.current && videoRefs.current[index]}
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
}
