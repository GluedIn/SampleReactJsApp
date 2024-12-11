import ActivityTimeline from "../components/ActivityTimeline/ActivityTimeline";
import Sidebar from "../components/Layouts/Sidebar";
import React from "react";

const ActivityTimelinePage = () => {
  return (
    <div className="full-sec">
      <div className="left-sec">
        <Sidebar />
      </div>
      <div className="activity-timeline right-sec">
        <ActivityTimeline />
      </div>
    </div>
  );
};

export default ActivityTimelinePage;
