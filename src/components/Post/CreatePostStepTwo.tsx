import DeleteGrayIcon from "../../assets/icons/DeleteGrayIcon";
import EditIcon from "../../assets/icons/EditIcon";
import LeftArrowIcon from "../../assets/icons/LeftArrowIcon";
import PlusIcon from "../../assets/icons/PlusIcon";
import RightArrowIcon from "../../assets/icons/RightArrowIcon";
import SettingsIcon from "../../assets/icons/SettingsIcon";
import SoundIcon from "../../assets/icons/SoundIcon";
import { TOAST_TYPES } from "../../constants";
import { useNotification } from "../../contexts/Notification";
import CloseIcon from "../VerticalPlayer/Icons/Close";
import CustomModal from "../common/CustomModal/CustomModal";
import LoaderDark from "../common/LoaderDark/LoaderDark";
import "./CreatePost.css";
import ImageUploadLoader from "./Loader";
import gluedin from "gluedin-shorts-js";
import debounce from "lodash/debounce";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

const soundModule = new gluedin.GluedInSoundModule();

function CreatePostStepTwo() {
  const defaultLanguage = localStorage.getItem("defaultLanguage");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRepost = searchParams.get("repost") === "true";
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [currentVideoBlobList, setCurrentVideoBlobList] = useState<any>([]);
  const [currentVideoList, setCurrentVideoList] = useState<any>([]);
  const [categoryOptions, setCategoryOptions] = useState<any>([]);
  const [isTermsChecked, setIsTermsChecked] = useState(isRepost ? true : false);
  const [showSoundPanel, setShowSoundPanel] = useState(false);
  const [soundsList, setSoundsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [taggedSound, setTaggedSound] = useState<any>({});
  const [showSearch, setShowSearch] = useState(true);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const inputRef = useRef(null);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [titleValue, setTitleValue] = useState("");

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
  });

  useEffect(() => {
    const storedVideosBlobs = sessionStorage.getItem("blobUrls");
    const storedVideoUrls = sessionStorage.getItem("videoUrls");
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
      contentUrl: { type: "video", urls: videosList },
      s3Url: videosList[0],
    }));
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

    // Update specific state based on the input field name
    if (name === "description") {
      setDescriptionValue(value);
    } else if (name === "title") {
      setTitleValue(value);
    }
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
              //   sessionStorage.setItem("videoUrls", JSON.stringify(newVideoList));
              setCurrentVideoBlobList([videoUrlBlob]);
              setCurrentVideoList(newVideoList);
              setFormData((prevFormData: any) => ({
                ...prevFormData,
                contentUrl: { type: "video", urls: newVideoList },
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
      //alert("Please select media content");
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

      setIsLoading(true);
      const feedModuleObj = new gluedin.GluedInFeedModule();
      let feedModuleResponse = await feedModuleObj.uploadContent(formData);
      if (
        feedModuleResponse.status === 200 ||
        feedModuleResponse.status === 201
      ) {
        sessionStorage.removeItem("videoUrl");
        setIsLoading(false);
        showNotification({
          title: "Create Content",
          subTitle: feedModuleResponse.data.statusMessage,
          type: TOAST_TYPES.SUCCESS,
        });
        setDescriptionValue("");
        setTitleValue("");
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
      contentUrl: { type: "video", urls: updatedVideoList },
    }));
  };

  const soundPanelHandler = () => {
    setShowSoundPanel(!showSoundPanel);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    async function fetchSoundList() {
      try {
        const response = await soundModule.getSoundList("");
        const { data: { result = [] } = {}, status } = response;
        if (status === 200) {
          setSoundsList(result);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchSoundList();
  }, []);

  // Debounce function to delay the execution of the search function
  const delayedSearch = debounce(async (term) => {
    setLoading(true);
    const filteredSoundsList = soundsList.filter((item: any) =>
      item.title.toLowerCase().includes(term.toLowerCase())
    );
    setSoundsList(soundsList);
    setSearchResults(filteredSoundsList);
    setLoading(false);

    if (term.length > 0 && filteredSoundsList.length === 0) {
      setShowSearch(false);
    } else {
      setShowSearch(true);
    }
  }, 500); // Adjust the delay time as needed

  useEffect(() => {
    if (searchTerm) {
      delayedSearch(searchTerm);
    } else {
      setSearchResults([]);
    }
    // Clean up the debounce function on component unmount
    return delayedSearch.cancel;
  }, [searchTerm]);

  const handleSearchInputChange = (event: any) => {
    setSearchTerm(event.target.value);
    if (event.target.value.length === 0) {
      setShowSearch(true);
    }
  };

  const handleSoundTag = (sound: any) => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      soundId: sound.soundId,
      soundName: sound.title,
    }));
    setTaggedSound(sound);
    setShowSoundPanel(false);
    showNotification({
      title: "Tag Sound",
      subTitle: "The sound has been tagged",
    });
  };

  const handleRemoveTaggedSound = () => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      soundId: "",
      soundName: "",
    }));
    setTaggedSound({});
    setShowSoundPanel(false);
    showNotification({
      title: "Tag Sound",
      subTitle: "The sound has been deleted",
    });
  };

  return (
    <>
      <div className="full-box create-full-box">
        <div className="back-header">
          <ul className="list">
            <li className="back-btn">
              <button
                className="back-btn-a"
                onClick={() => navigate(-1)}
                style={{
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                  border: "none",
                  gap: 5,
                }}
              >
                {defaultLanguage === "en" ? (
                  <LeftArrowIcon />
                ) : (
                  <RightArrowIcon />
                )}
                {t("back-btn")}
              </button>
            </li>
            <li className="common-heading">
              {t(isRepost ? "create-repost" : "create-post")}
            </li>
          </ul>
        </div>
        <div className="creat-full mt-t-60">
          <div className="creat-box-02">
            <div className="img-sec">
              <div className="img-box upload-content">
                <video
                  src={isRepost ? currentVideoList[0] : currentVideoBlobList[0]}
                  className="full"
                  controls
                ></video>
              </div>
              <div className="creat-add-btn mt-t-15">
                <form action="" method="POST" encType="multipart/form-data">
                  <ul>
                    {(isRepost ? currentVideoList : currentVideoBlobList).map(
                      (_video: any, index: any) => (
                        <li key={index}>
                          <div className="inner-box">
                            <video src={_video}></video>
                          </div>
                          {/* <span
                          className="remove-video"
                          onClick={() => removeImageItem(index)}
                        >
                          <i className="fa fa-times"></i>
                        </span> */}
                        </li>
                      )
                    )}
                    <li className="upload-content-block">
                      {/* <img src="/gluedin/images/creat-add.svg" alt="" /> */}
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
                          fill="#E95F2A"
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
                  </ul>
                </form>
              </div>

              <button
                className="btn_sound btn_transparent"
                onClick={soundPanelHandler}
              >
                {taggedSound.soundId ? (
                  <div>{taggedSound.title}</div>
                ) : (
                  <>
                    <SoundIcon />
                    Tag Sound
                  </>
                )}
              </button>
            </div>

            <div className="content-sec">
              {/* {isLoading && <ImageUploadLoader />} */}
              <form className="creat-box-02-form" onSubmit={handlePostSubmit}>
                <div className="input-grp first-input-box">
                  <label>{t("label-title")}</label>
                  <input
                    type="text"
                    maxLength={50}
                    className="custom-input"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  <div className="input-grp-row">
                    {errors.title && (
                      <span className="error">{errors.title}</span>
                    )}
                    <div className="word-count">
                      <span id="write-count">{titleValue.length}</span>/
                      <span id="total-count">50</span>
                    </div>
                  </div>
                </div>
                <div className="input-grp mt-t-30">
                  <label>{t("label-description")}</label>
                  <textarea
                    rows={4}
                    maxLength={200}
                    className="custom-input"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                  <div className="input-grp-row">
                    {errors.description && (
                      <span className="error">{errors.description}</span>
                    )}
                    <div className="word-count">
                      <span id="write-count">{descriptionValue.length}</span>/
                      <span id="total-count">200</span>
                    </div>
                  </div>
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

                  {/* Likes Action */}
                  <div className="toggle-container">
                    <h4 className="toggle-title">{t("label-like")}</h4>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formData.likeEnabled}
                        onChange={likeToggleHandler}
                        disabled={isRepost}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  {/* Comments Action */}
                  <div className="toggle-container">
                    <h4 className="toggle-title">{t("label-comment")}</h4>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formData.commentEnabled}
                        onChange={commentToggleHandler}
                        disabled={isRepost}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  {/* Share Action */}
                  <div className="toggle-container">
                    <h4 className="toggle-title">{t("label-share")}</h4>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={formData.shareEnabled}
                        onChange={shareToggleHandler}
                        disabled={isRepost}
                      />
                      <span className="slider round"></span>
                    </label>
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

      <div
        className={`side-fixed-panel-inner sound-panel ${
          showSoundPanel ? "open" : ""
        }`}
      >
        <ul className="panel-header">
          <li>
            <h4>Tag Sound</h4>
          </li>
          <li>
            <button className="popup-close" onClick={soundPanelHandler}>
              <CloseIcon />
            </button>
          </li>
        </ul>
        <div className="full-box">
          <div className="page-search-box">
            <div className="input-box">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchInputChange}
                name="search"
                placeholder="Search Sound..."
                autoComplete="off"
              />
              <img
                src="./gluedin/images/search-icon.svg"
                className="search-info"
                alt=""
              />
            </div>
          </div>
        </div>

        {loading && <LoaderDark />}

        {!showSearch && searchResults.length === 0 && (
          <p>No search result found!</p>
        )}

        {searchResults.length > 0 && (
          <ul className="panel-list">
            {searchResults.map((sound: any) => (
              <li key={sound.soundId} className="panel-list-item">
                <div className="sound">
                  <div className="sound-image">
                    <img src={sound.thumbnail} alt="" />
                  </div>
                  <div className="sound-info">
                    <h4 className="sound-title">{sound.title}</h4>
                    <p className="sound-artist">{sound.artist}</p>
                  </div>
                </div>
                <div className="sound-actions">
                  {taggedSound.soundId !== sound.soundId ? (
                    <button
                      className="sound-actions-btn btn_transparent"
                      onClick={() => handleSoundTag(sound)}
                    >
                      <PlusIcon />
                    </button>
                  ) : (
                    <button
                      className="sound-actions-btn btn_transparent"
                      onClick={() => handleRemoveTaggedSound()}
                    >
                      <DeleteGrayIcon />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {showSearch && searchResults.length === 0 && soundsList.length > 0 && (
          <ul className="panel-list">
            {soundsList.map((sound: any) => (
              <li key={sound.soundId} className="panel-list-item">
                <div className="sound">
                  <div className="sound-image">
                    <img src={sound.thumbnail} alt="" />
                  </div>
                  <div className="sound-info">
                    <h4 className="sound-title">{sound.title}</h4>
                    <p className="sound-artist">{sound.artist}</p>
                  </div>
                </div>
                <div className="sound-actions">
                  {taggedSound.soundId !== sound.soundId ? (
                    <button
                      className="sound-actions-btn btn_transparent"
                      onClick={() => handleSoundTag(sound)}
                    >
                      <PlusIcon />
                    </button>
                  ) : (
                    <button
                      className="sound-actions-btn btn_transparent"
                      onClick={() => handleRemoveTaggedSound()}
                    >
                      <DeleteGrayIcon />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {searchResults.length === 0 && soundsList.length === 0 && (
          <p>No results found!</p>
        )}
      </div>

      <div className="side-fixed-panel">
        <div className={`overlay ${showSoundPanel ? "open" : ""}`}></div>
      </div>

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
