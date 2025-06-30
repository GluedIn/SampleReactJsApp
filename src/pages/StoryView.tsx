import Sidebar from "../components/Layouts/Sidebar";
import Story from "../components/Story/Story";
import { useLoginModalContext } from "../contexts/LoginModal";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function StoryView() {
  const { setShowLoginModal } = useLoginModalContext();
  const [isViewerOpen, setIsViewerOpen] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageType = searchParams.get("type");

  const loginModalHandler = () => {
    setShowLoginModal(true);
  };

  const handleStoryClose = () => {
    setIsViewerOpen(false);
    navigate(-1);
    // if (pageType === "feed") {
    //   navigate("/vertical-player");
    // } else if (pageType === "discover") {
    //   navigate("/discover");
    // } else if (pageType === "profile") {
    //   navigate("/my-profile");
    // } else {
    //   navigate("/vertical-player");
    // }
  };

  return (
    <div className="full-sec">
      <div className="left-sec">
        <Sidebar loginHandler={loginModalHandler} />
      </div>
      <div className="right-sec">
        {/* <button onClick={() => setIsViewerOpen(true)}>Open Stories</button> */}
        {isViewerOpen && (
          <Story
            onClose={() => {
              handleStoryClose();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default StoryView;
