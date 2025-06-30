import { getLocalisedText } from "../../../../Helper/helper";
import LeftArrowIcon from "../../../../assets/icons/LeftArrowIcon";
import RightArrowIcon from "../../../../assets/icons/RightArrowIcon";
import "../Carousel.css";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { PAGE } from "../../../../constants";

interface CarouselProps {
  autoplay?: boolean;
  loop?: boolean;
  carouselItems?: any;
  onNext?: () => void;
  onPrevious?: () => void;
  storyType: string;
  pagination?: any;
}

const Carousel: React.FC<CarouselProps> = ({
  autoplay,
  loop,
  carouselItems,
  onNext,
  onPrevious,
  storyType,
  pagination,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [translateX, setTranslateX] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [itemsToShow, setItemsToShow] = useState<number>(8);
  const { t } = useTranslation();
  const storedValue = localStorage.getItem("defaultLanguage");

  const calculateItemsToShow = () => {
    if (window.innerWidth <= 576) {
      return 5;
    } else if (window.innerWidth <= 1368) {
      return 5;
    } else if (window.innerWidth <= 1600) {
      return 5;
    } else {
      return 5;
    }
  };

  const prevSlide = () => {
    if (onPrevious) {
      onPrevious(); // Call onPrevious only if provided
    }
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
    if (onNext) {
      onNext(); // Call onNext only if provided
    }

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

  const handleStoreUserIds = () => {
    const userIds = carouselItems?.map((item: any) => item.profile?.userId);
    localStorage.setItem("discoverUserIds", JSON.stringify(userIds));
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
          {carouselItems?.map((item: any, index: any) => (
            <div
              key={item.userId ? item?.userId : item?.profile?.userId}
              className={`slide ${index === currentSlide ? "active" : ""}`}
              style={{
                flex: `0 0 ${100 / itemsToShow}%`,
              }}
            >
              <div
                key={item?.userId ? item?.userId : item?.profile?.userId}
                className="profile-story item"
              >
                <a
                  href={`story-view/${
                    item?.userId ? item?.userId : item?.profile?.userId
                  }?type=${storyType}${
                    storyType === PAGE.FEED
                      ? `&afterkey=${pagination?.afterKey}&offset=${item?.offset}`
                      : ""
                  }`}
                  onClick={handleStoreUserIds}
                >
                  <img
                    src={
                      item?.profileImageUrl
                        ? item?.profileImageUrl
                        : item?.profile?.profileImageUrl
                    }
                    alt=""
                  />
                  <span className="name">
                    {item?.fullName ? item?.fullName : item?.profile?.fullName}
                  </span>
                </a>
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
        {/* <LeftArrowIcon /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
        >
          <g
            id="chevron_right"
            data-name="chevron right"
            transform="translate(0)"
          >
            <circle
              id="Ellipse_327"
              data-name="Ellipse 327"
              cx="20"
              cy="20"
              r="20"
              transform="translate(0)"
              fill="rgba(255,255,255,0.86)"
            />
            <path
              id="Icon_akar-chevron-left"
              data-name="Icon akar-chevron-left"
              d="M18.644,6l-4.411,4.411L10.5,14.144l8.144,8.144"
              transform="translate(4.768 5.856)"
              fill="none"
              stroke="#000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          </g>
        </svg>
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
        {/* <RightArrowIcon /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
        >
          <g
            id="chevron_left"
            data-name="chevron left"
            transform="translate(-1680.36 -149.36)"
          >
            <circle
              id="Ellipse_327"
              data-name="Ellipse 327"
              cx="20"
              cy="20"
              r="20"
              transform="translate(1680.36 149.36)"
              fill="rgba(255,255,255,0.86)"
            />
            <path
              id="Icon_akar-chevron-left"
              data-name="Icon akar-chevron-left"
              d="M10.5,6l4.411,4.411,3.733,3.733L10.5,22.288"
              transform="translate(1686.449 155.216)"
              fill="none"
              stroke="#000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
          </g>
        </svg>
      </button>
    </div>
  );
};

export default Carousel;
