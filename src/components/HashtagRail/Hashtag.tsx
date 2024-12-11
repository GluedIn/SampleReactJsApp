import { CONTENT_TYPE, EVENTS } from "../../constants";
import useAnalytics from "../../hooks/useAnalytics";
import Loader from "../common/Loader";
import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Hashtag() {
  const [hashtagDetail, seHashtagDetail]: any = useState(null);
  const { hashtagName } = useParams();
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    async function fetchData() {
      try {
        const hashTagModuleObj = new gluedin.GluedInHashTag();
        let limit = 10;
        let offset = 1;
        const hashTagResponse = await hashTagModuleObj.getHashTagDetails({
          limit: limit,
          offset: offset,
          name: hashtagName,
        });
        if (hashTagResponse?.status === 200)
          seHashtagDetail(hashTagResponse.data.result);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [hashtagName]);

  if (!hashtagDetail) return <Loader />;

  const handleContentDetail = (contentInfo: any, index: number) => {
    trackEvent({
      event: EVENTS.THUMBNAIL_CLICK,
      content: { ...contentInfo, horizontalIndex: index, verticalIndex: 0 },
    });
    navigate(
      `/content/${hashtagName}?contentType=${CONTENT_TYPE.HASHTAG}&clickedVideoId=${contentInfo._id}`
    );
  };

  return (
    <div className="full-box profile-full-box">
      <div className="profile-page-head">
        <ul className="profile-page-head-ul list-none">
          <li className="profile-page-head-avatar">
            <div className="img-sec">
              <img
                src={
                  hashtagDetail?.hashtag?.image ||
                  "https://d3ibngdlgwl8mp.cloudfront.net/hashtag/Hashtag.png"
                }
                id="profileImage"
                alt="hashtag-logo"
                className="bg-img-02 profileImage"
              />
            </div>
          </li>

          <li className="profile-page-head-content">
            <ul className="profile-page-head-content-inner">
              <li>
                <h4 id="displayName">{hashtagDetail?.hashtag?.title}</h4>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="inner-box arrival-box profile-videos">
        <div id="tabs-content">
          <div className="tab-content userVideoData" id="tab1">
            {hashtagDetail.videos.map((video: any, index: number) => {
              let thumbnailUrls = video.thumbnailUrls
                ? video.thumbnailUrls[0]
                : video.thumbnailUrl;
              return (
                <div className="box" key={video.videoId}>
                  <div
                    className="img-box open-video-detail"
                    id={video.videoId}
                    style={{
                      background: `url(${thumbnailUrls}) center`,
                      borderRadius: "8px",
                      backgroundSize: "cover",
                    }}
                    onClick={() => handleContentDetail(video, index)}
                  >
                    <span className="av-icon">
                      <img
                        src="/gluedin/images/folder-icon.svg"
                        alt="folder-icon"
                      />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hashtag;
