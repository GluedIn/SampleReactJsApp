import { getLocalisedText } from "../../../Helper/helper";
import CustomModal from "../CustomModal/CustomModal";
import LoaderDark from "../LoaderDark/LoaderDark";
import gluedin from "gluedin-shorts-js";
// import CommonModal from "../Modal";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const FollowModal = ({ show, onHide, type, userData }: any) => {
  const [usersData, setUsersData]: any = useState({ [type]: [] });
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const {
    userId,
    followersCount: followers,
    followingCount: following,
  } = userData ?? {};

  const modalType = type === "following" ? "Following" : "Followers";

  const isDataToFetch = (() => {
    return (
      (type === "following" && following > 0) ||
      (type === "followers" && followers > 0)
    );
  })();

  const data = usersData[type];

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const userModuleObj = new gluedin.GluedInUserModule();
      let followResponse: any = {};
      if (type === "following") {
        followResponse = await userModuleObj.getFollowingList({
          userId: userId,
        });
      } else {
        followResponse = await userModuleObj.getFollowerList({
          userId: userId,
        });
      }
      if (followResponse.status === 200) {
        setUsersData({ [type]: followResponse.data.result });
        setIsLoading(false);
      }
    }
    if (type && isDataToFetch && !data?.length) {
      getData();
    }
  }, [type]);

  const handleModalClose = () => {
    onHide();
    // setUsersData([]);
  };

  return (
    <CustomModal
      isOpen={show}
      close={handleModalClose}
      classes={"follow-modal"}
    >
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-2 min-h-[50px]">
          <LoaderDark />
          <div>Loading {modalType}...</div>
        </div>
      )}
      {!data?.length && !isLoading && <h4>No {modalType}</h4>}
      {data?.length > 0 &&
        data.map((user: any) => {
          const { userId, userName, fullName, profileImageUrl } = user;
          return (
            <a href={`/profile/${userId}`}>
              <div key={userId} className="follower-list">
                <div className="left-wrapper">
                  <div className="profile-img">
                    <img src={profileImageUrl} alt={`${userName}-profile`} />
                  </div>
                  <div className="user-info">
                    <h5>{getLocalisedText({ fullName }, "fullName")}</h5>
                    <h6>{userName}</h6>
                  </div>
                </div>
                {false && (
                  <div className="right-wrapper">
                    <button className="follow-profile" id={userId}>
                      {t("follow-btn")}
                    </button>
                  </div>
                )}
              </div>
            </a>
          );
        })}
    </CustomModal>
  );
};

FollowModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  type: PropTypes.string,
  userData: PropTypes.object,
};

export default FollowModal;
