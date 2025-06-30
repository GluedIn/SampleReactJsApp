/* eslint-disable */
import BackIcon from "../../assets/icons/BackIcon";
import CameraFlipIcon from "../../assets/icons/CameraFlipIcon";
import CameraStartIcon from "../../assets/icons/CameraStartIcon";
import CameraStopIcon from "../../assets/icons/CameraStopIcon";
import ClipIcon from "../../assets/icons/ClipIcon";
import CreatorCloseIcon from "../../assets/icons/CreatorCloseIcon";
import FilterClose from "../../assets/icons/FilterClose";
import FilterIcon from "../../assets/icons/FilterIcon";
import Frame11Icon from "../../assets/icons/Frame11Icon";
import Frame916Icon from "../../assets/icons/Frame916Icon";
import FriendIcons from "../../assets/icons/FriendIcons";
import MusicIcon from "../../assets/icons/MusicIcon";
import Processing from "../../assets/icons/Processing";
import SoundIcon from "../../assets/icons/SoundIcon";
import StickerIcon from "../../assets/icons/StickerIcon";
import TextIcon from "../../assets/icons/TextIcon";
import VideoMute from "../../assets/icons/VideoMute";
import VideoPause from "../../assets/icons/VideoPause";
import VideoPauseMobile from "../../assets/icons/VideoPauseMobile";
import VideoPlay from "../../assets/icons/VideoPlay";
import VideoPlayMobile from "../../assets/icons/VideoPlayMobile";
import VideoUnmute from "../../assets/icons/VideoUnmute";
import CloseIcon from "../../assets/img/close.svg";
import CloseSvgIcon from "../../assets/img/close.svg";
import DeleteGrayIcon from "../../assets/img/delete-gray.svg";
import DeleteRedIcon from "../../assets/img/delete-red.svg";
import { FONTS } from "../../constants";
import { TOAST_TYPES } from "../../constants/index";
import { useNotification } from "../../contexts/Notification";
import useIsMobile from "../../hooks/useIsMobile";
import SidePanel from "../Layouts/SidePanel/SidePanel";
import LoaderDark from "../common/LoaderDark/LoaderDark";
import Popup from "../common/Popup/Popup";
import FilterSelector from "./CreatorFilter/CreatorFilter";
import CreatorFriend from "./CreatorFriend/CreatorFriend";
import TaggedFriendsList from "./CreatorFriend/TaggedFriendList";
import CreatorMusic from "./CreatorMusic/CreatorMusic";
import StickerSelector from "./CreatorSticker/CreatorSticker";
import "./CreatorTools.css";
import axios from "axios";
import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState, useMemo, useRef } from "react";
import Draggable from "react-draggable";
import { Stage, Layer, Image, Text, Rect } from "react-konva";
import { useNavigate } from "react-router-dom";
import { FFmpeg } from "../../ffmpegSDK/@ffmpeg/ffmpeg/bundle/esm";
import { fetchFile } from "../../ffmpegSDK/@ffmpeg/util/bundle/cjs";
const ArialFile = require("../../ffmpegSDK/Fonts/arial.ttf");
const RobotoFile = require("../../ffmpegSDK/Fonts/roboto.ttf");
const SyneMonoFile = require("../../ffmpegSDK/Fonts/synemono.ttf");
const PoppinsFile = require("../../ffmpegSDK/Fonts/poppins.ttf");
const MontserratFile = require("../../ffmpegSDK/Fonts/montserrat.ttf");
const NotoSansFile = require("../../ffmpegSDK/Fonts/notosans.ttf");

const StoryModule = new gluedin.GluedInStoryModule();

