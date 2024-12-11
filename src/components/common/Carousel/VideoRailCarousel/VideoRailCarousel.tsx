import LeftArrowIcon from "../../../../assets/icons/LeftArrowIcon";
import RightArrowIcon from "../../../../assets/icons/RightArrowIcon";
import "../Carousel.css";
import React, { useState, useRef, useEffect, useCallback } from "react";

interface CarouselProps {
  autoplay?: boolean;
  loop?: boolean;
  carouselItems?: any;
  carouselContentDetail?: any;
}

const VideoRailCarousel: React.FC<CarouselProps> = ({
  autoplay,
  loop,
  carouselItems,
  carouselContentDetail,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [translateX, setTranslateX] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [itemsToShow, setItemsToShow] = useState<number>(8);
  const storedValue = localStorage.getItem("defaultLanguage");

  const calculateItemsToShow = () => {
    if (window.innerWidth <= 576) {
      return 4;
    } else if (window.innerWidth <= 1368) {
      return 6;
    } else {
      return 8;
    }
  };

  const prevSlide = () => {
    if (carouselItems && carouselItems.length <= itemsToShow) {
      return; // Disable prevSlide if there are not enough items to scroll
    }

    if (storedValue === "ar") {
      // Check if the direction is RTL
      setCurrentSlide((prev) =>
        prev === carouselItems!.length - itemsToShow
          ? loop
            ? 0
            : carouselItems!.length - itemsToShow
          : prev + 1
      );
    } else {
      setCurrentSlide((prev) =>
        prev === 0 ? (loop ? carouselItems!.length - 1 : 0) : prev - 1
      );
    }
  };

  const nextSlide = useCallback(() => {
    if (carouselItems && carouselItems.length <= itemsToShow) {
      return; // Disable nextSlide if there are not enough items to scroll
    }

    if (storedValue === "ar") {
      // Check if the direction is RTL
      setCurrentSlide((prev) =>
        prev === 0 ? (loop ? carouselItems!.length - 1 : 0) : prev - 1
      );
    } else {
      setCurrentSlide((prev) =>
        prev === carouselItems!.length - itemsToShow
          ? loop
            ? 0
            : prev
          : prev + 1
      );
    }
  }, [carouselItems, itemsToShow, loop, storedValue]);

  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(calculateItemsToShow());
    };

    // Initial calculation on component mount
    setItemsToShow(calculateItemsToShow());

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (autoplay) {
      intervalId = setInterval(() => {
        nextSlide();
      }, 3000); // Change slide every 3 seconds
    }

    const calculateTranslateX = () => {
      setTranslateX(0); // Reset translateX when number of items to show changes
    };

    window.addEventListener("resize", calculateTranslateX);
    calculateTranslateX();

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", calculateTranslateX);
    };
  }, [autoplay, nextSlide]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging || !carouselRef.current) return;
    const deltaX = e.clientX - startX;
    setTranslateX(deltaX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 100;
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    setTranslateX(0);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !carouselRef.current) return;
    const deltaX = e.touches[0].clientX - startX;
    setTranslateX(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 100;
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    setTranslateX(0);
  };

  return (
    <div className="carousel-container">
      <div
        className="carousel"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={carouselRef}
      >
        <div
          className="slides"
          style={{
            transform: `translateX(${storedValue === "ar" ? "" : "-"}${
              currentSlide * (100 / itemsToShow)
            }%) translateX(${translateX}px)`,
            direction: `${storedValue === "ar" ? "rtl" : "ltr"}`,
          }}
        >
          {carouselItems?.map((videoInfo: any, index: any) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? "active" : ""}`}
              style={{
                flex: `0 0 ${100 / itemsToShow}%`,
              }}
            >
              <div className="box" key={videoInfo.id}>
                <div
                  className="img-box open-video-detail"
                  id={videoInfo.id}
                  style={{
                    background: `url("${
                      videoInfo.thumbnail || videoInfo.thumbnailUrl
                    }") center`,
                    height: "150px !important",
                    backgroundSize: "cover",
                  }}
                  onClick={() => carouselContentDetail(videoInfo)}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="arrow prev"
        onClick={prevSlide}
        disabled={
          (carouselItems && carouselItems?.length <= itemsToShow) ||
          (storedValue === "ar"
            ? currentSlide === carouselItems?.length - itemsToShow && !loop
            : currentSlide === 0 && !loop)
        }
      >
        <LeftArrowIcon />
      </button>
      <button
        className="arrow next"
        onClick={nextSlide}
        disabled={
          (carouselItems && carouselItems?.length <= itemsToShow) ||
          (storedValue === "ar"
            ? currentSlide === 0 && !loop
            : currentSlide === carouselItems?.length - itemsToShow && !loop)
        }
      >
        <RightArrowIcon />
      </button>
    </div>
  );
};

export default VideoRailCarousel;
