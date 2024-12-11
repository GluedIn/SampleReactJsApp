import Bottom from "../components/Layouts/Bottom";
import Sidebar from "../components/Layouts/Sidebar";
import MyProfile from "../components/Profile/MyProfile";
import React from "react";

const MyProfilePage = () => {
  return (
    <>
      <div className="full-sec">
        <div className="left-sec">
          <Sidebar showProfile={false} />
        </div>
        <div className="right-sec">
          <MyProfile />
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default MyProfilePage;