function CreatorTools() {

  const updateListeners = (data: any) => {
    if (data.isRecording !== undefined) {
      setIsRecording(data.isRecording);
    }
    if (data.recordedVideoUrl !== undefined) {
      setRecordedVideo(data.recordedVideoUrl);
    }
    if (data.videoDuration !== undefined) {
      setVideoDuration(data.videoDuration);
    }
    if (data.isLiveStreaming !== undefined) {
      setIsLiveStreaming(data.isLiveStreaming);
    }
    if (data.isUsingFrontCamera !== undefined) {
      setIsUsingFrontCamera(data.isUsingFrontCamera);
    }
    if (data.playbackTime !== undefined) {
      setPlaybackTime(data.playbackTime);
    }
    if (data.thumbnails !== undefined) {
      setThumbnails(data.thumbnails);
    }
  }
  // Ensure useMemo keeps the function reference intact
  const gluedInCreator = useMemo(
    () =>
      new gluedin.GluedInCreatorModule(updateListeners, 768, FFmpeg, fetchFile, {
        Arial: ArialFile,
        Roboto: RobotoFile,
        SyneMono: SyneMonoFile,
        Montserrat: MontserratFile,
        NotoSans: NotoSansFile,
        Poppins: PoppinsFile,
      }, MediaRecorder),
    []
  );

  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const [capturedImage, setCapturedImage]: any = useState(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [contentType, setContentType] = useState("video");
  const [postType, setPostType] = useState("story");
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const navigate = useNavigate();
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [isUsingFrontCamera, setIsUsingFrontCamera] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [frameSize, setFrameSize] = useState("9:16");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [step, setStep] = useState("postType");
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);
  const [isDragging, setIsDragging] = useState<"start" | "end" | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedTool, setSelectedTool] = useState("");
  const [trimmedVideo, setTrimmedVideo]: any = useState(null);
  const [selectedFilter, setSelectedFilter] = useState({
    filterName: "normal",
    filterValue: "none",
  });
  const [filterToolSelected, setFilterToolSelected] = useState(false);
  const [stickerToolSelected, setStickerToolSelected] = useState(false);
  const [textToolSelected, setTextToolSelected] = useState(false);
  const [musicToolSelected, setMusicToolSelected] = useState(false);
  const [friendToolSelected, setFriendToolSelected] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [stickers, setStickers] = useState<any[]>([]);
  const containerRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState("#FFFFFF");
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [showCreatorTools, setShowCreatorTools] = useState(false);
  const [audioFile, setAudioFile]: any = useState();
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [sliderBg, setSliderBg] = useState("");
  const [stickerSliderBg, setStickerSliderBg] = useState("");
  const [stickerSize, setStickerSize] = useState(80);
  const [isLoading, setIsLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const [selectedFont, setSelectedFont] = useState(FONTS[0]); // Default font
  const [musicVideo, setMusicVideo]: any = useState(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(
    null
  );
  const [storyPayload, setStoryPayload]: any = useState({
    stories: [
      {
        contentUrl: [
          {
            type: "",
            urls: [""],
          },
        ],
        contentType: "",
        userId: userData?.userId,
        taggedUsers: [],
        soundId: "",
        soundName: "",
        soundThumbnail: "",
        commentEnabled: true,
        likeEnabled: true,
        shareEnabled: true,
      },
    ],
  });
  const [heldStickerId, setHeldStickerId] = useState<string | null>(null);
  const [isDraggingOverDelete, setIsDraggingOverDelete] = useState(false);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [isDraggingOverTextDelete, setIsDraggingOverTextDelete] =
    useState(false);
  const [editingText, setEditingText] = useState(false);
  const inputRef: any = useRef(null);
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false);
  const textInputRef: any = useRef(null);
  const [selectedTextTool, setSelectedTextTool] = useState<
    "font" | "color" | null
  >("font");
  const [poster, setPoster] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const maxTime = 60;
  const radius = 50;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    circumference - (playbackTime / maxTime) * circumference;
  const [isProgress, setIsProgress]: any = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showBackButton, setShowBackButton] = useState(true); // default: true
  const sliderRef = useRef<HTMLDivElement>(null);
  const stickerSliderRef = useRef<HTMLDivElement>(null);
  const { showNotification } = useNotification();

  const handleDisabledClick = () => {
    if (playbackTime < 6) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000); // Hide after 5 seconds
    }
  };

  const handleBackAction = () => {
    setPopupTitle("Are you sure you want to exit from creator?");
    window.location.href = "/create-post";
  };

  const captureFrame = (video: HTMLVideoElement) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      video.currentTime = 0.1; // Capture frame at 0.1s to avoid blank frames
      try {
        video.play();
      } catch (error) {
        console.log(error);
      }

      video.addEventListener("seeked", function onSeeked() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.pause();

        canvas.toBlob((blob) => {
          if (blob) {
            setPoster(URL.createObjectURL(blob)); // Convert blob to object URL
          }
        });

        video.removeEventListener("seeked", onSeeked);
      });
    }
  };

  useEffect(() => {
    const videoSrc = musicVideo || trimmedVideo || recordedVideo;

    if (videoSrc) {
      const video = document.createElement("video");
      video.src = videoSrc;
      video.crossOrigin = "anonymous"; // To prevent CORS issues
      video.muted = true; // Mute to allow autoplay in some browsers
      video.playsInline = true; // Ensures inline playback on iOS

      video.addEventListener("loadeddata", () => {
        captureFrame(video);
      });

      return () => {
        video.removeEventListener("loadeddata", () => captureFrame(video));
      };
    }
  }, [musicVideo, trimmedVideo, recordedVideo]);

  useEffect(() => {
    if (textToolSelected) {
      setTimeout(() => {
        textInputRef.current?.focus(); // Auto-focus input field
      }, 0);
    }
  }, [textToolSelected]);

  // ✅ Effect to set the initial text position after dimensions are available
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setPosition({
        x: dimensions.width / 2 - 50, // Center horizontally
        y: dimensions.height / 2 - 20, // Center vertically
      });
    }
  }, [dimensions]); // Runs when dimensions change

  const deleteZone = {
    x: 0,
    // x: dimensions.width / 2 - 50,
    y: dimensions.height - 80,
    // width: 100,
    width: dimensions.width,
    height: 80,
  };

  const handleStickerPress = (stickerId: string) => {
    setTimeout(() => {
      setHeldStickerId(stickerId);
    }, 500); // Long press detection (500ms)
  };

  const handleStickerRelease = () => {
    setHeldStickerId(null);
    setIsDraggingOverDelete(false);
  };

  const handleDragMove = (e: any) => {
    const { x, y } = e.target.position();

    if (
      x > deleteZone.x &&
      x < deleteZone.x + deleteZone.width &&
      y > deleteZone.y &&
      y < deleteZone.y + deleteZone.height
    ) {
      setIsDraggingOverDelete(true);
    } else {
      setIsDraggingOverDelete(false);
    }
  };

  const handleImageDragEnd = (e: any, stickerId: string) => {
    const { x, y } = e.target.position();

    if (
      x > deleteZone.x &&
      x < deleteZone.x + deleteZone.width &&
      y > deleteZone.y &&
      y < deleteZone.y + deleteZone.height
    ) {
      removeSticker(stickerId);
    }

    setHeldStickerId(null);
    setIsDraggingOverDelete(false);
  };

  const handleFontSelect = (font: string) => {
    setSelectedFont(font);
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Number(event.target.value);
    setStickerSize(newSize);
    updateStickerSliderBackground(newSize); // ✅ Update background dynamically
  };

  // Text Change Handler //
  const handleTextChange = (e: any) => {
    setText(e.target.value);
    // Auto-resize logic
    const el = e.target;
    el.style.height = "auto"; // Reset height
    el.style.height = `${el.scrollHeight}px`; // Set to scrollHeight
    if (e.target.value.length > 0) {
      setTextToolSelected(true);
    }
  };

  // Font Size Handler
  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setFontSize(value);
    updateSliderBackground(value);
  };

  // Font Color Handler
  const handleFontColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontColor(e.target.value);
  };

  // Font Size Range Slider Background Color Update //
  const updateSliderBackground = (value: number) => {
    const percentage = ((value - 10) / (60 - 10)) * 100;
    if (isMobile) {
      setSliderBg(
        `linear-gradient(to right, #0033ff ${percentage}%, #ffffff ${percentage}%)`
      );
    } else {
      setSliderBg(
        `linear-gradient(to right, #0033ff ${percentage}%, #0000003B ${percentage}%)`
      );
    }
  };

  useEffect(() => {
    updateSliderBackground(fontSize);
  }, [fontSize]);
  // Font Size Range Slider Background Color Update //

  // Sticker Size Range Slider Background Color Update //
  const updateStickerSliderBackground = (value: number) => {
    const min = 40; // Slider min value
    const max = 150; // Slider max value
    const percentage = ((value - min) / (max - min)) * 100;

    if (isMobile) {
      setStickerSliderBg(
        `linear-gradient(to right, #0033ff ${percentage}%, #FFFFFF ${percentage}%)`
      );
    } else {
      setStickerSliderBg(
        `linear-gradient(to right, #0033ff ${percentage}%, #0000003B ${percentage}%)`
      );
    }
  };

  // Update background on sticker size change
  useEffect(() => {
    updateStickerSliderBackground(stickerSize);
  }, [stickerSize]);

  // FFmpeg Initial Load //
  useEffect(() => {
    const initGluedInCreator = async () => {
      try {
        await gluedInCreator.load();
      } catch (error) {
        console.log("Error", error);
      }
    };
    initGluedInCreator();
  }, []);

  

  // Set Video Live Stream to Video Element //
  useEffect(() => {
    if (videoRef?.current) {
      gluedInCreator.setVideoElement(videoRef.current);
    }
  }, [gluedInCreator]);

  // Start Live Streaming //
  useEffect(() => {
    const startStreaming = async () => {
      setIsLoading(true);
      try {
        const response = await gluedInCreator.startLiveStream(
          videoRef.current,
          frameSize
        );
        console.log("response", response?.success);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    startStreaming();
  }, [frameSize]);

  // Stop Live Streaming //
  const stopStreaming = async () => {
    setIsLoading(true);
    try {
      const response = await gluedInCreator.stopLiveStream(videoRef.current);
      console.log("response", response?.success);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  // Start Video Recording //
  const startRecording = async () => {
    try {
      const response = await gluedInCreator.startRecording(
        videoRef.current,
        frameSize
      );
      console.log("response", response?.success);
    } catch (error) {
      console.log(error);
    }
  };

  // Stop Video Recording //
  const stopRecording = async () => {
    setIsLoading(true);
    try {
      const response = await gluedInCreator.stopRecording();
      console.log("response", response?.success);
      stopStreaming();
      setStoryPayload((prevPayload: any) => {
        const updatedPayload = { ...prevPayload };
        if (updatedPayload.stories.length > 0) {
          updatedPayload.stories[0].contentUrl[0].type = "video";
          updatedPayload.stories[0].contentType = "video";
        }
        return updatedPayload;
      });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  // Camera Switch Handler //
  const handleSwitchCamera = async () => {
    setIsLoading(true);
    try {
      await gluedInCreator.toggleCamera(videoRef.current, frameSize);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleCaptureImage = async () => {
    try {
      const response = await gluedInCreator.captureImage(
        videoRef.current,
        imageRef.current,
        frameSize
      );
      console.log("response", response);
      setCapturedImage(response?.capturedImageUrl);
      stopStreaming();
      setStoryPayload((prevPayload: any) => {
        const updatedPayload = { ...prevPayload };
        if (updatedPayload.stories.length > 0) {
          updatedPayload.stories[0].contentUrl[0].type = "image";
          updatedPayload.stories[0].contentType = "image";
        }
        return updatedPayload;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreatorClose = async () => {
    if (!showPopup) {
      setShowPopup(true);
      setShowBackButton(true);
      setPopupTitle("Are you sure you want to exit from creator?");
      return;
    }

    try {
      await gluedInCreator.stopLiveStream(videoRef.current);
      navigate("/create-post");

      // Reload the page after navigation
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlayPause = () => {
    if (recordedVideoRef.current) {
      if (recordedVideoRef.current.paused || recordedVideoRef.current.ended) {
        recordedVideoRef.current.play();
        setIsPlaying(true);
      } else {
        recordedVideoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleMuteUnmute = () => {
    if (recordedVideoRef.current) {
      recordedVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleCreatorPostTypeSelection = () => {
    if (postType === "") {
      alert("Please select story or post");
      return;
    } else {
      setStep("save&next");
      setShowCreatorTools(true);
    }
  };

  const handleGenerateThumbnails = async () => {
    try {
      setSelectedTool("trimming");
      setStep("trimming");
      setThumbnails([]); // Reset thumbnails before generating new ones

      await gluedInCreator.generateThumbnails(
        recordedVideo,
        (newThumbnails: string[]) => {
          setThumbnails([...newThumbnails]); // ✅ Update state immediately as thumbnails are generated
        },
        (progress: any) => {
          console.log("Thumbnail Progress:", progress);
        }
      );
    } catch (error) {
      console.error("Error generating thumbnails:", error);
    }
  };

  const handleFilterSelect = async () => {
    setIsPanelOpen(true);
    setSelectedTool("filter");
  };

  const handleFilterApply = async (videoUrl: any) => {
    try {
      if (videoUrl) {
        const videoFilterURL = await gluedInCreator.applyVideoFilter(
          videoUrl,
          selectedFilter.filterName,
          //   (progress: any) => setIsProgress(progress)
          (progress: any) => console.log("Progress", progress)
        );
        return videoFilterURL;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStickerSelect = async () => {
    setIsPanelOpen(true);
    setSelectedTool("sticker");
  };

  const handleStickerApply = async (videoUrl: any) => {
    try {
      if (videoUrl) {
        const videoStickerURL = await gluedInCreator.applyStickerToVideo(
          videoUrl,
          stickers,
          stickerSize,
          //   (progress: any) => setIsProgress(progress)
          (progress: any) => console.log("Progress", progress)
        );
        return videoStickerURL;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTextSelect = async () => {
    setIsPanelOpen(true);
    setSelectedTool("text");
  };

  const handleTextApply = async (videoUrl: any) => {
    try {
      if (videoUrl && text.length > 0) {
        const videoTextUrl = await gluedInCreator.applyTextToVideo(
          videoUrl,
          text,
          fontColor,
          fontSize,
          position,
          selectedFont,
          //   (progress: any) => setIsProgress(progress)
          (progress: any) => console.log("Progress", progress)
        );
        return videoTextUrl;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Resize the stage dynamically to fit the parent container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Keep stickers within bounds when dragged
  const handleDragEnd = (e: any, id: number) => {
    setStickers((prev) =>
      prev.map((sticker) =>
        sticker.id === id
          ? {
              ...sticker,
              x: Math.max(0, Math.min(e.target.x(), dimensions.width - 50)), // Keep within width
              y: Math.max(0, Math.min(e.target.y(), dimensions.height - 50)), // Keep within height
            }
          : sticker
      )
    );
    const { x, y } = e.target.position();
    if (
      x > deleteZone.x &&
      x < deleteZone.x + deleteZone.width &&
      y > deleteZone.y &&
      y < deleteZone.y + deleteZone.height
    ) {
      removeSticker(id);
    }

    setHeldStickerId(null);
    setIsDraggingOverDelete(false);
  };

  const handleMouseDown = (handle: "start" | "end") => {
    setIsDragging(handle);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && sliderContainerRef.current) {
      const sliderRect = sliderContainerRef.current.getBoundingClientRect();
      const sliderWidth = sliderRect.width;
      const offsetX = e.clientX - sliderRect.left;
      const newPercentage = (offsetX / sliderWidth) * 100;

      if (isDragging === "start" && newPercentage < end) {
        setStart(Math.max(0, Math.min(newPercentage, 100)));

        // Seek video to new start time
        const newStart = Math.max(0, Math.min(newPercentage, 100));
        const newStartTime = (newStart / 100) * videoDuration;
        if (recordedVideoRef.current) {
          recordedVideoRef.current.currentTime = newStartTime;
        }
      } else if (isDragging === "end" && newPercentage > start) {
        setEnd(Math.max(0, Math.min(newPercentage, 100)));
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      handleMouseMove({ clientX: touch.clientX } as MouseEvent);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  const handleTrimReset = () => {
    setSelectedTool("");
  };

  const handleTextReset = () => {
    setIsPanelOpen(false);
    setSelectedTool("");
    setText("");
    setTextToolSelected(false);
    setPosition({
      x: dimensions.width / 2 - 100, // Center horizontally
      y: dimensions.height / 2, // Center vertically
    }); // Reset position to default
  };

  const handleDiscard = () => {
    setPopupTitle("Are you sure you want to Discard?");
    setShowPopup(true);
  };

  const handleTrim = async () => {
    try {
      setIsLoading(true);
      // Calculate trim start and end based on slider values
      const startTime = ((start / 100) * videoDuration).toFixed(2);
      const endTime = ((end / 100) * videoDuration).toFixed(2);

      if (Math.abs(parseInt(startTime) - parseInt(endTime)) < 6) {
        setPopupTitle("Trim at least 6 seconds");
        setShowBackButton(false);
        setShowPopup(true);
      } else {
        const trimmedURL = await gluedInCreator.trim(
          musicVideo ? musicVideo : recordedVideo,
          startTime,
          endTime,
          videoDuration,
          //   (progress: any) => setIsProgress(progress)
          (progress: any) => console.log("Progress", progress)
        );
        console.log("Trimmed Url", trimmedURL);
        setTrimmedVideo(trimmedURL);
        setStep("trimmed");
        setSelectedTool("");
      }
    } catch (error) {
      console.error("Error trimming video:", error);
    }
    setIsLoading(false);
  };

  const handleMusicSelect = () => {
    setIsPanelOpen(true);
    setSelectedTool("music");
  };

  const fetchAudioAsBlob = async (musicUrl: any) => {
    try {
      const response = await fetch(musicUrl, {
        method: "GET",
        mode: "cors", // Important for CORS
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("CORS Error:", error);
      return null;
    }
  };

  const handleApplyAudio = async (videoUrl: any) => {
    try {
      if (videoUrl) {
        const musicFile = await fetchAudioAsBlob(audioFile?.soundUrl);
        const videoSoundUrl = await gluedInCreator.applyAudioToVideo(
          videoUrl,
          musicFile,
          0,
          100,(progress:any)=>{
            console.log("Progress", progress);
          }
        );

        return videoSoundUrl;
      } else {
        console.error("Missing video or audio file");
      }
    } catch (error) {
      console.log("Error applying audio:", error);
    }
  };

  const handleMusicPayload = async (track: any) => {
    setStoryPayload((prevPayload: any) => {
      const updatedPayload = { ...prevPayload };
      if (updatedPayload.stories.length > 0) {
        updatedPayload.stories[0].soundId = track?.soundId;
        updatedPayload.stories[0].soundName = track?.name;
        updatedPayload.stories[0].soundThumbnail = track?.thumbnail;
        updatedPayload.stories[0].contentUrl[0].type = "video";
        updatedPayload.stories[0].contentType = "video";
      }
      return updatedPayload;
    });
  };

  const handleFriendSelect = () => {
    setIsPanelOpen(true);
    setSelectedTool("friend");
  };

  const handleCreateStory = async () => {
    setStoryPayload(async (prevState: any) => {
      const updatedPayload = {
        ...prevState,
        stories: prevState?.stories?.map((story: any) => ({
          ...story,
          contentUrl: story.contentUrl.map((content: any) => ({
            ...content,
            type:
              contentType === "video" || musicToolSelected ? "video" : "image",
          })),
        })),
      };

      //Ensure the request is made after the state update
      setIsLoading(true);
      try {
        const StoryResponse = await StoryModule.createStory(updatedPayload);
        if (StoryResponse?.status === 200) {
          window.location.href = "/my-profile";
          showNotification({
            title: "Create Story",
            subTitle: "Story created successfully",
            type: TOAST_TYPES.SUCCESS,
          });
        } else {
          showNotification({
            title: "Create Story",
            subTitle: "Server error! please try again",
            type: TOAST_TYPES.ERROR,
          });
        }
      } catch (error) {
        console.error("Error creating story:", error);
        showNotification({
          title: "Create Story",
          subTitle: "Server error! please try again",
          type: TOAST_TYPES.ERROR,
        });
      }

      //   await axios
      //     .post("https://stag-v2-api.gluedin.io/v1/story/create", updatedPayload, {
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${userData?.token}`,
      //       },
      //     })
      //     .then((response) => {
      //       console.log("Story created successfully:", response.data);
      //       //   window.location.href = "/my-profile";
      //     })
      //     .catch((error) => {
      //       console.error("Error creating story:", error);
      //     });
      setIsLoading(false);
      return updatedPayload;
    });
  };

  const getSignedUrl = async () => {
    const feedModuleObj = new gluedin.GluedInFeedModule();
    const feedModuleResponse = await feedModuleObj.getSignedUrl({
      type: contentType,
    });
    return feedModuleResponse;
  };

  const readFile = async (inputFile: any) => {
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
            .then(async (response) => {
              setIsUploadingVideo(false);
              const file1 = inputFile;
              const videoUrlBlob = URL.createObjectURL(file1);
              sessionStorage.setItem("videoUrls", JSON.stringify([videoUrl]));
              sessionStorage.setItem(
                "blobUrls",
                JSON.stringify([videoUrlBlob])
              );

              // Update storyPayload state with imageUrl
              setStoryPayload((prevPayload: any) => {
                const updatedPayload = { ...prevPayload };
                if (updatedPayload?.stories?.length > 0) {
                  updatedPayload.stories[0].contentUrl[0].urls[0] = videoUrl;
                }
                return updatedPayload;
              });

              if (postType === "story") {
                handleCreateStory();
              } else {
                // navigate(`/create-post-page-02?contentType=${contentType}`);
                window.location.href = `/create-post-page-02?contentType=${contentType}`;
              }
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
            navigate("/sign-in");
          }
        }
      };

      reader.readAsDataURL(inputFile);
    }
  };

  const readImageFile = async (inputFile: any) => {
    if (inputFile) {
      setIsUploadingImage(true);
      const reader = new FileReader();
      reader.onload = async function () {
        let {
          status,
          data: {
            result: { uploadUrl: signedUrl, url: imageUrl },
          },
        } = await getSignedUrl(); // Fetch signed URL for image upload

        if (status === 200) {
          const file = inputFile;
          const requestOptions: any = {
            method: "PUT",
            body: file,
            redirect: "follow",
          };

          fetch(signedUrl, requestOptions)
            .then(async (response) => {
              setIsUploadingImage(false);
              const imageBlobUrl = URL.createObjectURL(file);
              sessionStorage.setItem("imageUrls", JSON.stringify([imageUrl]));
              sessionStorage.setItem(
                "blobUrls",
                JSON.stringify([imageBlobUrl])
              );
              console.log("imageBlobUrl", imageBlobUrl);

              // Update storyPayload state with imageUrl
              setStoryPayload((prevPayload: any) => {
                const updatedPayload = { ...prevPayload };
                if (updatedPayload.stories.length > 0) {
                  updatedPayload.stories[0].contentUrl[0].urls[0] = imageUrl;
                }
                return updatedPayload;
              });

              if (postType === "story") {
                handleCreateStory();
              } else {
                // navigate(
                //   `/create-post-page-02?contentType=${contentType}&music=${musicToolSelected}`
                // );
                window.location.href = `/create-post-page-02?contentType=${contentType}&music=${musicToolSelected}`;
              }
            })
            .then(() => {
              setIsUploadingImage(false);
            })
            .catch(() => {
              setIsUploadingImage(false);
            });
        } else {
          if (status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/sign-in");
          }
        }
      };

      reader.readAsDataURL(inputFile);
    }
  };

  const handleCreateVideoPost = async (
    videoUrl: any,
    fileName = "video.mp4"
  ) => {
    try {
      setIsLoading(true);
      if (videoUrl) {
        let url = videoUrl;
        if (filterToolSelected) {
          url = await handleFilterApply(url);
        }
        if (stickerToolSelected) {
          url = await handleStickerApply(url);
        }
        if (textToolSelected) {
          url = await handleTextApply(url);
        }
        // if (musicToolSelected) {
        //   url = await handleApplyAudio(url);
        // }

        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], fileName, { type: "video/mp4" });
        readFile(file);
      }
    } catch (error) {
      console.error("Error converting blob to file:", error);
    }
    setIsLoading(false);
  };

  const handleCreateImagePost = async (
    imageUrl: any,
    fileName = "input.png"
  ) => {
    try {
      setIsLoading(true);
      if (!imageUrl) return;

      let processedUrl = imageUrl;
      if (filterToolSelected) {
        processedUrl = await gluedInCreator.applyImageFilter(
          imageUrl,
          selectedFilter.filterName,
          //   (progress: any) => setIsProgress(progress)
          (progress: any) => console.log("Progress", progress)
        );
      }
      if (stickerToolSelected) {
        processedUrl = await gluedInCreator.applyStickerToImage(
          processedUrl,
          stickers,
          stickerSize,
          //   (progress: any) => setIsProgress(progress)
          (progress: any) => console.log("Progress", progress)
        );
      }
      if (textToolSelected) {
        processedUrl = await gluedInCreator.applyTextToImage(
          processedUrl,
          text,
          fontColor,
          fontSize,
          position,
          selectedFont,
          //   (progress: any) => setIsProgress(progress)
          (progress: any) => console.log("Progress", progress)
        );
      }
      if (musicToolSelected) {
        const musicFile = await fetchAudioAsBlob(audioFile?.soundUrl);
        console.log("musicFile", musicFile);
        processedUrl = await gluedInCreator.applyAudioToImage(
          processedUrl,
          musicFile,
          0,
          100,
          5,
          //   (progress: any) => setIsProgress(progress)
          (progress: any) => console.log("Progress", progress)
        );
      }

      const response = await fetch(processedUrl);
      const blob = await response.blob();
      const file = new File([blob], fileName, {
        type: musicToolSelected ? "video/mp4" : "image/png",
      });
      readImageFile(file);
    } catch (error) {
      console.error("Error processing image file:", error);
    }
    setIsLoading(false);
  };

  const removeSticker = (id: any) => {
    setStickers((prev) => prev.filter((sticker) => sticker.id !== id)); // Update parent state
  };

  useEffect(() => {
    const handleBindAudio = async () => {
      setIsLoading(true);
      const musicFile = await fetchAudioAsBlob(audioFile?.soundUrl);
      const videoSoundUrl = await gluedInCreator.applyAudioToVideo(
        trimmedVideo ? trimmedVideo : recordedVideo,
        musicFile,
        0,
        100,
        // (progress: any) => setIsProgress(progress)
        (progress: any) => console.log("Progress", progress)
      );
      console.log("videoSoundUrl", videoSoundUrl);
      setMusicVideo(videoSoundUrl);
      setIsLoading(false);
    };
    if (audioFile && contentType === "video") {
      handleBindAudio();
    } else {
      setMusicVideo(trimmedVideo ?? recordedVideo);
    }
  }, [audioFile]);

  const handleRemoveUser = (user: any) => {
    const indexToRemove = storyPayload.taggedUsers.findIndex(
      (taggedUser: any) => taggedUser.id === user.id
    );
    if (indexToRemove !== -1) {
      storyPayload.taggedUsers.splice(indexToRemove, 1);
    }
    setStoryPayload((prev: any) => ({
      ...prev,
      taggedUsers: [...storyPayload.taggedUsers],
    }));
  };

  const removeGrayIcon = new window.Image();
  removeGrayIcon.src = DeleteGrayIcon;

  const removeRedIcon = new window.Image();
  removeRedIcon.src = DeleteRedIcon;

  const handleMove = (clientY: number) => {
    const track = sliderRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const offsetY = clientY - rect.top;
    const percent = 1 - offsetY / rect.height;
    const newValue = Math.min(
      60,
      Math.max(10, Math.round(10 + percent * (60 - 10)))
    );
    setFontSize(newValue);
  };

  const handleSliderMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientY);

    const onMouseMove = (moveEvent: MouseEvent) => {
      handleMove(moveEvent.clientY);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientY);

    const onTouchMove = (touchEvent: TouchEvent) => {
      touchEvent.preventDefault(); // ⛔ Prevent scrolling
      touchEvent.stopPropagation();
      handleMove(touchEvent.touches[0].clientY);
    };

    const onTouchEnd = () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };

    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
  };

  const updateStickerSize = (clientY: number) => {
    const track = stickerSliderRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const offsetY = clientY - rect.top;
    const percent = 1 - offsetY / rect.height;
    const newValue = Math.min(
      150,
      Math.max(40, Math.round(40 + percent * (150 - 40)))
    );
    setStickerSize(newValue);
  };

  const handleStickerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    updateStickerSize(e.clientY);

    const onMouseMove = (moveEvent: MouseEvent) => {
      updateStickerSize(moveEvent.clientY);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove, { passive: false });
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleStickerTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    updateStickerSize(e.touches[0].clientY);

    const onTouchMove = (touchEvent: TouchEvent) => {
      touchEvent.preventDefault(); // ⛔ Prevent scrolling
      touchEvent.stopPropagation();
      updateStickerSize(touchEvent.touches[0].clientY);
    };

    const onTouchEnd = () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };

    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
  };

  return (
    <>
      <div className="page">
        <div className="page-container">
          <button
            className={`creator-close ${
              isMobile &&
              (selectedTool === "text" ||
                selectedTool === "trimming" ||
                showCreatorTools)
                ? "hidden"
                : ""
            }`}
            onClick={handleCreatorClose}
          >
            <CreatorCloseIcon />
          </button>

          <div className="creator" ref={containerRef}>
            {isMobile && (recordedVideo || capturedImage) && (
              <button className="back-button" onClick={handleDiscard}>
                <BackIcon />
              </button>
            )}

            {(isLoading || isUploadingVideo || isUploadingImage) && (
              <div className="loader-overlay">
                <div className="loader-content">
                  <Processing />
                  {isProgress && <p>{isProgress}%</p>}
                </div>
              </div>
            )}

            <div
              className={`creator-header ${
                isMobile &&
                (selectedTool === "text" || selectedTool === "trimming")
                  ? "hidden"
                  : ""
              }`}
            >
              {isRecording && contentType === "video" && (
                <div className="creator-playback">{playbackTime} / 60 Sec</div>
              )}

              {(recordedVideo || capturedImage) && step === "postType" && (
                <button
                  className="btn_next"
                  onClick={handleCreatorPostTypeSelection}
                >
                  Next
                </button>
              )}

              {recordedVideo && step === "save&next" && (
                <button
                  className="btn_next"
                  onClick={() =>
                    handleCreateVideoPost(
                      musicVideo ? musicVideo : recordedVideo
                    )
                  }
                >
                  {postType === "story" ? "Post" : "Next"}
                </button>
              )}

              {capturedImage && step === "save&next" && (
                <button
                  className="btn_next"
                  onClick={() => handleCreateImagePost(capturedImage)}
                >
                  {postType === "story" ? "Post" : "Next"}
                </button>
              )}

              {recordedVideo && step === "trimming" && !isMobile && (
                <button
                  className={`btn_next ${step === "trimming" ? "bottom" : ""}`}
                  onClick={handleTrim}
                >
                  Done
                </button>
              )}

              {trimmedVideo && step === "trimmed" && (
                <button
                  className="btn_next"
                  onClick={() =>
                    handleCreateVideoPost(
                      musicVideo ? musicVideo : trimmedVideo
                    )
                  }
                >
                  {postType === "story" ? "Post" : "Next"}
                </button>
              )}
            </div>

            {(trimmedVideo || recordedVideo) && contentType === "video" ? (
              <>
                <video
                  src={
                    musicVideo
                      ? musicVideo
                      : trimmedVideo
                      ? trimmedVideo
                      : recordedVideo
                  }
                  poster={poster || ""}
                  ref={recordedVideoRef}
                  playsInline
                  webkit-playsinline={"true"}
                  controls={false}
                  className={`creator-captured-video ${
                    frameSize === "9:16" ? "rounded-[10px]" : "rounded-none"
                  }`}
                  onEnded={() => setIsPlaying(false)}
                  style={{ filter: selectedFilter.filterValue }}
                  muted
                />
                {/* Custom Controls */}
                <div
                  className={`creator-captured-video-controls ${
                    isMobile &&
                    (selectedTool === "text" || selectedTool === "trimming")
                      ? "hidden"
                      : ""
                  }`}
                >
                  {isMobile ? (
                    <button
                      onClick={handlePlayPause}
                      className="btn_play_pause"
                    >
                      {isPlaying ? <VideoPauseMobile /> : <VideoPlayMobile />}
                    </button>
                  ) : (
                    <button onClick={handlePlayPause} className="btn_actions">
                      {isPlaying ? <VideoPause /> : <VideoPlay />}
                    </button>
                  )}

                  <button onClick={handleMuteUnmute} className="btn_actions">
                    {isMuted ? <VideoMute /> : <VideoUnmute />}
                  </button>
                </div>

                {stickerToolSelected && (
                  <Stage
                    width={dimensions.width}
                    height={dimensions.height}
                    style={{
                      position: "absolute",
                      top: "0",
                      height: "calc(100dvh - 60px)",
                      width: "calc((100dvh - 60px) * 0.5625)",
                      zIndex: 10,
                    }}
                    id="sticker-canvas"
                  >
                    <Layer>
                      {stickers?.map((sticker) => (
                        <Image
                          key={sticker.id}
                          image={sticker.image}
                          x={sticker.x}
                          y={sticker.y}
                          draggable
                          width={stickerSize}
                          height={stickerSize}
                          onMouseDown={() => handleStickerPress(sticker.id)}
                          onTouchStart={() => handleStickerPress(sticker.id)}
                          onMouseUp={handleStickerRelease}
                          onTouchEnd={handleStickerRelease}
                          onDragMove={handleDragMove}
                          onDragEnd={(e) => handleDragEnd(e, sticker.id)}
                        />
                      ))}
                    </Layer>

                    {/* Delete Zone (Visible Only on Long Press) */}
                    {heldStickerId && (
                      <Layer>
                        <Rect
                          x={deleteZone.x}
                          y={deleteZone.y}
                          width={dimensions.width}
                          height={80}
                          // fill={isDraggingOverDelete ? "#D22B2B" : "#000000b3"}
                          //   opacity={0.8}
                          cornerRadius={isMobile ? [0] : [0, 0, 10, 10]}
                        />
                        {/* Trash Icon */}
                        <Image
                          image={
                            isDraggingOverDelete
                              ? removeRedIcon
                              : removeGrayIcon
                          }
                          x={
                            isMobile
                              ? dimensions.width / 2 - 40
                              : dimensions.width / 2 - 15
                          }
                          y={deleteZone.y + 25}
                          width={30}
                          height={30}
                        />
                      </Layer>
                    )}
                  </Stage>
                )}

                {textToolSelected && (!isMobile || !isPanelOpen) && (
                  <div className="text-tool-container">
                    <Draggable
                      position={position}
                      onStart={() => setIsDraggingText(true)}
                      onDrag={(e: any, data: any) => {
                        setPosition({ x: data.x, y: data.y });

                        // Check if text is inside delete zone
                        if (data.y + 30 > deleteZone.y) {
                          setIsDraggingOverTextDelete(true);
                        } else {
                          setIsDraggingOverTextDelete(false);
                        }
                      }}
                      onStop={(e: any, data: any) => {
                        setPosition({ x: data.x, y: data.y });

                        // If dropped inside delete zone, remove text & reset position
                        if (isDraggingOverTextDelete) {
                          setText("");
                          setTextToolSelected(false);
                          setPosition({
                            x: dimensions.width / 2 - 100, // Center horizontally
                            y: dimensions.height / 2, // Center vertically
                          }); // Reset position to default
                        }

                        setIsDraggingOverTextDelete(false);
                        setIsDraggingText(false);
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: `${position.x}px`,
                          top: `${position.y}px`,
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            position: "relative",
                            borderRadius: "4px",
                          }}
                        >
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onFocus={() => setIsEditing(true)}
                            style={{
                              color: fontColor,
                              fontSize: `${fontSize}px`,
                              outline: "none",
                              cursor: "move",
                              fontFamily: `${selectedFont}, sans-serif`,
                              zIndex: 10,
                            }}
                            onBlur={(e) => {
                              const newText = e.currentTarget.textContent || "";
                              if (newText !== text) {
                                setText(newText);
                              }
                            }}
                          >
                            {text}
                          </div>
                        </div>
                      </div>
                    </Draggable>

                    {/* Delete Zone (Appears Only When Dragging) */}
                    {isDraggingText && (
                      <div
                        className={`delete-zone ${
                          isDraggingOverTextDelete ? "active" : ""
                        }`}
                        style={{
                          position: "absolute",
                          bottom: "0",
                          left: "0",
                          right: "0",
                          width: "100%",
                          height: "80px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: isMobile ? "0" : "0 0 10px 10px",
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        <img
                          src={
                            isDraggingOverTextDelete
                              ? DeleteRedIcon
                              : DeleteGrayIcon
                          }
                          alt="Delete"
                          style={{
                            width: "30px",
                            height: "30px",
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : capturedImage && contentType === "image" ? (
              <>
                <img
                  src={capturedImage}
                  alt="Captured"
                  style={{
                    width: "100%",
                    height: "auto",
                    filter: selectedFilter.filterValue,
                  }}
                  ref={imageRef}
                  className={`creator-captured-image ${
                    frameSize === "9:16" ? "rounded-[10px]" : "rounded-none"
                  }`}
                />
                {stickerToolSelected && (
                  <Stage
                    width={dimensions.width}
                    height={dimensions.height}
                    style={{
                      position: "absolute",
                      top: "0",
                      height: "calc(100dvh - 60px)",
                      width: "calc((100dvh - 60px) * 0.5625)",
                      zIndex: 10,
                    }}
                    id="sticker-canvas"
                  >
                    <Layer>
                      {stickers?.map((sticker) => (
                        <Image
                          key={sticker.id}
                          image={sticker.image}
                          x={sticker.x}
                          y={sticker.y}
                          draggable
                          width={stickerSize}
                          height={stickerSize}
                          onMouseDown={() => handleStickerPress(sticker.id)}
                          onTouchStart={() => handleStickerPress(sticker.id)}
                          onMouseUp={handleStickerRelease}
                          onTouchEnd={handleStickerRelease}
                          onDragMove={handleDragMove}
                          onDragEnd={(e) => handleDragEnd(e, sticker.id)}
                        />
                      ))}
                    </Layer>

                    {/* Delete Zone (Visible Only on Long Press) */}
                    {heldStickerId && (
                      <Layer>
                        <Rect
                          x={deleteZone.x}
                          y={deleteZone.y}
                          width={dimensions.width}
                          height={80}
                          // fill={isDraggingOverDelete ? "#D22B2B" : "#000000b3"}
                          //   opacity={0.8}
                          cornerRadius={isMobile ? [0] : [0, 0, 10, 10]}
                        />
                        {/* Trash Icon */}
                        <Image
                          image={
                            isDraggingOverDelete
                              ? removeRedIcon
                              : removeGrayIcon
                          }
                          x={
                            isMobile
                              ? dimensions.width / 2 - 40
                              : dimensions.width / 2 - 15
                          }
                          y={deleteZone.y + 25}
                          width={30}
                          height={30}
                        />
                      </Layer>
                    )}
                  </Stage>
                )}
                {textToolSelected && (!isMobile || !isPanelOpen) && (
                  <div className="text-tool-container">
                    <Draggable
                      position={position}
                      onStart={() => setIsDraggingText(true)}
                      onDrag={(e: any, data: any) => {
                        setPosition({ x: data.x, y: data.y });

                        // Check if text is inside delete zone
                        if (data.y + 30 > deleteZone.y) {
                          setIsDraggingOverTextDelete(true);
                        } else {
                          setIsDraggingOverTextDelete(false);
                        }
                      }}
                      onStop={(e: any, data: any) => {
                        setPosition({ x: data.x, y: data.y });

                        // If dropped inside delete zone, remove text & reset position
                        if (isDraggingOverTextDelete) {
                          setText("");
                          setTextToolSelected(false);
                          setPosition({
                            x: dimensions.width / 2 - 100, // Center horizontally
                            y: dimensions.height / 2, // Center vertically
                          }); // Reset position to default
                        }

                        setIsDraggingOverTextDelete(false);
                        setIsDraggingText(false);
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: `${position.x}px`,
                          top: `${position.y}px`,
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            position: "relative",
                            borderRadius: "4px",
                          }}
                        >
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onFocus={() => setIsEditing(true)}
                            style={{
                              color: fontColor,
                              fontSize: `${fontSize}px`,
                              outline: "none",
                              cursor: "move",
                              fontFamily: `${selectedFont}, sans-serif`,
                              zIndex: 10,
                            }}
                            onBlur={(e) => {
                              const newText = e.currentTarget.textContent || "";
                              if (newText !== text) {
                                setText(newText);
                              }
                            }}
                          >
                            {text}
                          </div>
                        </div>
                      </div>
                    </Draggable>

                    {/* Delete Zone (Appears Only When Dragging) */}
                    {isDraggingText && (
                      <div
                        className={`delete-zone ${
                          isDraggingOverTextDelete ? "active" : ""
                        }`}
                        style={{
                          position: "absolute",
                          bottom: "0",
                          left: "0",
                          right: "0",
                          width: "100%",
                          height: "80px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: isMobile ? "0" : "0 0 10px 10px",
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        <img
                          src={
                            isDraggingOverTextDelete
                              ? DeleteRedIcon
                              : DeleteGrayIcon
                          }
                          alt="Delete"
                          style={{
                            width: "30px",
                            height: "30px",
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`${
                  frameSize === "9:16" ? "rounded-[10px]" : "rounded-none"
                }`}
              />
            )}

            {contentType === "image" && (
              <img
                src={capturedImage}
                alt="Captured"
                style={{
                  width: "0",
                  height: "0",
                  opacity: "0",
                  visibility: "hidden",
                }}
                ref={imageRef}
              />
            )}

            {postType === "story" && storyPayload?.stories?.length > 0 && (
              <TaggedFriendsList
                taggedFriends={storyPayload?.stories[0].taggedUsers || []}
                handleRemove={(user) =>
                  setStoryPayload((prev: any) => ({
                    ...prev,
                    stories:
                      prev.stories.length > 0
                        ? [
                            {
                              ...prev.stories[0],
                              taggedUsers:
                                prev.stories[0]?.taggedUsers?.filter(
                                  (taggedUser: any) => taggedUser.id !== user.id
                                ) || [],
                            },
                          ]
                        : [],
                  }))
                }
              />
            )}

            <div className="creator-footer">
              {!recordedVideo && !capturedImage && !isRecording && (
                <div className="frame-size">
                  <button
                    className={frameSize === "1:1" ? "active" : ""}
                    onClick={() => setFrameSize("1:1")}
                  >
                    <Frame11Icon />
                  </button>
                  <button
                    className={frameSize === "9:16" ? "active" : ""}
                    onClick={() => setFrameSize("9:16")}
                  >
                    <Frame916Icon />
                  </button>
                </div>
              )}

              {contentType === "video" && !recordedVideo && (
                <>
                  {isRecording ? (
                    <div
                      className="relative inline-block"
                      onClick={handleDisabledClick}
                    >
                      <button
                        onClick={stopRecording}
                        disabled={playbackTime < 6}
                        className={`${playbackTime < 6 ? "btn_disabled" : ""}`}
                      >
                        {/* <CameraStopIcon /> */}
                        <svg width="120" height="120" viewBox="0 0 120 120">
                          {/* Background Circle */}
                          <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="#fff"
                            strokeWidth={strokeWidth}
                            fill="none"
                          />

                          {/* Progress Circle */}
                          <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="#03f"
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={progressOffset}
                            strokeLinecap="round"
                            transform="rotate(-90 60 60)"
                            style={{
                              transition: "stroke-dashoffset 0.5s linear",
                            }}
                          />
                          <rect
                            x="33%"
                            y="33%"
                            id="Rectangle_13019"
                            data-name="Rectangle 13019"
                            width="40"
                            height="40"
                            rx="3"
                            fill="#03f"
                            opacity="0.75"
                          />
                        </svg>
                      </button>
                      {showTooltip && playbackTime < 6 && (
                        <div className="tooltip">
                          You need at least 6 seconds of recording to stop.
                        </div>
                      )}
                    </div>
                  ) : (
                    <button onClick={startRecording}>
                      <CameraStartIcon />
                    </button>
                  )}
                </>
              )}

              {contentType === "image" && !capturedImage && (
                <>
                  <button onClick={handleCaptureImage}>
                    <CameraStartIcon />
                  </button>
                </>
              )}

              {!recordedVideo && !capturedImage && !isRecording && (
                <div className="creator-content-type">
                  <button
                    className={contentType === "video" ? "active" : ""}
                    onClick={() => setContentType("video")}
                  >
                    Video
                  </button>
                  <button
                    className={contentType === "image" ? "active" : ""}
                    onClick={() => setContentType("image")}
                  >
                    Image
                  </button>
                </div>
              )}

              {(recordedVideo || capturedImage) &&
                !isRecording &&
                step === "postType" && (
                  <div className="creator-content-type">
                    <button
                      className={postType === "story" ? "active" : ""}
                      onClick={() => setPostType("story")}
                    >
                      Story
                    </button>
                    <button
                      className={postType === "post" ? "active" : ""}
                      onClick={() => setPostType("post")}
                    >
                      Post
                    </button>
                  </div>
                )}

              {(!recordedVideo || !capturedImage) &&
                isLiveStreaming &&
                !isRecording && (
                  <button
                    className="btn_switch_camera"
                    onClick={handleSwitchCamera}
                  >
                    <CameraFlipIcon />
                    <span>Flip</span>
                  </button>
                )}

              {/* Thumbnail Generation & Trimming */}
              {recordedVideo &&
                thumbnails?.length > 0 &&
                step === "trimming" && (
                  <>
                    {isMobile && selectedTool === "trimming" && (
                      <button className="back-button" onClick={handleTrimReset}>
                        <BackIcon />
                      </button>
                    )}
                    {isMobile && selectedTool === "trimming" && (
                      <button className="done-button" onClick={handleTrim}>
                        Done
                      </button>
                    )}
                    {selectedTool === "trimming" && (
                      <>
                        <div
                          ref={sliderContainerRef}
                          className="thumbnails-container"
                        >
                          {thumbnails?.map((thumbnail, index) => (
                            <div
                              key={index}
                              className="thumbnail"
                              style={{
                                width: `${100 / thumbnails.length}%`,
                                height: "60px",
                              }}
                            >
                              {thumbnail === "loading" ? (
                                <div className="loader">
                                  <LoaderDark />
                                </div>
                              ) : thumbnail === "error" ? (
                                <div className="error-icon">Error</div>
                              ) : (
                                <img
                                  src={thumbnail}
                                  alt={`Thumbnail ${index + 1}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                            </div>
                          ))}
                          <div
                            className="trim-handle start"
                            style={{
                              left: `${start}%`,
                            }}
                            onMouseDown={() => handleMouseDown("start")}
                            onTouchStart={() => handleMouseDown("start")}
                          >
                            <div
                              style={{
                                left: "0",
                              }}
                              className="trim-text"
                            >
                              {/* {((start / 100) * videoDuration).toFixed(2)}s */}
                              {Math.ceil((start / 100) * videoDuration)}s
                            </div>
                          </div>
                          <div
                            className="thumbnail-overlay overlay-start"
                            style={{
                              width: `${start}%`,
                            }}
                          ></div>
                          <div
                            className="thumbnail-overlay overlay-end"
                            style={{
                              width: `${100 - end}%`,
                            }}
                          ></div>
                          <div
                            className="trim-handle end"
                            style={{
                              right: `${100 - end}%`,
                            }}
                            onMouseDown={() => handleMouseDown("end")}
                            onTouchStart={() => handleMouseDown("end")}
                          >
                            <div
                              style={{
                                right: "0",
                              }}
                              className="trim-text"
                            >
                              {/* {((end / 100) * videoDuration).toFixed(2)}s */}
                              {Math.min(
                                Math.ceil((end / 100) * videoDuration),
                                60
                              )}
                              s
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
            </div>

            {showCreatorTools && (
              <>
                <div
                  className={`creator-tools ${
                    isMobile &&
                    (selectedTool === "text" ||
                      selectedTool === "trimming" ||
                      selectedTool === "filter" ||
                      selectedTool === "sticker" ||
                      selectedTool === "music")
                      ? "hidden"
                      : ""
                  }`}
                >
                  <ul className="creator-tools-list">
                    {contentType === "video" && (
                      <li>
                        <button
                          onClick={handleGenerateThumbnails}
                          // className={`${
                          //   selectedTool === "trimming" || trimmedVideo
                          //     ? "active"
                          //     : ""
                          // }`}
                          className={`${
                            selectedTool === "trimming" ? "active" : ""
                          }`}
                        >
                          <ClipIcon />
                        </button>
                      </li>
                    )}

                    <li>
                      <button
                        onClick={handleFilterSelect}
                        // className={`${
                        //   selectedTool === "filter" ||
                        //   selectedFilter.filterValue !== "none"
                        //     ? "active"
                        //     : ""
                        // }`}
                        className={`${
                          selectedTool === "filter" ? "active" : ""
                        }`}
                        disabled={selectedTool === "trimming"}
                      >
                        <FilterIcon />
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleMusicSelect}
                        // ${
                        //     selectedTool === "music" || audioFile?.soundUrl
                        //       ? "active"
                        //       : ""
                        //   }
                        className={`btn-music ${
                          selectedTool === "music" ? "active" : ""
                        }`}
                        disabled={selectedTool === "trimming"}
                      >
                        {audioFile && audioFile?.thumbnail ? (
                          <img
                            src={audioFile?.thumbnail}
                            alt={audioFile?.title}
                            className="w-6 h-6 object-cover rounded-full"
                          />
                        ) : (
                          <MusicIcon />
                        )}
                      </button>
                    </li>
                    {postType === "story" &&
                      storyPayload?.stories?.length > 0 && (
                        <li>
                          <button
                            onClick={handleFriendSelect}
                            // className={`${
                            //   selectedTool === "friend" ||
                            //   storyPayload?.stories[0]?.taggedUsers?.length > 0
                            //     ? "active"
                            //     : ""
                            // }`}
                            className={`${
                              selectedTool === "friend" ? "active" : ""
                            }`}
                            disabled={selectedTool === "trimming"}
                          >
                            <FriendIcons />
                          </button>
                        </li>
                      )}
                    <li>
                      <button
                        onClick={handleTextSelect}
                        // className={`${
                        //   selectedTool === "text" || text.length > 0
                        //     ? "active"
                        //     : ""
                        // }`}
                        className={`${selectedTool === "text" ? "active" : ""}`}
                        disabled={selectedTool === "trimming"}
                      >
                        <TextIcon />
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleStickerSelect}
                        // className={`${
                        //   selectedTool === "sticker" || stickers.length > 0
                        //     ? "active"
                        //     : ""
                        // }`}
                        className={`${
                          selectedTool === "sticker" ? "active" : ""
                        }`}
                        disabled={selectedTool === "trimming"}
                      >
                        <StickerIcon />
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>

        <SidePanel
          isOpen={isPanelOpen}
          onClose={() => {
            setIsPanelOpen(false);
            setSelectedTool("");
          }}
          title={
            selectedTool === "filter"
              ? "Add Filters"
              : selectedTool === "sticker"
              ? "Add Stickers"
              : selectedTool === "text"
              ? "Add Text"
              : selectedTool === "music"
              ? "Select Sound"
              : selectedTool === "friend"
              ? "Tag Friends"
              : "Title"
          }
          className={
            selectedTool === "filter"
              ? "side-panel-filter"
              : selectedTool === "sticker"
              ? "side-panel-sticker"
              : selectedTool === "text"
              ? "side-panel-text"
              : selectedTool === "music"
              ? "side-panel-music"
              : selectedTool === "friend"
              ? "side-panel-friend"
              : "default"
          }
          selectedTool={selectedTool}
          setSelectedFilter={setSelectedFilter}
        >
          {selectedTool === "filter" ? (
            <FilterSelector
              onFilterSelect={(filterName, filterValue) => {
                setSelectedFilter({ filterName, filterValue });
                setFilterToolSelected(true);
              }}
              poster={capturedImage ? capturedImage : poster}
            />
          ) : selectedTool === "sticker" ? (
            <>
              <StickerSelector
                setStickers={setStickers}
                setStickerToolSelected={setStickerToolSelected}
                onStickerApply={handleStickerApply}
                onStickerSelect={handleStickerSelect}
              />
              <div className="text-selector-field mt-4">
                <label htmlFor="">Sticker Size</label>
                {isMobile ? (
                  <div
                    className="custom-slider-wrapper"
                    ref={stickerSliderRef}
                    onMouseDown={handleStickerMouseDown}
                    onTouchStart={handleStickerTouchStart}
                  >
                    <div className="slider-track">
                      <div
                        className="slider-filled"
                        style={{
                          height: `${((stickerSize - 40) / (150 - 40)) * 100}%`,
                        }}
                      />
                      <div
                        className="slider-thumb"
                        style={{
                          bottom: `calc(${
                            ((stickerSize - 40) / (150 - 40)) * 100
                          }% - 10px)`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="slider-container flex items-center gap-2">
                    <input
                      type="range"
                      id="stickerSize"
                      min="40"
                      max="150"
                      value={stickerSize}
                      onChange={handleSizeChange}
                      style={{ background: stickerSliderBg }}
                    />
                    <span>{stickerSize}px</span>
                  </div>
                )}
              </div>
            </>
          ) : selectedTool === "text" ? (
            <>
              <div className="text-selector">
                {isMobile && (
                  <button className="back-button" onClick={handleTextReset}>
                    <BackIcon />
                  </button>
                )}
                {isMobile && (
                  <button
                    className="done-button"
                    onClick={() => {
                      setIsPanelOpen(false);
                      setSelectedTool("");
                    }}
                  >
                    Done
                  </button>
                )}
                {isMobile ? (
                  <div className="mobile-text-input-container">
                    <textarea
                      ref={textInputRef}
                      value={text}
                      onChange={handleTextChange}
                      onFocus={() => text === "Type here..." && setText("")}
                      className="mobile-text-input"
                      placeholder="Type here..."
                      style={{
                        color: fontColor,
                        fontSize: `${fontSize}px`,
                        outline: "none",
                        cursor: "move",
                        fontFamily: `${selectedFont}, sans-serif`,
                        zIndex: 10,
                      }}
                    >
                      {text}
                    </textarea>
                  </div>
                ) : (
                  <div className="text-selector-field">
                    <label htmlFor="">Text</label>
                    <input
                      type="text"
                      placeholder="Enter text"
                      value={text}
                      onChange={handleTextChange}
                    />
                  </div>
                )}

                {isMobile && (
                  <div className="mobile-text-toggle-buttons">
                    <button
                      onClick={() => setSelectedTextTool("font")}
                      className={selectedTextTool === "font" ? "active" : ""}
                    >
                      <svg
                        id="Group_26793"
                        data-name="Group 26793"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24.477"
                        height="24"
                        viewBox="0 0 24.477 24"
                      >
                        <g id="Group_26785" data-name="Group 26785">
                          <path
                            id="Path_16226"
                            data-name="Path 16226"
                            d="M18.987,7.5v20.4h-3.5V7.5H5V4H29.477V7.5Z"
                            transform="translate(-5 -4)"
                            fill="#fff"
                          />
                          <path
                            id="Path_18312"
                            data-name="Path 18312"
                            d="M10.547,5.387v8.088H9.16V5.387H5V4h9.707V5.387Z"
                            transform="translate(9.293 10.418)"
                            fill="#fff"
                          />
                        </g>
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedTextTool("color")}
                      className={selectedTextTool === "color" ? "active" : ""}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22.4"
                        height="24"
                        viewBox="0 0 22.4 24"
                      >
                        <path
                          id="Path_18310"
                          data-name="Path 18310"
                          d="M21.92,20.6H11.533L8.973,27H5.526l9.6-24h3.2l9.6,24H24.48Zm-1.28-3.2L16.726,7.616,12.813,17.4Z"
                          transform="translate(-5.526 -3)"
                          fill="#fff"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Font Selector (Visible on desktop or when "Font" is selected on mobile) */}
                {(!isMobile || selectedTextTool === "font") && (
                  <div className="text-selector-field">
                    <label>Font</label>
                    <div className="text-selector-fonts">
                      {FONTS?.map((font) => (
                        <button
                          key={font}
                          onClick={() => handleFontSelect(font)}
                          style={{
                            borderColor:
                              selectedFont === font
                                ? isMobile
                                  ? "#FFF"
                                  : "#0033FF"
                                : "transparent",
                            fontFamily: font,
                          }}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Picker (Visible on desktop or when "Color" is selected on mobile) */}
                {(!isMobile || selectedTextTool === "color") && (
                  <div className="text-selector-field mt-5">
                    <label>Color</label>
                    <div className="color-picker-container">
                      <input
                        type="color"
                        id="fontColor"
                        value={fontColor}
                        onChange={handleFontColorChange}
                      />
                      <input
                        type="text"
                        value={fontColor}
                        onChange={handleFontColorChange}
                        maxLength={7}
                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                        title="Enter a valid hex color code (e.g., #ff5733)"
                      />
                    </div>
                  </div>
                )}

                <div className="text-selector-field">
                  <label htmlFor="">Font Size</label>
                  {isMobile ? (
                    <div
                      className="custom-slider-wrapper"
                      ref={sliderRef}
                      onMouseDown={handleSliderMouseDown}
                      onTouchStart={handleTouchStart}
                    >
                      <div className="slider-track">
                        <div
                          className="slider-filled"
                          style={{
                            height: `${((fontSize - 10) / (60 - 10)) * 100}%`,
                          }}
                        />
                        <div
                          className="slider-thumb"
                          style={{
                            bottom: `calc(${
                              ((fontSize - 10) / (60 - 10)) * 100
                            }% - 10px)`,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="slider-container">
                      <input
                        type="range"
                        id="fontSize"
                        min="10"
                        max="60"
                        value={fontSize}
                        onChange={handleFontSizeChange}
                        style={{ background: sliderBg }}
                      />
                      <span
                        className="slider-value"
                        style={{
                          left: `calc(${
                            ((fontSize - 10) / (60 - 10)) * 100
                          }% - 15px)`,
                        }}
                      >
                        {fontSize}px
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : selectedTool === "music" ? (
            <>
              <CreatorMusic
                onMusicSelect={(track: any) => {
                  setAudioFile(track);
                  handleMusicPayload(track);
                }}
                setMusicToolSelected={setMusicToolSelected}
                audioFile={audioFile}
              />
            </>
          ) : selectedTool === "friend" ? (
            <>
              <CreatorFriend
                fetchOptions={{
                  itemKeys: {
                    id: "userId",
                    thumbnail: "profileImageUrl",
                    fullName: "fullName",
                    userName: "userName",
                  },
                }}
                handleTag={(user: any) =>
                  setStoryPayload((prev: any) => ({
                    ...prev,
                    stories: [
                      {
                        ...prev.stories[0], // Ensure we're updating the first story object
                        taggedUsers: [...prev.stories[0]?.taggedUsers, user], // Append new user
                      },
                    ],
                  }))
                }
                handleRemove={(user: any) =>
                  setStoryPayload((prev: any) => ({
                    ...prev,
                    stories: [
                      {
                        ...prev.stories[0],
                        taggedUsers: prev.stories[0]?.taggedUsers.filter(
                          (taggedUser: any) => taggedUser.id !== user.id
                        ), // Remove user from the array
                      },
                    ],
                  }))
                }
                taggedItems={storyPayload?.stories[0]?.taggedUsers}
              />
            </>
          ) : (
            "Title"
          )}
        </SidePanel>

        <Popup
          triggerFromParent={showPopup}
          onCancel={() => setShowPopup(false)}
          title={popupTitle}
          message={popupMessage}
          {...(showBackButton && { onBack: handleBackAction })}
        />
      </div>
    </>
  );
}

export default CreatorTools;
