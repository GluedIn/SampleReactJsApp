import React, { useState } from "react";

export default function useVerticalPlayer() {
  const [videos, setVideos] = useState<any>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  return { videos, setVideos, currentVideoIndex, setCurrentVideoIndex };
}