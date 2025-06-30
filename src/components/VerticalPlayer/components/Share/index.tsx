import { CONTENT_TYPE, EVENTS } from "../../../../constants";
import { useNotification } from "../../../../contexts/Notification";
import useAnalytics from "../../../../hooks/useAnalytics";
import CustomModal from "../../../common/CustomModal/CustomModal";
import CopyLink from "../../Icons/CopyLink";
import Facebook from "../../Icons/Facebook";
import LinkedIn from "../../Icons/LinkedIn";
import Twitter from "../../Icons/Twitter";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Share({
  video,
  show,
  handleClose,
  shareType,
  currentStory,
}: {
  video?: any;
  show: boolean;
  handleClose: () => void;
  shareType?: string;
  currentStory?: any;
}) {
  const [isRtl, setIsRtl] = useState(false);
  const { trackEvent } = useAnalytics();
  const { showNotification, closeNotification } = useNotification();
  const { t } = useTranslation();
  let usedHashTagTitle: any;
  let websiteUrl: any;

  if (shareType !== "story" || !shareType) {
    usedHashTagTitle = Array.isArray(video.hashtagTitles)
      ? video.hashtagTitles.join(",")
      : "";

    websiteUrl = `${window.location.origin}/content/${video?.videoId}?contentType=${CONTENT_TYPE.SHARE}`;
  } else if (shareType === "story") {
    websiteUrl = `${window.location.origin}/story-view/${currentStory?.userId}?type=profile`;
  }

  const SHARE_PLATFORMS = [
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook />,
      url: `https://www.facebook.com/sharer.php?u=${websiteUrl}`,
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: <Twitter />,
      url: `https://twitter.com/intent/tweet?url=${websiteUrl}&text=${video?.description}&hashtags=${usedHashTagTitle}&`,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: <LinkedIn />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${websiteUrl}`,
    },
    {
      id: "copy-link",
      name: "Copy Link",
      icon: <CopyLink />,
      url: ``,
    },
  ];

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification({
        title: "Link copied",
        subTitle: "Link copied to clipboard",
      });
    } catch (err) {
      console.error("Failed to copy text:", err);
    } finally {
      setTimeout(() => closeNotification(), 3000);
    }
  };

  const handleIconClick = (url: any) => {
    trackEvent({ event: EVENTS.CONTENT_SHARE, content: video });
    if (!url) {
      handleCopy(websiteUrl);
    } else {
      window.open(url, "_blank");
    }
    handleClose();
  };

  useEffect(() => {
    const directionElement = document.getElementById("direction");
    if (directionElement && directionElement.getAttribute("dir") === "rtl") {
      setIsRtl(true);
    }
  }, []);

  return (
    <>
      <CustomModal isOpen={show} close={handleClose}>
        <div className={`share_wrapper ${isRtl ? "share_modal-rtl" : ""}`}>
          <h2 className="modal-title">{t("label-share")}</h2>
          <div className="share_content">
            {SHARE_PLATFORMS.map((platform) => (
              <div
                key={platform.name}
                className={`${platform.name.toLowerCase()}_icon`}
              >
                <button
                  className="share-icon-button"
                  onClick={() => handleIconClick(platform.url)}
                >
                  {platform.icon}
                </button>
                <span>{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CustomModal>
    </>
  );
}
