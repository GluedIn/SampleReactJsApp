import LeftArrowIcon from "../../assets/icons/LeftArrowIcon";
import RightArrowIcon from "../../assets/icons/RightArrowIcon";
import SettingsIcon from "../../assets/icons/SettingsIcon";
import SoundIcon from "../../assets/icons/SoundIcon";
import { TOAST_TYPES } from "../../constants";
import { useNotification } from "../../contexts/Notification";
import CustomModal from "../common/CustomModal/CustomModal";
import LoaderDark from "../common/LoaderDark/LoaderDark";
import "./CreatePost.css";
import Input from "./Input";
import InputWithChips from "./InputWithChips";
import Loader from "./Loader";
import SidePanel from "./SidePanel";
import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

function CreatePostStepTwo() {
  const defaultLanguage = localStorage.getItem("defaultLanguage");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRepost = searchParams.get("repost") === "true";
  const isHashtag = searchParams.get("hashtag") === "true";
  const contentType = searchParams.get("contentType");
  const music = searchParams.get("music") === "true";
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [currentVideoBlobList, setCurrentVideoBlobList] = useState<any>([]);
  const [currentVideoList, setCurrentVideoList] = useState<any>([]);
  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const [showTagPanel, setShowTagPanel] = useState({
    sound: false,
    hashtag: false,
    user: false,
  });
  const [isTermsChecked, setIsTermsChecked] = useState(isRepost ? true : false);
  const { showNotification } = useNotification();
  const inputRef = useRef(null);
  const videoRef = useRef(null);
  const [show, setShow] = useState(false);
  const videoList = isRepost ? currentVideoList : currentVideoBlobList;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public",
    follow: true,
    type: "camera-upload",
    categoryId: "",
    categoryName: "",
    contentUrl: [],
    s3Url: "",
    commentEnabled: true,
    likeEnabled: true,
    shareEnabled: true,
    repost: false,
    soundId: "",
    soundName: "",
    taggedUsers: [],
    hashtags: Array(0),
    sounds: [],
    // contentType: contentType,
    ...(contentType ? { contentType } : {}),
  });

  useEffect(() => {
    const useHashtag = localStorage.getItem("hashtag");

    async function fetchData() {
      if (isHashtag) {
        try {
          const hashTagModuleObj = new gluedin.GluedInHashTag();
          let limit = 10;
          let offset = 1;
          const hashTagResponse = await hashTagModuleObj.getHashTagDetails({
            limit: limit,
            offset: offset,
            name: useHashtag,
          });
          if (hashTagResponse?.status === 200)
            if (useHashtag) {
              let hashtagObj = hashTagResponse.data.result.hashtag;
              setFormData((prevFormData) => ({
                ...prevFormData,
                hashtags: [hashtagObj],
              }));
            }
        } catch (error) {
          console.error(error);
        }
      }
    }
    fetchData();
  }, [isHashtag]);

  useEffect(() => {
    const storedVideosBlobs = sessionStorage.getItem("blobUrls");
    const storedVideoUrls = sessionStorage.getItem(
      contentType && contentType === "image" ? "imageUrls" : "videoUrls"
    );
    if (!storedVideosBlobs) {
      navigate("/create-post");
      return;
    }
    const blobsList = JSON.parse(storedVideosBlobs);
    const videosList = JSON.parse(storedVideoUrls!);
    setCurrentVideoList(videosList);
    setCurrentVideoBlobList(blobsList);
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      contentUrl: [
        {
          type: contentType && contentType === "image" ? "image" : "video",
          urls: videosList,
        },
      ],
      s3Url: videosList[0],
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const feedModuleObj = new gluedin.GluedInFeedModule();
        let feedModuleResponse = await feedModuleObj.getCategoryList({
          search: "",
          limit: 100,
          offset: 1,
        });
        if (feedModuleResponse.status === 200) {
          let categoryList = feedModuleResponse.data.result;
          if (categoryList && categoryList.length) {
            setCategoryOptions(categoryList);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchCategories();
  }, []);

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;

    // Prevent spacebar input when the field is empty
    if (/^\s*$/.test(value)) {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: "" }));
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  };

  const handleCategoryChange = (event: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      categoryId: event.target.value,
    }));
  };

  const commentToggleHandler = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      commentEnabled: !prevFormData.commentEnabled,
    }));
  };

  const likeToggleHandler = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      likeEnabled: !prevFormData.likeEnabled,
    }));
  };

  const shareToggleHandler = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      shareEnabled: !prevFormData.shareEnabled,
    }));
  };

  const handleFileUploadChange = async (event: any) => {
    const fileUploaded = event.target.files[0];
    if (
      fileUploaded.type !== "video/mp4" &&
      fileUploaded.type !== "video/mpeg"
    ) {
      showNotification({
        title: "File not uploaded",
        subTitle: "File format should be .mp4",
        autoClose: false,
        type: TOAST_TYPES.ERROR,
      });
    } else {
      let fileSize = fileUploaded.size / 1024 / 1024;

      if (fileSize > 50) {
        setIsLoading(false);
        showNotification({
          title: "File not uploaded",
          subTitle: "File size is more than 50 MB",
          autoClose: false,
          type: "error",
        });
        inputRef.current = null;
        return;
      }

      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoElement.src);
        const duration = videoElement.duration;
        if (duration > 60 || duration < 6) {
          showNotification({
            title: "File not uploaded",
            subTitle:
              "Video duration should be greater than 6 seconds and less than 60 seconds",
            autoClose: false,
            type: TOAST_TYPES.ERROR,
          });
          inputRef.current = null;
          return;
        } else {
          readFile(fileUploaded);
        }
      };

      videoElement.onerror = () => {
        setIsLoading(false);
        showNotification({
          title: "File not uploaded",
          subTitle: "Unable to load video file",
          autoClose: false,
          type: TOAST_TYPES.ERROR,
        });
        inputRef.current = null;
      };

      videoElement.src = URL.createObjectURL(fileUploaded);
    }
    event.target.value = null;
  };

  const readFile = (inputFile: any) => {
    if (inputFile) {
      setIsLoading(true);
      if (inputFile.type !== "video/mp4" && inputFile.type !== "video/mpeg") {
        return false;
      }

      const reader = new FileReader();
      reader.onload = async function (e) {
        let signedUrlResponse = await getSignedUrl();
        if (signedUrlResponse.status === 200) {
          let signedUrl = signedUrlResponse.data.result.uploadUrl;

          let videoUrl = signedUrlResponse.data.result.url;
          var file = inputFile;
          var requestOptions: any = {
            method: "PUT",
            body: file,
            redirect: "follow",
          };
          fetch(signedUrl, requestOptions)
            .then((response) => {
              setIsLoading(false);
              const file1 = inputFile;
              const videoUrlBlob = URL.createObjectURL(file1);
              sessionStorage.setItem("videoUrls", JSON.stringify([videoUrl]));
              sessionStorage.setItem(
                "blobUrls",
                JSON.stringify([videoUrlBlob])
              );

              const newVideoList = [videoUrl];
              setCurrentVideoBlobList([videoUrlBlob]);
              setCurrentVideoList(newVideoList);
              setFormData((prevFormData: any) => ({
                ...prevFormData,
                contentUrl: [
                  {
                    type:
                      contentType && contentType === "image"
                        ? "image"
                        : "video",
                    urls: newVideoList,
                  },
                ],
              }));
            })
            .then((result) => {
              setIsLoading(false);
            })
            .catch((error) => {
              setIsLoading(false);
            });
        } else {
          if (signedUrlResponse.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/sign-in");
          }
        }
      };

      reader.readAsDataURL(inputFile);
    }
  };

  const getSignedUrl = async () => {
    var feedModuleObj = new gluedin.GluedInFeedModule();
    let feedModuleResponse = await feedModuleObj.getSignedUrl({
      type: "video",
    });
    return feedModuleResponse;
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (currentVideoList.length === 0) {
      newErrors.contentVideo = t("media-valid");
    }

    if (!formData.title) {
      newErrors.title = t("title-valid");
    }

    if (!formData.description) {
      newErrors.description = t("description-valid");
    }

    if (formData.categoryId === "" && !isRepost) {
      newErrors.category = t("category-valid");
    }

    if (!isTermsChecked) {
      newErrors.terms = t("terms-valid");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePostSubmit = async (event: any) => {
    event.preventDefault();
    if (validateForm()) {
      const selectedOptionObject: any = categoryOptions.find(
        (option: any) => option.categoryId === formData.categoryId
      );
      const selectedOptionText = selectedOptionObject
        ? selectedOptionObject.categoryName
        : "";
      formData.categoryName = selectedOptionText;
      if (isRepost) {
        formData.repost = true;
      }

      const { sounds, ...restFormData } = formData ?? {};
      const payload = { ...restFormData };

      setIsLoading(true);
      const feedModuleObj = new gluedin.GluedInFeedModule();
      let feedModuleResponse = await feedModuleObj.uploadContent(payload);
      if (
        feedModuleResponse.status === 200 ||
        feedModuleResponse.status === 201
      ) {
        sessionStorage.removeItem("videoUrl");
        localStorage.removeItem("hashtag");
        setIsLoading(false);
        showNotification({
          title: "Create Content",
          subTitle: feedModuleResponse.data.statusMessage,
          type: TOAST_TYPES.SUCCESS,
        });
        navigate("/vertical-player");
      } else {
        setIsLoading(false);
        showNotification({
          title: "Create Content",
          subTitle: feedModuleResponse?.data?.statusMessage,
          type: TOAST_TYPES.ERROR,
        });
      }
    }
  };

  const removeImageItem = (ind: any) => {
    // Create a copy of the items array
    const updatedVideoList = [...currentVideoList];
    // Remove the item at the specified index
    updatedVideoList.splice(ind, 1);

    // Update the state with the new array of items
    setCurrentVideoList(updatedVideoList);
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      contentUrl: [
        {
          type: contentType && contentType === "image" ? "image" : "video",
          urls: updatedVideoList,
        },
      ],
    }));
  };

  const togglePanel = (type: any) => {
    setShowTagPanel((prev) => ({
      ...prev,
      ...(type === "sound" && { sound: !prev.sound }),
      ...(type === "user" && { user: !prev.user }),
      ...(type === "hashtag" && { hashtag: !prev.hashtag }),
    }));
  };

  const handleRemoveHashtag = (hashtag: any) => {
    const indexToRemove = formData.hashtags.findIndex(
      (taggedHashtag: any) => taggedHashtag.id === hashtag.id
    );
    if (indexToRemove !== -1) {
      formData.hashtags.splice(indexToRemove, 1);
    }
    setFormData((prev: any) => ({
      ...prev,
      hashtags: [...formData.hashtags],
    }));
  };

  const handleRemoveUser = (user: any) => {
    const indexToRemove = formData.taggedUsers.findIndex(
      (taggedUser: any) => taggedUser.id === user.id
    );
    if (indexToRemove !== -1) {
      formData.taggedUsers.splice(indexToRemove, 1);
    }
    setFormData((prev: any) => ({
      ...prev,
      taggedUsers: [...formData.taggedUsers],
    }));
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {isLoading && <Loader />}
      <div className="full-box create-full-box">
        <div className="main_header">
          <button onClick={() => navigate(-1)} className="btn_back">
            {defaultLanguage === "en" ? <LeftArrowIcon /> : <RightArrowIcon />}
            {t("back-btn")}
          </button>
          <h2 className="main_heading">
            {t(isRepost ? "create-repost" : "create-post")}
          </h2>
        </div>
        <div className="creat-full mt-4">
          <div className="creat-box-02 p-0">
            <div className="img-sec">
              <div className="img-box upload-content">
                {contentType !== "image" || music ? (
                  <video
                    ref={videoRef}
                    src={currentVideoList[0]}
                    className="full"
                    controls
                  ></video>
                ) : (
                  <img ref={videoRef} src={currentVideoList[0]} alt="" />
                )}
              </div>
              <div className="creat-add-btn mt-t-15">
                <form action="" method="POST" encType="multipart/form-data">
                  <ul>
                    {/* {videoList?.map((videoUrl: string) => (
                      <li key={videoUrl}>
                        <div className="inner-box">
                          <video src={videoUrl}></video>
                        </div>
                      </li>
                    ))} */}
                    {!isRepost && !contentType && (
                      <li className="upload-content-block">
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
                        <input
                          type="file"
                          name=""
                          className="file-upload-btn-input dropzone"
                          accept=".mp4,.m3u8"
                          onChange={handleFileUploadChange}
                        />
                      </li>
                    )}
                  </ul>
                </form>
              </div>
              {!contentType && (
                <button
                  className="btn_sound btn_transparent"
                  onClick={() => togglePanel("sound")}
                >
                  {formData.soundId ? (
                    <div>{formData.soundName}</div>
                  ) : (
                    <>
                      <SoundIcon />
                      Tag Sound
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="content-sec">
              <form className="creat-box-02-form" onSubmit={handlePostSubmit}>
                <div className="input-grp first-input-box">
                  <label>{t("label-title")}</label>
                  <Input
                    type="text"
                    name="title"
                    placeholder={t("add-title-placeholder")}
                    maxLength={50}
                    value={formData.title}
                    onChange={handleInputChange}
                    error={errors.title}
                  />
                  <div className="input-grp-row">
                    {errors.title && (
                      <span className="error">{errors.title}</span>
                    )}
                  </div>
                </div>
                <div className="input-grp mt-t-30">
                  <label>{t("label-description")}</label>
                  <Input
                    type="text"
                    rows={1}
                    maxLength={200}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder={t("add-desc-placeholder")}
                    error={errors.description}
                  />
                  <div className="input-grp-row">
                    {errors.description && (
                      <span className="error">{errors.description}</span>
                    )}
                  </div>
                </div>
                <div className="input-grp mt-t-30">
                  <label>Tag Friends</label>
                  <InputWithChips
                    type="text"
                    name="taggedUsers"
                    value={formData.taggedUsers.reduce(
                      (acc, item: any, index) =>
                        `${acc}${index !== 0 ? "," : ""} @${item.subTitle}`,
                      ""
                    )}
                    values={formData.taggedUsers}
                    onRemoveValue={handleRemoveUser}
                    onClick={() => togglePanel("user")}
                    placeholder="Tag Friends"
                  />
                </div>

                <div className="input-grp mt-t-30">
                  <label>Add Hashtags</label>
                  <InputWithChips
                    type="text"
                    name="hashtags"
                    value={formData.hashtags.reduce(
                      (acc, item: any, index) =>
                        `${acc}${index !== 0 ? "," : ""} #${item.title}`,
                      ""
                    )}
                    values={formData.hashtags}
                    onRemoveValue={handleRemoveHashtag}
                    onClick={() => togglePanel("hashtag")}
                    placeholder="Add Hashtags"
                  />
                </div>

                <div className="input-grp mt-t-30">
                  <label>{t("label-choose-category")}</label>
                  <select
                    className="custom-input category-dropdown"
                    name="category"
                    value={formData.categoryId}
                    onChange={handleCategoryChange}
                    disabled={isRepost}
                  >
                    <option value="">{t("label-choose-category")}</option>
                    {categoryOptions.map((option: any) => (
                      <option value={option.categoryId} key={option.categoryId}>
                        {option.categoryName}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="error">{errors.category}</span>
                  )}
                </div>

                <div className="input-grp mt-t-30">
                  <div className="accordion-head">
                    <div className="post-title">
                      {t("label-post-settings")}

                      <button
                        type="button"
                        className="btn_transparent btn_settings"
                        onClick={handleShow}
                      >
                        <SettingsIcon />
                      </button>
                    </div>
                  </div>

                  <div className="input-grp">
                    {/* Likes Action */}
                    <div
                      className={`toggle-container ${
                        isRepost ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <h4 className="toggle-title">{t("label-post-like")}</h4>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={formData.likeEnabled}
                          onChange={likeToggleHandler}
                          disabled={isRepost}
                        />
                        <span
                          className={`slider round ${
                            isRepost ? "cursor-not-allowed" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                    {/* Comments Action */}
                    <div
                      className={`toggle-container ${
                        isRepost ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <h4 className="toggle-title">
                        {t("label-post-comment")}
                      </h4>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={formData.commentEnabled}
                          onChange={commentToggleHandler}
                          disabled={isRepost}
                        />
                        <span
                          className={`slider round ${
                            isRepost ? "cursor-not-allowed" : ""
                          }`}
                        ></span>
                      </label>
                    </div>

                    {/* Share Action */}
                    <div
                      className={`toggle-container ${
                        isRepost ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <h4 className="toggle-title">{t("label-post-share")}</h4>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={formData.shareEnabled}
                          onChange={shareToggleHandler}
                          disabled={isRepost}
                        />
                        <span
                          className={`slider round ${
                            isRepost ? "cursor-not-allowed" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="input-grp mt-t-30 term-box">
                  <ul>
                    <li>
                      <input
                        type="checkbox"
                        name="term_cond"
                        checked={isTermsChecked}
                        onChange={(e) => setIsTermsChecked(e.target.checked)}
                        disabled={isRepost}
                      />
                    </li>
                    <li className="sml-text">
                      {t("text-i-agree")}&nbsp;{" "}
                      <a href="policy.html" className="terms-link">
                        {" "}
                        {t("text-term-condition")}
                      </a>
                    </li>
                  </ul>
                  {errors.terms && (
                    <span className="error">{errors.terms}</span>
                  )}
                </div>
                <div className="input-grp mt-t-60 submit-box text-center">
                  <ul className="btn-ul">
                    <li>
                      <button
                        type="submit"
                        className="new-custom-btn-b upload-content flex justify-center items-center disabled:opacity-50 gap-2"
                        disabled={isLoading}
                        onClick={handlePostSubmit}
                      >
                        {isLoading && <LoaderDark />}
                        {t(isRepost ? "btn-upload-repost" : "btn-upload-post")}
                      </button>
                    </li>
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showTagPanel.sound && (
        <SidePanel
          title="Sound"
          open={showTagPanel.sound}
          onClose={() => togglePanel("sound")}
          fetchOptions={{
            itemKeys: {
              id: "soundId",
              thumbnail: "thumbnail",
              title: "title",
              subTitle: "artist",
            },
          }}
          handleTag={(sound: any) =>
            setFormData((prev: any) => ({
              ...prev,
              sounds: [...prev.sounds, sound],
              soundId: sound.soundId,
              soundName: sound.title,
            }))
          }
          handleRemove={(sound: any) => {
            const indexToRemove = formData.sounds.findIndex(
              (taggedSound: any) => taggedSound.id === sound.id
            );
            if (indexToRemove !== -1) {
              formData.sounds.splice(indexToRemove, 1);
            }
            setFormData((prev: any) => ({
              ...prev,
              sounds: [...formData.sounds],
              soundId: null,
              soundName: null,
            }));
          }}
          taggedItems={formData.sounds}
        />
      )}

      {showTagPanel.hashtag && (
        <SidePanel
          title="Hashtag"
          open={showTagPanel.hashtag}
          onClose={() => togglePanel("hashtag")}
          fetchOptions={{
            itemKeys: {
              id: "hashtagId",
              thumbnail: "image",
              title: "title",
              subTitle: "status",
            },
          }}
          handleTag={(hashtag: any) =>
            setFormData((prev: any) => ({
              ...prev,
              hashtags: [...prev.hashtags, hashtag],
            }))
          }
          handleRemove={handleRemoveHashtag}
          taggedItems={formData.hashtags}
          multiple
        />
      )}

      {showTagPanel.user && (
        <SidePanel
          title="Friend"
          open={showTagPanel.user}
          onClose={() => togglePanel("user")}
          fetchOptions={{
            itemKeys: {
              id: "userId",
              thumbnail: "profileImageUrl",
              title: "fullName",
              subTitle: "userName",
            },
          }}
          handleTag={(user: any) =>
            setFormData((prev: any) => ({
              ...prev,
              taggedUsers: [...prev.taggedUsers, user],
            }))
          }
          handleRemove={handleRemoveUser}
          taggedItems={formData.taggedUsers}
          multiple
        />
      )}

      <CustomModal isOpen={show} close={handleClose}>
        <h2 className="modal-titl">Post Setting Info</h2>
        <p>
          If you disable the like, comment, share and download toggle then the
          user can't access these features.
        </p>
      </CustomModal>
    </>
  );
}

export default CreatePostStepTwo;
