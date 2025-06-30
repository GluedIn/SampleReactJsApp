import CameraIcon from "../../assets/icons/CameraIcon";
import UploadIcon from "../../assets/icons/UploadIcon";
import { TOAST_TYPES } from "../../constants";
import { useConfig } from "../../contexts/Config/configContext";
import { useNotification } from "../../contexts/Notification";
// import LoaderDark from "../common/LoaderDark/LoaderDark";
import ImageUploadLoader from "./Loader";
import gluedin from "gluedin-shorts-js";
import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const { showNotification } = useNotification();
  const { appConfig } = useConfig();

  const handleFileUploadChange = (files: any) => {
    const fileUploaded = files[0];
    if (
      (userData?.creator && appConfig?.inviteOnlyCreation) ||
      (!appConfig?.inviteOnlyCreation && appConfig?.ugcEnabled)
    ) {
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
          setIsUploadingVideo(false);
          showNotification({
            title: "File not uploaded",
            subTitle: "File size is more than 50 MB",
            autoClose: false,
            type: TOAST_TYPES.ERROR,
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
          setIsUploadingVideo(false);
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
      files = null;
    } else {
      showNotification({
        title: "File not uploaded",
        subTitle:
          "This functionality is restricted to authorized users only. Please contact the support team",
        autoClose: false,
        type: TOAST_TYPES.ERROR,
      });
      return;
    }
  };

  const readFile = (inputFile: any) => {
    console.log("inputFile", inputFile);
    if (inputFile) {
      setIsUploadingVideo(true);
      const reader = new FileReader();
      reader.onload = async function () {
        let {
          status,
          data: {
            result: { uploadUrl: signedUrl, url: videoUrl },
          },
        } = await getSignedUrl();
        if (status === 200) {
          var file = inputFile;
          var requestOptions: any = {
            method: "PUT",
            body: file,
            redirect: "follow",
          };
          fetch(signedUrl, requestOptions)
            .then((response) => {
              setIsUploadingVideo(false);
              const file1 = inputFile;
              const videoUrlBlob = URL.createObjectURL(file1);
              sessionStorage.setItem("videoUrls", JSON.stringify([videoUrl]));
              sessionStorage.setItem(
                "blobUrls",
                JSON.stringify([videoUrlBlob])
              );
              //   window.location.href = `/create-post-page-02?contentType=${contentType}`;
              navigate("/create-post-page-02");
            })
            .then(() => {
              setIsUploadingVideo(false);
            })
            .catch(() => {
              setIsUploadingVideo(false);
            });
        } else {
          if (status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            // navigate to Signin
            navigate("/sign-in");
          }
        }
      };

      reader.readAsDataURL(inputFile);
    }
  };

  const getSignedUrl = async () => {
    const feedModuleObj = new gluedin.GluedInFeedModule();
    const feedModuleResponse = await feedModuleObj.getSignedUrl({
      type: "video",
    });
    return feedModuleResponse;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUploadChange,
    accept: {
      "video/mp4": [".mp4"],
    },
  });

  const handleCreator = () => {
    navigate("/creator");
  };

  return (
    <>
      <div className="main_upload mt-20">
        <div
          data-isDragActive={isDragActive}
          className="main_upload-container data-[isDragActive=true]:border-[#03f] p-4"
          {...getRootProps()}
        >
          {isUploadingVideo && <ImageUploadLoader />}
          <div className="main_dropzone flex flex-col items-center justify-center">
            <div className="main_dropzone-actions">
              <input {...getInputProps()} />
              <button
                className="position"
                onClick={(event) => {
                  event.stopPropagation();
                  handleCreator();
                }}
              >
                <CameraIcon />
                Camera
              </button>
              <button disabled={isUploadingVideo} className="">
                <UploadIcon />
                <span>
                  {t("btn-select-from-computer")}
                  {/* {isUploadingVideo ? <LoaderDark /> : null}{" "} */}
                </span>
              </button>
            </div>

            <div className="main_divider">Or</div>

            <div className="c-text text-g">{t("text-drag-drop")}...!</div>
            <div className="text-sm">
              {t("text-support-file-type")} {t("text-file-size")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreatePost;
