import Bottom from "../components/Layouts/Bottom";
import Sidebar from "../components/Layouts/Sidebar";
import CreateContentSidebar from "../components/Layouts/Sidebar/Content";
import CreatePostStepTwo from "../components/Post/CreatePostStepTwo";
import React from "react";

const CreateContentStepTwo = () => {
  return (
    <>
      <div className="full-sec">
        {/* <div className="left-sec">
          <CreateContentSidebar />
        </div> */}

        <div className="p-8">
          <CreatePostStepTwo />
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default CreateContentStepTwo;
