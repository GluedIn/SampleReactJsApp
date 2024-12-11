import { useLoginModalContext } from "../../contexts/LoginModal";
import FeedTopic from "./Topic";
import gluedin from "gluedin-shorts-js";
import React, { useCallback, useEffect, useState } from "react";

function FeedData() {
  const [data, setData]: any = useState([]);
  const [page, setPage] = useState(1);
  const [totalAvailablePage, setTotalAvailablePage] = useState(1);
  const [videoLikedByUser, setVideoLikedByUser]: any = useState([]);
  const { setShowLoginModal } = useLoginModalContext();

  useEffect(() => {
    // console.log("testing feed of call")
    async function fetchData(page: number) {
      try {
        if (totalAvailablePage < page) {
          return;
        }
        let accessToken = new gluedin.GluedInAuthModule().getAccessToken();
        var feedModuleObj = new gluedin.GluedInFeedModule();
        var limit = 10;
        var feedModuleResponse = await feedModuleObj.getFeedList({
          limit: limit,
          offset: page,
          c_type: "video",
        });
        let total = feedModuleResponse.data.total;
        setTotalAvailablePage(Math.ceil(total / limit));
        if (feedModuleResponse.status === 200) {
          let homeFeeds = feedModuleResponse.data.result;
          setData([...data, ...homeFeeds]);
          let likedVideoIds = homeFeeds.map((item: any) => item.videoId);
          if (likedVideoIds && likedVideoIds.length > 0) {
            accessToken
              .then(async (data: any) => {
                // handle success case
                if (data) {
                  let likeVideosResponse = await feedModuleObj.Like(
                    likedVideoIds
                  );
                  if (
                    likeVideosResponse.status === 200 ||
                    likeVideosResponse.status === 201
                  ) {
                    let likedVideos = likeVideosResponse.data.result;
                    setVideoLikedByUser([...videoLikedByUser, ...likedVideos]);
                  }
                }
              })
              .catch((error: any) => {
                // handle error case
                console.error(error);
              });
          }
        }
      } catch (error) {
        console.error(error);
        console.log("knwnfnfwfnfffwjff");
      }
    }
    fetchData(page);
  }, [page]);

  const onScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    // console.log(scrollTop,clientHeight,scrollHeight);
    if (scrollTop + clientHeight >= scrollHeight - 1) {
      setPage(page + 1);
    }
    // console.log("pagination increase", page);
  }, [page]);

  useEffect(() => {
    // console.log("call scroll this");
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [data, onScroll]);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {data.map((contentInfo: any) => (
        <FeedTopic
          key={contentInfo._id}
          contentInfo={contentInfo}
          videoLikedByUser={videoLikedByUser}
        />
      ))}
    </>
  );
}

export default FeedData;
