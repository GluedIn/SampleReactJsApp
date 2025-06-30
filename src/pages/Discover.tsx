import HashtagRail from "../components/HashtagRail/HashtagRail";
import Bottom from "../components/Layouts/Bottom";
import HeaderSearch from "../components/Layouts/HeaderSearch";
import Sidebar from "../components/Layouts/Sidebar";
import StoryRail from "../components/StoryRail/StoryRail";
import UserRail from "../components/UserRail/UserRail";
import VideoRail from "../components/VideoRail/VideoRail";
import Loader from "../components/common/Loader";
import { useLoginModalContext } from "../contexts/LoginModal";
import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState } from "react";

const CuratedContentModule = new gluedin.GluedInCuratedContentModule();

const Rail = ({ rail }: any) => {
  const rails: any = {
    video: <VideoRail key={rail.id} data={rail} />,
    user: <UserRail data={rail} />,
    hashtag: <HashtagRail key={rail.id} data={rail} />,
    story: <StoryRail data={rail} />,
  };
  return rails[rail.contentType];
};

const Discover = (props: any) => {
  const [data, setData]: any = useState(null);
  const { setShowLoginModal } = useLoginModalContext();

  useEffect(() => {
    async function fetchData() {
      try {
        const curatedContentModuleResponse =
          await CuratedContentModule.getCuratedContentList("discover");
        if (curatedContentModuleResponse?.status === 200) {
          //   setData(curatedContentModuleResponse.data.result || []);
          const filteredData = (
            curatedContentModuleResponse?.data?.result || []
          ).filter(
            (item: any) =>
              Array.isArray(item?.itemList) && item?.itemList?.length > 0
          );
          setData(filteredData);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  if (data && data.length === 0) return null;

  if (!data) return <Loader />;

  const loginModalHandler = () => {
    setShowLoginModal(true);
  };

  return (
    <>
      <div className="full-sec">
        <div className="left-sec">
          <Sidebar showProfile={true} loginHandler={loginModalHandler} />
        </div>
        <div className="right-sec profile-content-list discover-top">
          <HeaderSearch redirect={true} />
          {data.map((rail: any) => (
            <Rail key={rail.id} rail={rail} />
          ))}
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default Discover;
