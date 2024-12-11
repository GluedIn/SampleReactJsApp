import RepostFilledIcon from "../../../../assets/icons/RepostFilledIcon";
import RepostGrayIcon from "../../../../assets/icons/RepostGrayIcon";
import { STATUS } from "../../../../constants";
import { useLoginModalContext } from "../../../../contexts/LoginModal";
import { useNotification } from "../../../../contexts/Notification";
import CustomModal from "../../../common/CustomModal/CustomModal";
import gluedin from "gluedin-shorts-js";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const feedModule = new gluedin.GluedInFeedModule();

const getRepostPayloadData = (video: any) => {
  return {
    userId: video.userId,
    contentType: video.contentType,
    taggedUsers: video.taggedUsers,
    s3Url: video.url,
    contentUrl: video.contentUrls,
    title: video.title,
    videoCoverImage: video.thumbnailUrl,
    thumbnailUrl: video.thumbnailUrl,
    description: video.description,
    follow: false,
    type: "repost",
    categoryId: video.categoryId,
    categoryName: video.categoryId,
    soundId: video.soundId,
    filterId: "",
    filterDisplayName: "",
    metaKeys: "",
    businessId: "",
    projectId: "",
    loc: [],
    lang: [],
    labels: [],
    question: "",
    options: [
      {
        title: "",
      },
    ],
    localisedTitle: video.localisedTitle,
    localisedDescription: video.localisedDescription,
    repost: true,
    originalVideoId: video.videoId,
    commentEnabled: video.commentEnabled,
    likeEnabled: video.likeEnabled,
    shareEnabled: video.shareEnabled,
    soundName: video.soundName,
  };
};

export default function RepostModal({ show, onHide, video }: any) {
  const { setShowLoginModal } = useLoginModalContext();
  const navigate = useNavigate();
  const { repost, repostCount, user } = video;
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const { userId } = user ?? {};
  const [repostCounts, setRepostCounts] = useState(repostCount);

  const [isReposting, setIsReposting] = useState(false);
  const [isRepostingWithThoughts, setIsRepostingWithThoughts] = useState(false);
  const { showNotification } = useNotification();
  const [videoRepost, setVideoRepost] = useState(repost);

  const isLoggedin = async () => {
    const accessToken = await new gluedin.GluedInAuthModule().getAccessToken();
    if (accessToken) {
      return true;
    } else {
      return false;
    }
  };

  const incrementCount = () => {
    setRepostCounts((prev: number) => prev + 1);
  };

  const handleRepost = async () => {
    const isUserLoggedIn = await isLoggedin();
    if (isUserLoggedIn) {
      if (video.repost) {
        showNotification({
          title: "Repost",
          subTitle: "Video already reposted",
        });
        return;
      }

      setIsReposting(true);
      const repostPayloadData = getRepostPayloadData(video);
      try {
        const {
          data: { success, status },
        } = await feedModule.uploadContent(repostPayloadData);
        if (success) {
          onHide();
          setVideoRepost(true);
          incrementCount();
          showNotification({
            title: "Repost",
            subTitle: "Repost has been successfully",
          });
        } else {
          if (status === STATUS.VIDEO_ALREADY_REPOSTED) {
            showNotification({
              title: "Repost",
              subTitle: "Video already reposted",
            });
          }
        }
        setIsReposting(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const handleRepostWithThoughts = async () => {
    const isUserLoggedIn = await isLoggedin();
    if (isUserLoggedIn) {
      if (video.repost || videoRepost) {
        showNotification({
          title: "Repost",
          subTitle: "Video already reposted",
        });
        return;
      } else {
        setIsRepostingWithThoughts(true);
        sessionStorage.setItem("videoUrls", JSON.stringify([video.url]));
        sessionStorage.setItem("blobUrls", JSON.stringify([video.url]));
        navigate(`/create-post-page-02?repost=true`);
        incrementCount();
        setIsRepostingWithThoughts(false);
      }
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <CustomModal isOpen={show} close={onHide}>
        <div className="repost_actions">
          <button
            className="repost_actions-btn"
            onClick={handleRepostWithThoughts}
          >
            <div className="btn-wrap">
              <span>
                <RepostFilledIcon />
              </span>
              <div>
                {isRepostingWithThoughts
                  ? "Reposting With Thoughts..."
                  : "Repost with your thoughts"}
              </div>
            </div>
          </button>
          <button className="repost_actions-btn" onClick={handleRepost}>
            <div className="btn-wrap">
              <span>
                <RepostGrayIcon />
              </span>
              <div>{isReposting ? "Reposting..." : "Repost"}</div>
            </div>
          </button>
        </div>
      </CustomModal>
    </>
  );
}
