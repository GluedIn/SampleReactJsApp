import FeedData from "../components/Feed";
import Bottom from "../components/Layouts/Bottom";
import Sidebar from "../components/Layouts/Sidebar";
import ProfileSuggestion from "../components/ProfileSuggestion";
import TopProfiles from "../components/TopProfile/TopProfile";
import gluedin from "gluedin-shorts-js";
import React from "react";

function Home() {
  const gluedinSDKInitilize = new gluedin.GluedInSDKInitilize();
  gluedinSDKInitilize.initialize({
    apiKey: "b0d9a77e-a27d-4c65-bff9-35f1eb5add2d",
    secretKey: "d9e92ea2-fbe9-4e92-b55b-41cee6f0c10e",
  });

  return (
    <>
      <div className="full-sec">
        <div className="left-sec">
          <Sidebar />
        </div>
        <div className="right-sec profile-content-list">
          <div className="main-feed-wrapper">
            <TopProfiles />
            <FeedData />
          </div>
          <div className="profile-suggestions">
            <ProfileSuggestion />
          </div>
        </div>
      </div>
      <Bottom />
    </>
  );
}

export default Home;
