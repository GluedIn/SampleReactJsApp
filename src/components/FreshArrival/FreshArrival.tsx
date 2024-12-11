import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FreshArrival() {
  const [data, setData]: any = useState(null);
  const [options, setOptions]: any = useState(null);
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        var curatedContentModuleObj = new gluedin.GluedInCuratedContentModule();
        var curatedContentModuleResponse =
          await curatedContentModuleObj.getCuratedContentList("discover");
        if (curatedContentModuleResponse.status === 200) {
          let freshArrivalVideos =
            curatedContentModuleResponse.data.result.find(
              (rail: any) => rail.railId === "railId_4"
            );
          console.log("freshArrivalVideos===", freshArrivalVideos);
          setData(freshArrivalVideos || []);
          setIsClient(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      //   let owlCarouselOptions = {
      //     loop: true,
      //     items: 4,
      //     autoplay: true,
      //     autoplayTimeout: 5000,
      //     video: true,
      //     autoheight: "true",
      //     autoplaySpeed: 1000,
      //     margin: 0,
      //     autoplayHoverPause: true,
      //     nav: true,
      //     navText: [
      //       '<img src="./gluedin/images/arrow-small-right.svg">',
      //       '<img src="./gluedin/images/arrow-small-left-g.svg">',
      //     ],
      //     dots: false,
      //     responsive: {
      //       0: {
      //         items: 2.5,
      //         nav: false,
      //       },
      //       600: {
      //         items: 4.5,
      //         nav: false,
      //       },
      //       1000: {
      //         items: 4,
      //         loop: false,
      //       },
      //     },
      //   };
      //   setOptions(owlCarouselOptions);
    }
  }, [data]);

  if (data && data.length === 0) {
    return <p></p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const handleContentDetail = (contentInfo: any) => {
    navigate(`/content/${contentInfo.id}`);
  };

  return (
    <div className="inner-box arrival-box mt-t-45">
      <div>
        <h4>{data.railName}</h4>
        {/* <a href='#'>See All</a> */}
      </div>
      {/* {isClient && (
                <OwlCarousel {...options} className="row owl-carousel owl-theme">
                {
                    data.itemList.map((videoInfo:any, index:number)=> (
                        <div className="box text-center" style={{ "width": "140px !important" }} key={index}>
                            <div className="img-box open-video-detail" id={videoInfo.id}
                                style={{
                                    "background": `url("${videoInfo.thumbnail}") center`,
                                    "backgroundSize": "cover",
                                    "height": "100px !important",
                                    "borderRadius": "9px"
                                }} onClick={() => handleContentDetail(videoInfo)}>
                                <span className="av-icon" >
                                    <img alt='content icon' src="./gluedin/images/folder-icon.svg" />
                                </span>
                            </div>
                        </div>
                    ))
                }
                </OwlCarousel>
            )} */}
    </div>
  );
}

export default FreshArrival;
