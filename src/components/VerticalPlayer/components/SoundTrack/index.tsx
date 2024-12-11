import LeftArrowIcon from "../../../../assets/icons/LeftArrowIcon";
import { CONTENT_TYPE } from "../../../../constants";
import useSound from "../../../../hooks/useSound";
import Bottom from "../../../Layouts/Bottom";
import Sidebar from "../../../Layouts/Sidebar";
import "./SoundTrack.css";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function SoundTrack() {
  const { soundId } = useParams();
  const navigate = useNavigate();
  const { sound, videos: videosBySound }: any = useSound(soundId as string);

  const handleContentDetail = (video: any, index: number) => {
    navigate(
      `/content/${soundId}?contentType=${CONTENT_TYPE.SOUND}&clickedVideoId=${video.videoId}`
    );
  };

  return (
    <>
      <div className="full-sec">
        <div className="left-sec">
          <Sidebar />
        </div>
        <div className="right-sec">
          <div className="mainpage">
            <div className="back-btn">
              <button className="back-btn-a" onClick={() => navigate(-1)}>
                <LeftArrowIcon />
                <div>Back</div>
              </button>
            </div>
            <div className="mainpage-head">
              <div className="sound-image">
                <img src={sound?.thumbnail} alt={`${sound?.name}-thumbnail`} />
              </div>
              <h2 className="sound-title">{sound?.name}</h2>
              <p className="sound-artist">{sound?.artist}</p>
              <audio src={sound?.soundUrl} controls></audio>
            </div>
            <div className="mainpage-body">
              <div className="flex flex-col gap-y-[2rem] justify-center items-center">
                <div
                  className="grid grid-cols-12 gap-y-[2rem] gap-x-[1rem]"
                  id="tab1"
                >
                  {videosBySound?.map((video: any, index: number) => {
                    let thumbnailUrls = video.thumbnailUrls
                      ? video.thumbnailUrls[0]
                      : video.thumbnailUrl;
                    if (video.contentType === "video") {
                      return (
                        <>
                          <div
                            className="col-span-6 lg:col-span-2"
                            key={video.videoId}
                          >
                            <div
                              className="relative cursor-pointer"
                              id={video.videoId}
                            >
                              {/* Video Image */}
                              <img
                                src={thumbnailUrls}
                                alt=""
                                className="w-full h-full aspect-[9/16] object-cover object-center rounded-md"
                                onClick={() =>
                                  handleContentDetail(video, index)
                                }
                              />

                              {/* Video Views & Like Count */}
                              {/* <div className="video_detail">
                                <div className="video_info videoViews">
                                  <VideoViewsIcon />
                                  <span className="video_info--count">
                                    {formatLargeNumber(video.viewsCount)}
                                  </span>
                                </div>

                                <div className="video_info videoLike">
                                  <VideoLikeIcon />
                                  <span className="video_info--count">
                                    {formatLargeNumber(video.likeCount)}
                                  </span>
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Bottom />
    </>
  );
}

export default SoundTrack;
