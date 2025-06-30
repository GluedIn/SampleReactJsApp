import LoaderDark from "../../common/LoaderDark/LoaderDark";
import "./CreatorSticker.css";
import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState } from "react";

interface StickerSelectorProps {
  setStickers: React.Dispatch<
    React.SetStateAction<
      { id: number; image: HTMLImageElement; x: number; y: number }[]
    >
  >;
  setStickerToolSelected: any;
  onStickerApply: any;
  onStickerSelect: () => void;
}

const FeedModule = new gluedin.GluedInFeedModule();

const StickerSelector: React.FC<StickerSelectorProps> = ({
  setStickers,
  setStickerToolSelected,
  onStickerApply,
  onStickerSelect,
}) => {
  const getStoredSticker = () => localStorage.getItem("stickerName") || null;
  const [isLoading, setIsLoading] = useState(false);
  const [stickerList, setStickerList] = useState([]);
  const [selectedSticker, setSelectedSticker]: any = useState(getStoredSticker);

  useEffect(() => {
    localStorage.setItem("stickerName", selectedSticker);
  }, [selectedSticker]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await FeedModule.getStickerList("");
        const { data: { result = [] } = {} } = response;
        setStickerList(result);
      } catch (error) {
        console.error("Error fetching music list:", error);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Function to add a sticker to the canvas
  const addSticker = (url: string, id: string) => {
    setSelectedSticker(id);
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      const parent = document.getElementById("sticker-canvas");
      if (parent) {
        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;

        const centerX = (parentWidth - 60) / 2;
        const centerY = (parentHeight - 60) / 2;

        setStickers(() => [
          {
            id: Date.now(),
            image: img,
            x: centerX,
            y: centerY,
          },
        ]);
      }
      //   setStickers(() => [{ id: Date.now(), image: img, x: 50, y: 50 }]);
    };
    setStickerToolSelected(true);
  };

  return (
    <>
      {isLoading && <LoaderDark />}

      {stickerList?.length === 0 && <p>No Data Found!</p>}

      {stickerList?.length > 0 && (
        <div className="sticker-selector">
          <h3>Select a Sticker</h3>
          <div className="sticker-list">
            {stickerList?.map((sticker: any) => (
              <img
                key={sticker?.stickerId}
                src={sticker?.coverImage}
                alt={`Sticker ${sticker?.stickerId}`}
                className="sticker-item"
                onClick={() =>
                  addSticker(sticker?.coverImage, sticker?.stickerId)
                }
                style={{
                  width: "60px",
                  height: "60px",
                  //   borderColor: selectedSticker === sticker?.stickerId ? "#0033ff" : "#fff",
                }}
                width={60}
                height={60}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default StickerSelector;
