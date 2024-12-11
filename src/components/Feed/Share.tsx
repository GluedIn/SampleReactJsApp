import React, { useState } from "react";

const Share = ({ contentInfo }: any) => {
  const [showShare, setShowShare] = useState(false);

  const usedHashTagTitle = Array.isArray(contentInfo.hashtagTitles)
    ? contentInfo.hashtagTitles.join(",")
    : "";

  const websiteUrl =
    window.location.origin + "/content/" + contentInfo?.videoId;

  const icons = [
    {
      url: `https://www.facebook.com/sharer.php?u=${websiteUrl}`,
      className: "fa fa-facebook",
    },
    {
      url: `https://twitter.com/intent/tweet?url=${websiteUrl}&text=${contentInfo.description}&hashtags=${usedHashTagTitle}&`,
      className: "fa fa-twitter",
    },
    {
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${websiteUrl}`,
      className: "fa fa-linkedin",
    },
  ];

  const handleIconClick = (url: any) => {
    window.open(url, "_blank");

    setShowShare(false);
  };

  return (
    <>
      <button
        className="like-video social-share-options"
        onClick={() => setShowShare((prev) => !prev)}
      >
        <i className="fa fa-share-alt"></i>
      </button>
      {showShare && (
        <ul className="social-share">
          {icons.map((icon) => (
            <li key={icon.className} onClick={() => handleIconClick(icon.url)}>
              <button className="share-icon-button">
                <i className={`${icon.className} share-icon`}></i>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Share;
