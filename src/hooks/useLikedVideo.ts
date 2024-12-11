import gluedin from "gluedin-shorts-js";
import { useEffect, useState } from "react";

const feedModule = new gluedin.GluedInFeedModule();

export default function useLikedVideo(videoId: string) {
  const [isVideoLiked, setIsVideoLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const userData = localStorage.getItem("userData");
  useEffect(() => {
    const fetchLikedVideo = async () => {
      setIsLoading(true);
      try {
        const {
          status,
          data: { result: likedVideoId },
        } = await feedModule.Like([videoId]);
        if (status === 200 || status === 201) {
          if (likedVideoId.length) {
            setIsVideoLiked(true);
          } else {
            setIsVideoLiked(false);
          }
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    };
    if (userData) {
      fetchLikedVideo();
    }
  }, [videoId]);

  return {
    isLoading,
    isVideoLiked,
    setIsVideoLiked,
  };
}
