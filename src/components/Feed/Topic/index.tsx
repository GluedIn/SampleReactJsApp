import "../../../assets/css/Feed.css";
import Report from "../Report";
import BottomContainer from "./BottomContainer";
import FirstContainer from "./FirstContainer";
import SecondContainer from "./SecondContainer";
import PropTypes from "prop-types";
import React, { forwardRef, useState } from "react";

const FeedTopic = forwardRef(
  ({ contentInfo, videoLikedByUser }: any, ref: React.Ref<HTMLDivElement>) => {
    const [showReportModal, setShowReportModal] = useState(false);

    const toggleReportModal = () => {
      setShowReportModal((state) => !state);
    };

    return (
      <div ref={ref} className="row full-post-box ordering">
        <FirstContainer contentInfo={contentInfo} />
        <div className="right_wrapper">
          <SecondContainer contentInfo={contentInfo} />
          <BottomContainer
            contentInfo={contentInfo}
            videoLikedByUser={videoLikedByUser}
            toggleReportModal={toggleReportModal}
          />
        </div>
        <Report
          show={showReportModal}
          onHide={() => toggleReportModal()}
          type="video"
          payloadData={{
            assetId: contentInfo.videoId,
            userId: contentInfo.userId,
          }}
          handleClose={toggleReportModal}
        />
      </div>
    );
  }
);

FeedTopic.propTypes = {
  contentInfo: PropTypes.object,
  videoLikedByUser: PropTypes.array,
  setShowLoginModal: PropTypes.func,
};

export default FeedTopic;
