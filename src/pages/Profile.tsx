import Sidebar from "../components/Layouts/Sidebar";
import Profile from "../components/Profile/Profile";
import { useLoginModalContext } from "../contexts/LoginModal";
import React from "react";

const UserProfile = () => {
  const { setShowLoginModal } = useLoginModalContext();

  const loginModalHandler = () => {
    setShowLoginModal(true);
  };
  return (
    <div className="full-sec">
      <div className="left-sec">
        <Sidebar loginHandler={loginModalHandler} />
      </div>
      <div className="right-sec">
        <Profile />
      </div>
    </div>
  );
};

export default UserProfile;
