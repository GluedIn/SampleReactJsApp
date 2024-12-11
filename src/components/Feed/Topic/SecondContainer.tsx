import Follow from "./Follow";
import React, { useState } from "react";

const SecondContainer = ({ contentInfo }: any) => {
  const [showMore, setShowMore] = useState(false);

  const {
    title,
    description,
    user: { profileImageUrl, userId, fullName },
  } = contentInfo;

  const profilePictureUrl =
    profileImageUrl || "https://d3ibngdlgwl8mp.cloudfront.net/Profile.png";

  return (
    <div className="post-detail-box-parent second_div">
      <div className="post-detail-box">
        <div className="top-details">
          <ul>
            <li className="img-li">
              <div className="img-holder">
                <a href={"profile/" + userId}>
                  <img src={profilePictureUrl} alt="profile-icon" />
                </a>
              </div>
            </li>
            <li>
              <h3 className="ft-500">
                <a href={"profile/" + userId}>{fullName}</a>
              </h3>
            </li>
            <li>
              <Follow userId={userId} />
            </li>
          </ul>
          <div className="sml-text">{title}</div>
          <div className="c-text">
            {showMore ? description : `${description.substring(0, 100)}`}{" "}
            {description.length > 100 && (
              <>
                <a
                  href="javascript:void(0)"
                  className="text-b show-more-content"
                  onClick={() => setShowMore((prev) => !prev)}
                >
                  {showMore ? "Show Less" : "Show More"}
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondContainer;
