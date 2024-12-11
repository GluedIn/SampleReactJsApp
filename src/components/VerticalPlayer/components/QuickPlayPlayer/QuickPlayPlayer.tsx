import Hls from "hls.js";
import React, { useRef, useEffect } from "react";

interface GluedInerProps {
  url: string;
  id: string;
  videoRef: any;
  thumbnailUrl: any;
  controls: boolean;
  isMuted: boolean;
  isPlaying: boolean;
}

const GluedInPlayer: React.FC<GluedInerProps> = ({
  url,
  id,
  videoRef,
  thumbnailUrl,
  controls,
  isMuted,
  isPlaying,
}) => {
  const hls = useRef<Hls>();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Check file extension to determine video type
    const fileExtension: any = url.split(".").pop()?.toLowerCase();

    if (fileExtension === "m3u8") {
      // HLS video
      if (Hls.isSupported()) {
        // Initialize HLS.js
        hls.current = new Hls();
        hls.current.loadSource(url);
        hls.current.attachMedia(videoElement);

        // Cleanup
        return () => {
          if (hls.current) {
            hls.current.destroy();
          }
        };
      } else {
        console.error("HLS is not supported in this browser.");
      }
    } else if (["mp4", "mov", "m4v"].includes(fileExtension)) {
      // MP4 video
      videoElement.src = url;
    } else {
      console.error("Unsupported video format.");
    }
  }, [url, videoRef]);

  return (
    <video
      id={`video_player_${id}`}
      ref={videoRef}
      className="video_player"
      src={url}
      poster={thumbnailUrl}
      controls={controls}
      muted={isMuted}
      preload="metadata"
      playsInline
      autoPlay={isPlaying}
      loop
    >
      <source src={`${url}#t=0.5`} />
    </video>
  );
};

export default GluedInPlayer;
