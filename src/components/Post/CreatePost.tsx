import { TOAST_TYPES } from "../../constants";
import { useNotification } from "../../contexts/Notification";
import LoaderDark from "../common/LoaderDark/LoaderDark";
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

  const { showNotification } = useNotification();

  const handleFileUploadChange = (files: any) => {
    const fileUploaded = files[0];
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

  return (
    <>
      <div className="creat-full mt-t-100">
        <div
          data-isDragActive={isDragActive}
          className="creat-box w-1/2 flex flex-col justify-center items-center rounded-md border-4 border-gray-300 border-dashed data-[isDragActive=true]:border-[#03f] p-4"
          {...getRootProps()}
        >
          <div className="flex justify-center">
            <img src="/gluedin/images/no-data.png" alt="no-data" />
          </div>
          {/* {isUploadingVideo && <ImageUploadLoader />} */}
          <div className="content-sec dropzone-wrapper flex flex-col items-center justify-center">
            <div className="c-text text-g">{t("text-drag-drop")}...!</div>
            <div className="text-sm">
              {t("text-support-file-type")}
              <br />
              {t("text-file-size")}
            </div>

            <div className="file-upload-btn-parent">
              <input {...getInputProps()} />
              <button
                disabled={isUploadingVideo}
                className="new-custom-btn-b mt-t-30 file-upload-btn disabled:opacity-50 flex items-center gap-2"
              >
                {isUploadingVideo ? <LoaderDark /> : null}{" "}
                {t("btn-select-from-computer")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreatePost;
