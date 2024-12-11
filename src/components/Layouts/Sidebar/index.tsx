import { getLocalisedText } from "../../../Helper/helper";
import DiscoverIcon from "../../../assets/icons/DiscoverIcon";
import HomeIcon from "../../../assets/icons/HomeIcon";
import LogoutIcon from "../../../assets/icons/LogoutIcon";
import NotificationIcon from "../../../assets/icons/NotificationIcon";
import ProfileIcon from "../../../assets/icons/ProfileIcon";
import { useLoginModalContext } from "../../../contexts/LoginModal";
import ShortsSdkVersion from "../../common/SDKVersion";
import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, Link } from "react-router-dom";

function Sidebar(props: any) {
  const { t } = useTranslation();
  const location = useLocation();
  const { showProfile = true } = props;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const navigate = useNavigate();
  const [userDetail, setUserDetail]: any = useState(null);
  const [userInfo, setUserInfo]: any = useState(false);
  const [editProfile, setEditProfile]: any = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const { setShowLoginModal } = useLoginModalContext();

  useEffect(() => {
    const accessToken = new gluedin.GluedInAuthModule().getAccessToken();
    accessToken
      .then((data: any) => {
        // handle success case
        if (data) {
          setIsLoggedin(true);
        }
      })
      .catch((error: any) => {
        // handle error case
        console.error(error);
      });
  }, []);
  useEffect(() => {
    async function userDetails() {
      var userModuleObj = new gluedin.GluedInUserModule();
      let userBasicInfo: any = localStorage.getItem("userData");
      let userId = "";
      if (userBasicInfo && userBasicInfo !== undefined) {
        userBasicInfo = JSON.parse(userBasicInfo);
        userId = userBasicInfo.userId;
      }
      var userModuleResponse = await userModuleObj.getUserDetails(userId);
      if (userModuleResponse.status === 200) {
        let userInfo = userModuleResponse.data.result;
        if (userInfo) {
          setUserInfo(true);
          setUserDetail(userInfo);
        }
      }
    }
    userDetails();
  }, []);

  const loginModalHandler = () => {
    props.loginHandler();
    setShowLoginModal(true);
  };

  const _navigateToProfile = () => {
    const accessToken = new gluedin.GluedInAuthModule().getAccessToken();
    accessToken
      .then((data: any) => {
        // handle success case
        if (!data) {
          // Show Login Modal
          loginModalHandler();
        } else {
          navigate("/my-profile");
        }
      })
      .catch((error: any) => {
        // handle error case
        console.error(error);
      });
  };

  const _navigateToNotification = () => {
    const accessToken = new gluedin.GluedInAuthModule().getAccessToken();
    accessToken
      .then((data: any) => {
        // handle success case
        if (!data) {
          // Show Login Modal
          //   setShowLoginModal(true);
          loginModalHandler();
        } else {
          navigate("/notification");
        }
      })
      .catch((error: any) => {
        // handle error case
        console.error(error);
      });
  };

  const toggleEditProfilePanel = () => {
    setEditProfile(true);
    setShowOverlay(true);
  };
  const _logoutUser = () => {
    localStorage.removeItem("following");
    localStorage.removeItem("userData");
    localStorage.removeItem("userDetails");
    navigate("/sign-in");
  };
  return (
    <>
      <div className="sidebar_wrapper">
        <div className="sidebar">
          {userInfo && showProfile && (
            <ul className="home-profile-info profile-page-head-ul list-none">
              <li className="profile-page-head-avatar">
                <div className="img-sec">
                  <img
                    src={
                      userDetail?.profileImageUrl
                        ? userDetail.profileImageUrl
                        : "/gluedin/images/Profile.png"
                    }
                    id="profileImage"
                    className="bg-img-02 profileImage"
                    alt=""
                  />
                </div>
              </li>
              <li className="home-head profile-page-head-content">
                <ul className="user-info profile-page-head-content-inner">
                  <li>
                    <h4 id="displayName">
                      {getLocalisedText(userDetail, "fullName")}
                    </h4>
                    <h5 id="userId">{userDetail?.userName}</h5>
                    <div className="desk-none">
                      <a href="javascript:void(0)" className="res-edit">
                        Edit
                      </a>
                    </div>
                  </li>
                </ul>
                <ul className="followers-info profile-page-head-content-inner">
                  <li>
                    <h5>{t("profile-followers")}</h5>
                    <span id="followerCount">
                      {userDetail?.followersCount || 0}
                    </span>
                  </li>
                  <li>
                    <h5>{t("profile-following")}</h5>
                    <span id="followingCount">
                      {userDetail?.followingCount || 0}
                    </span>
                  </li>
                  <li>
                    <h5>{t("profile-posts")}</h5>
                    <span id="videoCount">{userDetail?.videoCount}</span>
                  </li>
                </ul>
              </li>
            </ul>
          )}
          <ul className="sidebar-ul">
            <li
              className={
                location.pathname === "/vertical-player" ? "active" : ""
              }
            >
              <Link to="/vertical-player">
                <HomeIcon />
                {t("home")}
              </Link>
            </li>

            <li className={location.pathname === "/discover" ? "active" : ""}>
              <Link to="/discover">
                <DiscoverIcon />
                {t("discover")}
              </Link>
            </li>

            <li
              className={location.pathname === "/notification" ? "active" : ""}
            >
              <Link
                to="javascript:void(0)"
                className="go-to-notification"
                onClick={_navigateToNotification}
              >
                <NotificationIcon />
                {t("notifications")}
              </Link>
            </li>

            <li className={location.pathname === "/my-profile" ? "active" : ""}>
              <Link
                to="javascript:void(0)"
                className="go-to-user-profile"
                onClick={_navigateToProfile}
              >
                <ProfileIcon />
                {t("profile")}
              </Link>
            </li>
            {isLoggedin && (
              <li onClick={_logoutUser}>
                <a href="javascript:void(0)" className="user-sign-out">
                  <LogoutIcon />
                  {t("text-logout")}
                </a>
              </li>
            )}
          </ul>
          {isLoggedin && (
            <Link
              to="/create-post"
              className="go-to-page-create-content content-btn"
            >
              {t("btn-createContent")}
              <img src="/gluedin/images/circle+.svg" alt="" />
            </Link>
          )}
        </div>
      </div>

      <ShortsSdkVersion />

      {/* {showLoginModal && (
        <LoginModal
          show={showLoginModal}
          handleClose={() => setShowLoginModal(false)}
        />
      )} */}
    </>
  );
}

export default Sidebar;
