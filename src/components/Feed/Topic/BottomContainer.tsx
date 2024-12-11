import { useLoginModalContext } from "../../../contexts/LoginModal";
import Comments from "../../common/Comments";
import Share from "../Share";
import { convertKToNumeric, formatLargeNumber, isLoggedin } from "./helpers";
import gluedin from "gluedin-shorts-js";
import React, { useState } from "react";

const activityTimelineModule = new gluedin.GluedInActivityTimeline();

const BottomContainer = ({
  contentInfo,
  videoLikedByUser,
  toggleReportModal,
}: any) => {
  const [reportPost, setReportPost] = useState(false);

  const { setShowLoginModal } = useLoginModalContext();

  let likeByuser =
    videoLikedByUser.indexOf(contentInfo.videoId) > -1
      ? "active likedByUser"
      : "";

  const isUserIdSame =
    JSON.parse(localStorage.getItem("userData") || "{}")?.userId ===
    contentInfo.userId;

  const handleLikeEvent = async (e: any, videoId: string) => {
    e.preventDefault();
    const selfTarget = e.currentTarget;
    const likeElement: any = document.getElementById("like-count-" + videoId);
    const videoLikedByMe = selfTarget.classList.contains("active");
    const isUserLoggedIn = await isLoggedin();
    if (!isUserLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (videoLikedByMe) {
      const userPostedComment =
        await activityTimelineModule.activityTimelineUnLike({
          assetId: videoId,
        });
      const { status } = userPostedComment ?? {};
      if (status === 200) {
        selfTarget.classList.remove("active");
        let likeNumber: any = convertKToNumeric(likeElement.innerHTML);
        likeNumber--;
        likeNumber = likeNumber >= 0 ? likeNumber : 0;
        const likeCount = formatLargeNumber(likeNumber);
        likeElement.innerHTML = likeCount;
      }
    } else {
      activityTimelineModule
        .activityTimelineLike({ assetId: videoId })
        .then((response: any) => {
          const { status } = response ?? {};
          if (status === 200) {
            selfTarget.classList.add("active");
            let likeNumber: any = convertKToNumeric(likeElement.innerHTML);
            likeNumber++;
            let likeCount = formatLargeNumber(likeNumber);
            likeElement.innerHTML = likeCount;
            return;
          }
        });
    }
  };

  const toggleReportPost = async () => {
    const isUserLoggedIn = await isLoggedin();
    if (isUserLoggedIn) {
      setReportPost((state) => !state);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <div className="post-slider-box-bottom">
        <div className="strip">
          <ul className="post-slider-box-bottom-ul">
            <li>
              <a
                href="#"
                className={`like-video ${likeByuser} like-post-${contentInfo?.videoId}`}
                data-videoid={contentInfo.videoId}
                onClick={(e) => handleLikeEvent(e, contentInfo?.videoId)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 33.899 30.435"
                >
                  <path
                    id="Heart"
                    d="M129.908,216.734a8.443,8.443,0,0,0-6.28-2.734,7.9,7.9,0,0,0-4.934,1.7,10.08,10.08,0,0,0-1.995,2.083A10.091,10.091,0,0,0,114.7,215.7a7.9,7.9,0,0,0-4.933-1.7,8.444,8.444,0,0,0-6.281,2.734,9.814,9.814,0,0,0-2.491,6.7,11.687,11.687,0,0,0,3.114,7.65,66.4,66.4,0,0,0,7.8,7.317c1.08.92,2.3,1.964,3.576,3.076a1.843,1.843,0,0,0,2.427,0c1.271-1.111,2.5-2.156,3.577-3.077a66.366,66.366,0,0,0,7.8-7.316,11.686,11.686,0,0,0,3.114-7.65,9.814,9.814,0,0,0-2.491-6.7Zm0,0"
                    transform="translate(-99.75 -212.75)"
                    fill="none"
                    stroke="#777"
                    strokeWidth="2.5"
                  />
                </svg>
                <span
                  className={`like-count`}
                  id={`like-count-${contentInfo?.videoId}`}
                >
                  {" "}
                  {formatLargeNumber(contentInfo.likeCount)}
                </span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0);">
                <img src="./gluedin/images/comment.svg" alt="commentIcon" />
                <span className="comment-count">
                  {formatLargeNumber(contentInfo.commentCount)}
                </span>
              </a>
            </li>
            <li>
              <Share contentInfo={contentInfo} />
            </li>
            <li className="feed-options float-r" onClick={toggleReportPost}>
              {!isUserIdSame && (
                <button className="vert-dots">
                  <img
                    src="/gluedin/images/blue-dot.svg"
                    className="dot-options"
                    alt=""
                  />
                </button>
              )}
              {reportPost && (
                <ul className="dot-suboption">
                  <li onClick={() => toggleReportModal()}>
                    <a
                      href="javascript:void(0);"
                      className="report-button"
                      data-action="video"
                    >
                      <span>
                        <i
                          className="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                      </span>
                      Report Post
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
        <Comments contentInfo={contentInfo} />
      </div>
    </>
  );
};

export default BottomContainer;
