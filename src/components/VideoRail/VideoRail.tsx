import { getLocalisedText } from "../../Helper/helper";
import VideoRailCarousel from "../common/Carousel/VideoRailCarousel/VideoRailCarousel";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function VideoRail(props: any) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { data }: any = props;

  useEffect(() => {
    if (data) {
      // fetchRailItems();
    }
  }, [data]);

  const handleContentDetail = (contentInfo: any) => {
    const array = data.itemList.map((item: any) =>
      pathname === "/search-filter" ? item.videoId : item.assetId
    );
    localStorage.setItem("ids", JSON.stringify(array));
    if (contentInfo.id) {
      navigate(`/discover/content?id=${contentInfo.id}&type=video`);
    } else {
      navigate(`/discover/content?id=${contentInfo._id}&type=video`);
    }
  };

  if (!data) return null;

  return (
    <div className="inner-box arrival-box">
      <div className="rail-header">
        <h4>{getLocalisedText(data, "railName")}</h4>
      </div>
      <VideoRailCarousel
        carouselItems={data?.itemList}
        autoplay={false}
        loop={false}
        carouselContentDetail={handleContentDetail}
      />
    </div>
  );
}

export default VideoRail;
