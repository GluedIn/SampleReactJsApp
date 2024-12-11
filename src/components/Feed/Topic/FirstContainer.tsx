import Products from "./Products";
import gluedin from "gluedin-shorts-js";
import React, { useState } from "react";

const playerIconHtml = '<i class="fa fa-play"></i>';

const FirstContainer = ({ contentInfo }: { contentInfo: any }) => {
  const {
    contentUrls: [{ urls: contentUrls }],
    downloadUrl,
  } = contentInfo;
  const [isPlayerActive, setIsPlayerActive] = useState(false);

  const [currentVideo, setCurrentVideo] = useState({
    url: null,
    isPlaying: false,
    muted: false,
    id: null,
  });

  const playbackUrl = (() => {
    if (!contentUrls.length) return downloadUrl;
    return contentUrls[contentUrls.length - 1];
  })();

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

  const _onPlay = (event: any) => {
    let assetId: string = event.target.id;
    assetId = assetId.replace("videoPlayer_", "");
    var activityTimelineModuleObj = new gluedin.GluedInActivityTimeline();
    activityTimelineModuleObj
      .activityTimelineView({ assetId: assetId })
      .then((response: any) => {
        // write your logic here
        console.log("userViewed === ", response);
      });
  };

  return (
    <div className="post-box-parent first_div">
      <div className="post-slider-box-parent">
        <div className="icon_wrapper">
          <i className="fa fa-heart"></i>
          <i className="fa fa-share-alt"></i>
          <i className="fa fa-comment"></i>
          <i className="fa fa-heart"></i>
          <i className="fa fa-heart"></i>
        </div>
        <div className="post-slider-box-02 video video-player">
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
        </div>
        <Products contentInfo={contentInfo} />
      </div>
    </div>
  );
};

export default FirstContainer;
