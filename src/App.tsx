import "./App.css";
import ForgotPasswordForm from "./components/Auth/ForgotPasswordForm";
import Creator from "./components/CreatorTools/CreatorTools";
import DeepLink from "./components/DeepLink";
import GluedInLogin from "./components/GluedInLogin/GluedInLogin";
import LoginModal from "./components/Login-UI/LoginModal";
import VerticalPlayer from "./components/VerticalPlayer";
import ToastNotification from "./components/VerticalPlayer/components/Notification/Notification";
import SoundTrack from "./components/VerticalPlayer/components/SoundTrack";
import { useLoginModalContext } from "./contexts/LoginModal";
import { useNotification } from "./contexts/Notification";
import ActivityTimeline from "./pages/ActivityTimeline";
import ContentDetailPage from "./pages/ContentDetail";
import CreateContent from "./pages/CreatePost";
import CreateContentStepTwo from "./pages/CreatePostStepTwp";
import CreateTextContent from "./pages/CreateText";
import Discover from "./pages/Discover";
import DiscoverContent from "./pages/DiscoverContent";
import HashtagDetail from "./pages/HashtagDetail";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import Notification from "./pages/Notification";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import StoryView from "./pages/StoryView";
import SearchFilter from "./pages/searchFilter";
import i18n from "./translation/translation";
import gluedin from "gluedin-shorts-js";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  i18n.init();
  const storedValue = localStorage.getItem("defaultLanguage");
  let gluedinSDKInitilize = new gluedin.GluedInSDKInitilize();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const API_KEY = process.env.REACT_APP_API_KEY;
  const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

  gluedinSDKInitilize.initialize({
    baseUrl: BASE_URL,
    apiKey: API_KEY,
    secretKey: SECRET_KEY,
  });

  const { showLoginModal, setShowLoginModal } = useLoginModalContext();
  const { notification, closeNotification } = useNotification();

  return (
    <div
      className="App"
      id="direction"
      dir={storedValue === "ar" ? "rtl" : "ltr"}
    >
      <Router>
        <Routes>
          <Route path="" element={<VerticalPlayer />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/discover/content" element={<DiscoverContent />} />
          <Route path="/activity-timeline" element={<ActivityTimeline />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/create-post" element={<CreateContent />} />
          <Route
            path="/create-post-page-02"
            element={<CreateContentStepTwo />}
          />
          <Route path="/content/:contentId" element={<ContentDetailPage />} />
          <Route path="/hashtag/:hashtagName" element={<HashtagDetail />} />
          <Route path="/create-text" element={<CreateTextContent />} />
          <Route path="/search-filter" element={<SearchFilter />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/vertical-player" element={<VerticalPlayer />} />
          <Route path="/sound-track/:soundId" element={<SoundTrack />} />
          <Route path="/feed" element={<DeepLink />} />
          <Route path="/gluedin-login" element={<GluedInLogin />} />
          <Route path="/creator" element={<Creator />} />
          <Route path="/story-view/:userId" element={<StoryView />} />
        </Routes>
        <LoginModal
          show={showLoginModal}
          handleClose={() => setShowLoginModal(false)}
        />
        {notification.show && (
          <ToastNotification
            show={notification.show}
            title={notification.title}
            subTitle={notification.subTitle}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </Router>
    </div>
  );
}

export default App;
