import Sidebar from "../Layouts/Sidebar";
import VideoItem from "../VerticalPlayer/VideoItem";
import gluedin from "gluedin-shorts-js";
import React, { createRef, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function isHLSPotentially(videoSrc: any) {
  const extension = videoSrc.split(".").pop().toLowerCase();
  return extension === "m3u8";
}

const getVideosData = (videos: any, len: any = 0) => {
  try {
    return videos
      .filter((video: any) => video.contentType === "video")
      .map((video: any, index: number) => {
        const {
          videoId,
          thumbnailUrl,
          contentUrls: [
            { urls: [smallVideoUrl = "", largeVideoUrl = ""] } = { urls: [] },
          ] = [],
        } = video ?? {};

        const isYoutubeVideo =
          smallVideoUrl.includes("youtube") ||
          largeVideoUrl.includes("youtube");

        let youtubeVideoId = "";
        if (isYoutubeVideo) {
          const splittedUrl = smallVideoUrl.split("/");
          youtubeVideoId = splittedUrl[splittedUrl.length - 1];
        }

        return {
          ...video,
          indexNo: len + index,
          id: `${videoId}-${len + index}`,
          playing: false,
          muted: len + index === 0 ? true : false,
          url: smallVideoUrl,
          thumbnailUrl: thumbnailUrl,
          isYoutubeVideo: isYoutubeVideo,
          youtubeVideoId: isYoutubeVideo ? youtubeVideoId : "",
          isHlsVideo: isHLSPotentially(smallVideoUrl),
        };
      });
  } catch (error) {
    console.error(error);
  }
};

function DeepLink() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const feedId: any = searchParams.get("id");
  const commentId: any = searchParams.get("comment");
  const [userData, setUserData]: any = useState("");
  const [comments, setComments]: any = useState(null);
  const [contentInfo, setContentInfo]: any = useState(null);
  const [data, setData]: any = useState(null);
  const [videoLikedByUser, setVideoLikedByUser]: any = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videos, setVideos] = useState<any>([]);

  const verticalPlayerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<any>();

  useEffect(() => {
    const localData = localStorage.getItem("userData");
    if (localData) {
      const user = JSON.parse(localStorage.getItem("userData") || "");
      setUserData(user);
    }

    async function fetchData() {
      try {
        var feedModuleObj = new gluedin.GluedInFeedModule();
        var videoModuleObj = new gluedin.GluedInVideosModule();
        var videoModuleResponse = await videoModuleObj.getVideoById(feedId);
        if (videoModuleResponse?.status === 200) {
          let videoData = videoModuleResponse.data.result;
          setComments(videoData?.posts);
          setContentInfo(videoData?.videoData);
          setData([videoData?.videoData]);

          console.log("getVideoById", videoData);

          let likedVideoIds = [videoData.videoData.videoId];
          if (likedVideoIds && likedVideoIds.length > 0) {
            let accessToken = new gluedin.GluedInAuthModule().getAccessToken();
            accessToken
              .then(async (data: any) => {
                if (data) {
                  let likeVideosResponse = await feedModuleObj.Like(
                    likedVideoIds
                  );
                  if (
                    likeVideosResponse.status == 200 ||
                    likeVideosResponse.status == 201
                  ) {
                    let likedVideos = likeVideosResponse.data.result;
                    setVideoLikedByUser(likedVideos);
                  }
                }
              })
              .catch((error: any) => {
                console.error(error);
              });
          }

          const videosData = [
            ...getVideosData(
              [videoData?.videoData],
              [videoData?.videoData].length
            ),
          ];
          videosData
            .filter((video: any) => video.contentType === "video")
            .map((video: any, index: number) => {
              const {
                contentUrls: [
                  { urls: [smallVideoUrl = "", largeVideoUrl = ""] } = {
                    urls: [],
                  },
                ] = [],
              } = video ?? {};
            });
          setVideos(videosData);

          videoRefs.current = [
            ...videosData.map(() => createRef<HTMLDivElement>()),
          ];
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (feedId) {
      fetchData();
    }
  }, [feedId]);

  return (
    <>
      <div className="full-sec">
        <div className="left-sec">
          <Sidebar />
        </div>
        <div className="mid-content">
          <div
            ref={verticalPlayerRef}
            id="vertical-player"
            className="player_wrapper"
          >
            {videos.map((video: any, index: number) => (
              <VideoItem
                ref={videoRefs.current[index]}
                video={video}
                key={video.videoId}
                setVideos={setVideos}
                setCurrentVideoIndex={setCurrentVideoIndex}
                allVideoRefs={videoRefs}
                // commentId={commentId}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DeepLink;
