import { getLocalisedText } from "../../Helper/helper";
import DotGrayIcon from "../../assets/icons/DotGrayIcon";
import LeftArrowIcon from "../../assets/icons/LeftArrowIcon";
import RepostIconWhite from "../../assets/icons/RepostIconWhite";
import { CONTENT_TYPE } from "../../constants";
import { useTheme } from "../../contexts/Theme";
import DeleteAccountModal from "../Login-UI/DeleteAccountModal";
import CloseIcon from "../VerticalPlayer/Icons/Close";
import EditIcon from "../VerticalPlayer/Icons/Edit";
import FollowModal from "../common/FollowModal";
import Loader from "../common/Loader";
import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const { t, i18n } = useTranslation();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const navigate = useNavigate();
  const [userDetail, setUserDetail]: any = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [userId, setUserId]: any = useState("");
  const [editProfile, setEditProfile]: any = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [editAccountSetting, setEditAccountSetting] = useState(false);
  const [editMobileSetting, setEditMobileSetting] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [language, setLanguage] = useState(false);
  const [chooseTheme, setChooseTheme] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [showDeleteAccountModal, setDeleteAccountModal] = useState(false);
  const [followModal, setFollowModal] = useState({ show: false, type: "" });
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    description: "",
    profileImageUrl: "",
  });
  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: "",
    newPassword: "",
    cpassowrd: "",
  });
  const [deleteAccountFormData, setDeleteAccountFormData] = useState({
    password: "",
  });
  const [errors, setErrors]: any = useState({});
  const [success, setSuccess]: any = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const hiddenFileInput: any = React.useRef(null);

  useEffect(() => {
    let userBasicInfo: any = localStorage.getItem("userData");
    if (userBasicInfo && userBasicInfo !== undefined) {
      userBasicInfo = JSON.parse(userBasicInfo);
      setUserId(userBasicInfo.userId);
    }
  }, []);

  useEffect(() => {
    async function fetchData(userId: string) {
      setIsLoading(true);
      try {
        let userModuleObj = new gluedin.GluedInUserModule();
        let userModuleResponse = await userModuleObj.getUserDetails(userId);
        if (userModuleResponse.status === 200) {
          let userInfo = userModuleResponse.data.result;
          setUserDetail(userInfo);
          setFormData({
            fullName: userInfo?.fullName,
            userName: userInfo?.userName,
            description: userInfo?.description,
            profileImageUrl: userInfo?.profileImageUrl,
          });
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }

    async function fetchVideos(userId: string) {
      setIsLoading(true);
      try {
        let userModuleObj = new gluedin.GluedInUserModule();
        var userVideoModuleResponse = await userModuleObj.getUserVideoList({
          userId: userId,
          offset: page,
          limit: 10,
        });
        if (userVideoModuleResponse.status === 200) {
          let videoList = userVideoModuleResponse.data.result;
          setUserVideos(videoList);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }
    if (userId) {
      fetchVideos(userId);
      fetchData(userId);
    }
  }, [userId]);

  const toggleMoreOptions = () => {
    setEditMobileSetting(!showMoreOptions);
  };
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleInputChangeForPassword = (event: any) => {
    const { name, value } = event.target;
    setPasswordFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleInputChangeForDeleteAccountPassword = (event: any) => {
    const { name, value } = event.target;
    setDeleteAccountFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const toggleEditProfilePanel = () => {
    setEditProfile(true);
    setShowOverlay(true);
  };

  const toggleEditAccountSettingPanel = () => {
    setEditAccountSetting(true);
    setShowOverlay(true);
  };

  const toggleCloseEditAccountSettingPanel = () => {
    setEditAccountSetting(true);
    setChangePassword(false);
    setLanguage(false);
    setChooseTheme(false);
    setDeleteAccount(false);
  };

  const toggleChangePasswordPanel = () => {
    setChangePassword(true);
    setShowOverlay(true);
  };

  const toggleLanguagePanel = () => {
    setLanguage(true);
    setShowOverlay(true);
  };

  const toggleThemePanel = () => {
    setChooseTheme(true);
    setShowOverlay(true);
  };

  const toggleDeleteAccountPanel = () => {
    setDeleteAccount(true);
    setShowOverlay(true);
  };

  const handleCloseEditProfilePanel = () => {
    setEditProfile(false);
    setShowOverlay(false);
  };

  const handleCloseAccountSettingPanel = () => {
    setEditAccountSetting(false);
    setShowOverlay(false);
    setEditMobileSetting(false);
  };

  const handleCloseChangePasswordPanel = () => {
    setEditAccountSetting(false);
    setChangePassword(false);
    setShowOverlay(false);
  };

  const handleCloseLanguagePanel = () => {
    setEditAccountSetting(false);
    setLanguage(false);
    setShowOverlay(false);
  };

  const handleCloseThemePanel = () => {
    setEditAccountSetting(false);
    setChooseTheme(false);
    setShowOverlay(false);
  };

  const handleCloseSidePanel = () => {
    setEditAccountSetting(false);
    setDeleteAccount(false);
    setShowOverlay(false);
  };

  const userSignout = () => {
    localStorage.removeItem("following");
    localStorage.removeItem("userData");
    localStorage.removeItem("userDetails");
    navigate("/sign-in");
  };

  const _logoutUser = () => {
    localStorage.removeItem("following");
    localStorage.removeItem("userData");
    localStorage.removeItem("userDetails");
    navigate("/sign-in");
  };

  const updateProfile = async () => {
    var userModuleObj = new gluedin.GluedInUserModule();
    var userModuleResponse = await userModuleObj.editUserProfile(formData);
    if (userModuleResponse.status === 200) {
      setSuccess({ sucessMessage: "Profile has been updated successfully!" });
      setErrors({});
      setTimeout(() => setSuccess({}), 5000);
    } else {
      setSuccess({});
      setErrors({ errorMessage: userModuleResponse?.data?.statusMessage });
      setTimeout(() => setErrors({}), 5000);
    }
  };

  const updatePassword = async () => {
    var userModuleObj = new gluedin.GluedInUserModule();
    var userModuleResponse = await userModuleObj.changePassword(
      passwordFormData
    );
    if (userModuleResponse.status === 200) {
      setPasswordFormData({ oldPassword: "", newPassword: "", cpassowrd: "" });
      setSuccess({
        sucessMessage: "Your password has been updated successfully!",
      });
      setErrors({});
      setTimeout(() => setSuccess({}), 5000);
    } else {
      setSuccess({});
      setErrors({ errorMessage: userModuleResponse?.data?.statusMessage });
      setTimeout(() => setErrors({}), 5000);
    }
  };

  const handleProfileImageClick = () => {
    hiddenFileInput.current.click();
  };
  const handleFileUploadChange = async (event: any) => {
    const fileUploaded = event.target.files[0];
    let toBase64String = await toBase64(fileUploaded);
    var userModuleObj = new gluedin.GluedInUserModule();
    var userModuleResponse = await userModuleObj.editUserProfileImage({
      baseString64: toBase64String,
    });
    if (
      userModuleResponse.status === 200 ||
      userModuleResponse.status === 201
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        profileImageUrl: userModuleResponse?.data?.result?.imageUrl,
      }));
      setUserDetail("");
      setUserDetail((prevUserDetail: any) => ({
        ...prevUserDetail,
        profileImageUrl: userModuleResponse?.data?.result?.imageUrl,
      }));
    } else {
      console.log("Something went wrong, please try again");
    }
  };

  const toBase64 = (file: any) => {
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleContentDetail = (contentInfo: any) => {
    navigate(
      `/content/${userId}?contentType=${CONTENT_TYPE.PROFILE}&clickedVideoId=${contentInfo._id}`
    );
  };

  const handleDeleteAccountSubmit = async (event: any) => {
    event.preventDefault();
    try {
      var email = JSON.parse(localStorage.getItem("userData") || "{}")?.email;
      const authLoginInput = new gluedin.GluedInAuthModule();
      const signInRawData = {
        email: email,
        password: deleteAccountFormData?.password,
        deviceId: "23424dsffsf",
        deviceType: "android",
      };
      const userSignInResponse = await authLoginInput.AuthRawData(
        signInRawData
      );
      if (userSignInResponse.status === 200) {
        setDeleteAccountModal(true);
      } else {
        deleteAccountFormData.password = "";
        setErrors({
          passwordErrorMessage: userSignInResponse?.data?.statusMessage,
        });
        setTimeout(() => setErrors({}), 5000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    const userModuleObj = new gluedin.GluedInUserModule();
    const deleteProfile = await userModuleObj.deleteUserProfile();
    if (deleteProfile.status === 200) {
      userSignout();
    }
  };

  const handleCloseDeleteAccountModal = () => {
    setDeleteAccountModal(false);
  };

  const changeLanguage = (language: any) => {
    setIsLoading((prev) => !prev);
    i18n.changeLanguage(language);
    localStorage.setItem("defaultLanguage", language);
    setSelectedLanguage(language);
    const targetElement = document.getElementById("direction");
    if (targetElement) {
      targetElement.setAttribute("dir", i18n.dir());
    }
    setEditAccountSetting(false);
    setLanguage(false);
    setShowOverlay(false);
    setIsLoading(false);
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="mobile-nav">
        <a
          href="javascript:void(0)"
          className="mobile-nav-toggle"
          onClick={toggleMoreOptions}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="6.302"
            height="25.21"
            viewBox="0 0 6.302 25.21"
          >
            <g
              id="_3_Blue_Dot"
              data-name="3 Blue Dot"
              transform="translate(6.302 25.21) rotate(-180)"
            >
              <g
                id="Group_124"
                data-name="Group 124"
                transform="translate(0 0)"
              >
                <path
                  id="Path_117"
                  data-name="Path 117"
                  d="M5.379.923a3.151,3.151,0,1,1-4.456,0,3.151,3.151,0,0,1,4.456,0"
                  transform="translate(0 0)"
                  fill="#03f"
                />
                <path
                  id="Path_118"
                  data-name="Path 118"
                  d="M5.379.923a3.151,3.151,0,1,1-4.456,0,3.151,3.151,0,0,1,4.456,0"
                  transform="translate(0 9.454)"
                  fill="#03f"
                />
                <path
                  id="Path_119"
                  data-name="Path 119"
                  d="M5.379.923a3.151,3.151,0,1,1-4.456,0,3.151,3.151,0,0,1,4.456,0"
                  transform="translate(0 18.907)"
                  fill="#03f"
                />
              </g>
            </g>
          </svg>
        </a>
      </div>
      <div
        className={`side-fixed-panel-inner account-setting ${
          editMobileSetting ? "open" : ""
        }`}
      >
        <ul className="panel-header">
          <li>
            <h4>{t("text-more")}</h4>
          </li>
          <li className="text-right">
            <button
              type="button"
              className="popup-close"
              onClick={handleCloseAccountSettingPanel}
            >
              <CloseIcon />
            </button>
          </li>
        </ul>
        <ul className="drop-menu">
          <li>
            <a
              href="javascript:void(0)"
              className="change-password"
              onClick={toggleChangePasswordPanel}
            >
              {t("text-changePassword")}
              <span>
                <i className="fa fa-angle-right"></i>
              </span>
            </a>
          </li>
          <li>
            <a
              href="javascript:void(0)"
              className="edit-profile"
              onClick={toggleEditProfilePanel}
            >
              {t("text-editProfile")}
              <span>
                <i className="fa fa-angle-right"></i>
              </span>
            </a>
          </li>
          <li>
            <a
              href={`/activity-timeline?tab=like`}
              className="activity-timeline"
            >
              {t("text-timeline")}
              <span>
                <i className="fa fa-angle-right"></i>
              </span>
            </a>
          </li>
          <li>
            <a
              href="javascript:void(0)"
              className=""
              onClick={toggleLanguagePanel}
            >
              {t("text-languages")}
              <span>
                <i className="fa fa-angle-right"></i>
              </span>
            </a>
          </li>
          <li>
            <a
              href="javascript:void(0)"
              onClick={toggleDeleteAccountPanel}
              className="delete-account"
            >
              {t("text-DeleteAccount")}
              <span>
                <i className="fa fa-angle-right"></i>
              </span>
            </a>
          </li>
          <li>
            <div className="logout">
              <input
                onClick={_logoutUser}
                type="submit"
                name=""
                value={t("text-logout") || ""}
                className="btn_submit"
              />
              <span>
                <i className="fa fa-angle-right"></i>
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div className="full-box profile-full-box">
        <div className="profile-page-head">
          <ul className="profile-page-head-ul list-none">
            <li className="profile-page-head-avatar">
              <div className="img-sec">
                <img
                  src={
                    userDetail?.profileImageUrl || "/gluedin/images/Profile.png"
                  }
                  id="profileImage"
                  className="bg-img-02 profileImage"
                />
                <span onClick={toggleEditProfilePanel}>
                  <svg
                    id="editIcon"
                    className="edit-profile"
                    xmlns="http://www.w3.org/2000/svg"
                    width="17.023"
                    height="17.023"
                    viewBox="0 0 17.023 17.023"
                  >
                    <path
                      id="Path_18515"
                      data-name="Path 18515"
                      d="M15.057,9.225l-1.34-1.34L4.895,16.709v1.34h1.34Zm1.34-1.34,1.34-1.34L16.4,5.206l-1.34,1.34ZM7.019,19.943H3V15.924L15.727,3.2a.947.947,0,0,1,1.34,0l2.679,2.679a.947.947,0,0,1,0,1.34Z"
                      transform="translate(-3 -2.919)"
                      fill="#03f"
                    />
                  </svg>
                </span>
              </div>
            </li>

            <li className="profile-page-head-content">
              <ul className="profile-page-head-content-inner">
                <li className="profile-page-info">
                  <h4 id="displayName">
                    {getLocalisedText(userDetail, "fullName")}
                  </h4>
                  <h5 id="userId">{userDetail?.userName}</h5>
                </li>

                <ul className="profile-page-list">
                  <li
                    role="button"
                    onClick={() => {
                      setFollowModal({ show: true, type: "followers" });
                    }}
                  >
                    <span id="followerCount">
                      {userDetail?.followersCount ?? 0}
                    </span>
                    <div className="font-medium">{t("profile-followers")}</div>
                  </li>
                  <li
                    role="button"
                    onClick={() => {
                      setFollowModal({ show: true, type: "following" });
                    }}
                  >
                    <span id="followingCount">
                      {userDetail?.followingCount ?? 0}
                    </span>
                    <div className="font-medium">{t("profile-following")}</div>
                  </li>

                  <li>
                    <span id="videoCount">{userDetail?.videoCount ?? 0}</span>
                    <div className="font-medium">{t("profile-posts")}</div>
                  </li>
                </ul>
              </ul>
              <div className="c-text text-blk mt-t-15" id="userDescription">
                {getLocalisedText(userDetail, "description")}
              </div>
            </li>
          </ul>
          <div className="profile-page-header">
            <div className="profile-page-header-dropdown web-view">
              <a href="javascript:void(0)" className="profile-page-header-icon">
                <DotGrayIcon />
              </a>
              <ul className="drop-menu">
                <li>
                  <a
                    href="javascript:void(0)"
                    className="edit-profile"
                    onClick={toggleEditProfilePanel}
                  >
                    {t("text-editProfile")}
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="account-setting"
                    onClick={toggleEditAccountSettingPanel}
                  >
                    {t("text-accountSetting")}
                  </a>
                </li>
                <li>
                  <a
                    href={`/activity-timeline?tab=like`}
                    className="activity-timeline"
                  >
                    {t("text-timeline")}
                  </a>
                </li>
                <li>
                  <a
                    href="javascript:void(0)"
                    className="user-sign-out"
                    onClick={userSignout}
                  >
                    {t("text-logout")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <FollowModal
          show={followModal.show}
          onHide={() => setFollowModal({ show: false, type: "" })}
          type={followModal.type}
          userData={userDetail}
        />
        <div className="inner-box arrival-box profile-videos">
          <div id="tabs-content">
            <div className="tab-content userVideoData" id="tab1">
              {userVideos.map((video: any) => {
                let thumbnailUrls = video.thumbnailUrls
                  ? video.thumbnailUrls[0]
                  : video.thumbnailUrl;
                if (video.contentType === "video") {
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
                        onClick={() => handleContentDetail(video)}
                      >
                        <span className="av-icon">
                          <img src="/gluedin/images/folder-icon.svg" alt="" />
                        </span>
                      </div>
                      {video?.repost && (
                        <div className="repost">
                          <RepostIconWhite />
                          <span className="repost-count">
                            {video?.repostCount}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div className="box">
                      <div
                        className="img-box open-video-detail text-wrapper"
                        style={{
                          background: "#fff",
                          borderRadius: "8px",
                        }}
                        id={video.videoId}
                      >
                        <span className="av-icon">
                          <img src="../gluedin/images/Text.svg" alt="" />
                        </span>
                        <p>{getLocalisedText(video, "description")}</p>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="side-fixed-panel">
        <div
          className={`side-fixed-panel-inner edit-profile-section ${
            editProfile ? "open" : ""
          }`}
        >
          <ul className="panel-header">
            <li>
              <h4>{t("text-editProfile")}</h4>
            </li>
            <li className="text-right">
              <button
                type="button"
                className="popup-close"
                onClick={handleCloseEditProfilePanel}
              >
                <CloseIcon />
              </button>
            </li>
          </ul>

          <div className="panel-profile">
            <div className="img-sec upload-profile-image">
              <img
                src={
                  userDetail?.profileImageUrl || "/gluedin/images/Profile.png"
                }
                className="profileImage bg-img-02"
                alt=""
              />
              <span onClick={handleProfileImageClick}>
                <EditIcon />
              </span>
            </div>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleFileUploadChange}
              name="profileImage"
              className="uploadProfileImage"
              accept=".jpeg,.jpg,.png"
              style={{ display: "none" }}
            />
          </div>

          <div className="panel-form profile-panel-form">
            {errors.errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errors.errorMessage}
              </div>
            )}
            {success.sucessMessage && (
              <div className="alert alert-success success-alert" role="alert">
                {success.sucessMessage}
              </div>
            )}

            <div className="custom-form-group first-input-box">
              <label>{t("full-name")}**</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="custom-form-group">
              <label>{t("user-name")}*</label>
              <input
                type="text"
                name="userName"
                value={formData?.userName}
                onChange={handleInputChange}
              />
            </div>

            <div className="custom-form-group">
              <label>{t("label-about")}</label>
              <textarea
                rows={4}
                name="description"
                value={formData?.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <input
              type="hidden"
              name="profileImageUrl"
              value={formData?.profileImageUrl}
            />
            <div className="custom-form-group custom-btn-group">
              <input
                type="submit"
                name="submit-profile"
                className="update-profile-info"
                value={t("btn-saveChanges") || ""}
                onClick={updateProfile}
              />
            </div>
          </div>
        </div>
        <div
          className={`side-fixed-panel-inner account-setting ${
            editAccountSetting ? "open" : ""
          }`}
        >
          <ul className="panel-header">
            <li>
              <h4>{t("text-accountSetting")}</h4>
            </li>
            <li className="text-right">
              <button
                type="button"
                className="popup-close"
                onClick={handleCloseAccountSettingPanel}
              >
                <CloseIcon />
              </button>
            </li>
          </ul>
          <ul className="drop-menu">
            <li className="active">
              <a
                type="button"
                className="change-password"
                onClick={toggleChangePasswordPanel}
              >
                {t("text-changePassword")}
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="15.555"
                    viewBox="0 0 16 15.555"
                  >
                    <path
                      id="Path_18543"
                      data-name="Path 18543"
                      d="M16.172,11H4v2H16.172l-5.364,5.363,1.414,1.414L20,12,12.222,4.222,10.808,5.636Z"
                      transform="translate(-4 -4.222)"
                    />
                  </svg>
                </span>
              </a>
            </li>
            <li className="active">
              <a
                href="javascript:void(0)"
                className="languages"
                onClick={toggleLanguagePanel}
              >
                {t("text-languages")}
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="15.555"
                    viewBox="0 0 16 15.555"
                  >
                    <path
                      id="Path_18543"
                      data-name="Path 18543"
                      d="M16.172,11H4v2H16.172l-5.364,5.363,1.414,1.414L20,12,12.222,4.222,10.808,5.636Z"
                      transform="translate(-4 -4.222)"
                    />
                  </svg>
                </span>
              </a>
            </li>
            <li className="active">
              <a
                href="javascript:void(0)"
                className="languages"
                onClick={toggleThemePanel}
              >
                Choose Theme
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="15.555"
                    viewBox="0 0 16 15.555"
                  >
                    <path
                      id="Path_18543"
                      data-name="Path 18543"
                      d="M16.172,11H4v2H16.172l-5.364,5.363,1.414,1.414L20,12,12.222,4.222,10.808,5.636Z"
                      transform="translate(-4 -4.222)"
                    />
                  </svg>
                </span>
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                className="delete-account"
                onClick={toggleDeleteAccountPanel}
              >
                {t("text-DeleteAccount")}
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="15.555"
                    viewBox="0 0 16 15.555"
                  >
                    <path
                      id="Path_18543"
                      data-name="Path 18543"
                      d="M16.172,11H4v2H16.172l-5.364,5.363,1.414,1.414L20,12,12.222,4.222,10.808,5.636Z"
                      transform="translate(-4 -4.222)"
                    />
                  </svg>
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div
          className={`side-fixed-panel-inner change-password-section ${
            changePassword ? "open" : ""
          }`}
        >
          <ul className="panel-header">
            <li>
              <h4>
                <span
                  className="act-stng-bckbtn"
                  onClick={toggleCloseEditAccountSettingPanel}
                >
                  <LeftArrowIcon />
                </span>
                {t("text-changePassword")}
              </h4>
            </li>
            <li className="text-right">
              <button
                type="button"
                className="popup-close"
                onClick={handleCloseChangePasswordPanel}
              >
                <CloseIcon />
              </button>
            </li>
          </ul>

          <div className="panel-form profile-panel-form">
            {errors.errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errors.errorMessage}
              </div>
            )}
            {success.sucessMessage && (
              <div className="alert alert-success success-alert" role="alert">
                {success.sucessMessage}
              </div>
            )}
            <div className="custom-form-group first-input-box">
              <label>{t("label-current-password")}*</label>
              <input
                type="password"
                name="oldPassword"
                placeholder={t("enter-current-password") || ""}
                value={passwordFormData?.oldPassword}
                onChange={handleInputChangeForPassword}
              />
            </div>

            <div className="custom-form-group">
              <label>{t("label-new-password")}*</label>
              <input
                type="password"
                name="newPassword"
                placeholder={t("enter-new-password") || ""}
                value={passwordFormData?.newPassword}
                onChange={handleInputChangeForPassword}
              />
            </div>

            <div className="custom-form-group">
              <label>{t("label-confirm-password")}*</label>
              <input
                type="password"
                name="cpassowrd"
                placeholder={t("enter-confirm-password") || ""}
                value={passwordFormData?.cpassowrd}
                onChange={handleInputChangeForPassword}
              />
            </div>

            <div className="custom-form-group custom-btn-group">
              <input
                type="submit"
                name=""
                className="update-password"
                value={t("btn-saveChanges") || ""}
                onClick={updatePassword}
              />
            </div>
          </div>
        </div>
        <div
          className={`side-fixed-panel-inner language-section ${
            language ? "open" : ""
          }`}
        >
          <ul className="panel-header">
            <li>
              <h4>
                <span
                  className="act-stng-bckbtn"
                  onClick={toggleCloseEditAccountSettingPanel}
                >
                  <LeftArrowIcon />
                </span>
                {t("text-languages")}
              </h4>
            </li>
            <li className="text-right">
              <button
                type="button"
                className="popup-close"
                onClick={handleCloseLanguagePanel}
              >
                <CloseIcon />
              </button>
            </li>
          </ul>

          <div>
            <label className="radio-container">
              English
              <input
                type="radio"
                id="en"
                value="en"
                name="radio"
                checked={selectedLanguage === "en"}
                onChange={(e) => changeLanguage(e.target.value)}
              />
              <span className="checkmark"></span>
            </label>
            <label className="radio-container">
              Arabic
              <input
                type="radio"
                id="ar"
                value="ar"
                name="radio"
                checked={selectedLanguage === "ar"}
                onChange={(e) => changeLanguage(e.target.value)}
              />
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
        <div
          className={`side-fixed-panel-inner theme-option ${
            chooseTheme ? "open" : ""
          }`}
        >
          <ul className="panel-header">
            <li>
              <h4>
                <span
                  className="act-stng-bckbtn"
                  onClick={toggleCloseEditAccountSettingPanel}
                >
                  <LeftArrowIcon />
                </span>
                Choose Theme
              </h4>
            </li>
            <li className="text-right">
              <button
                type="button"
                className="popup-close"
                onClick={handleCloseThemePanel}
              >
                <CloseIcon />
              </button>
            </li>
          </ul>

          <div>
            <label className="radio-container">
              Light
              <input
                type="radio"
                id="light"
                value="light"
                name="theme"
                checked={theme === "light"}
                onChange={toggleTheme}
              />
              <span className="checkmark"></span>
            </label>
            <label className="radio-container">
              Dark
              <input
                type="radio"
                id="dark"
                value="dark"
                name="theme"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
        <div
          className={`side-fixed-panel-inner delete-account-section ${
            deleteAccount ? "open" : ""
          }`}
        >
          <ul className="panel-header">
            <li>
              <h4>
                <span
                  className="act-stng-bckbtn"
                  onClick={toggleCloseEditAccountSettingPanel}
                >
                  <LeftArrowIcon />
                </span>
                {t("text-DeleteAccount")}
              </h4>
            </li>
            <li className="text-right">
              <button
                type="button"
                className="popup-close"
                onClick={handleCloseSidePanel}
              >
                <CloseIcon />
              </button>
            </li>
          </ul>
          <div className="panel-form profile-panel-form">
            <form action="" method="post" onSubmit={handleDeleteAccountSubmit}>
              {errors.passwordErrorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errors.passwordErrorMessage}
                </div>
              )}
              <div className="custom-form-group first-input-box">
                <label>{t("label-password")}*</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder={t("enter-password") || ""}
                  required
                  value={deleteAccountFormData?.password}
                  onChange={handleInputChangeForDeleteAccountPassword}
                />
                <div className="password-error">
                  {t("please-enter-password")}
                </div>
                <div className="password-incorrect">
                  {t("please-enter-correct-password")}.
                </div>
              </div>
              <div className="custom-form-group custom-btn-group">
                <input
                  type="submit"
                  name=""
                  className="delete-account-btn"
                  value={t("btn-delete") || ""}
                />
              </div>
            </form>
          </div>
        </div>
        <div className={`overlay ${showOverlay ? "open" : ""}`}></div>
      </div>
      <DeleteAccountModal
        show={showDeleteAccountModal}
        handleClose={handleCloseDeleteAccountModal}
        confirmDelete={handleConfirmDeleteAccount}
      />
    </>
  );
}

export default MyProfile;
