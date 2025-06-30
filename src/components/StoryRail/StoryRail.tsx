import { PAGE } from "../../constants";
import { getLocalisedText } from "../../Helper/helper";
import StoryRailCarousel from "../common/Carousel/StoryRailCarousel/StoryRailCarousel";
import React from "react";

function TopProfile(props: any) {
  const { data }: any = props;

  if (!data) return null;

  return (
    <div className="full-box home-feed-full-box">
      <div className="feed-box">
        <div className="box top-profile-box">
          <div className="top-profile-box-left-sec">
            <div className="rail-header">
              <h4 className="ft-500">{getLocalisedText(data, "railName")}</h4>
            </div>

            <div dir="ltr">
              <StoryRailCarousel
                carouselItems={data?.itemList}
                autoplay={false}
                loop={false}
                storyType={PAGE.DISCOVER}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopProfile;
