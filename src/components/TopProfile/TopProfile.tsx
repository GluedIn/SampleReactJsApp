import { getLocalisedText } from "../../Helper/helper";
import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// import OwlCarousel from "react-owl-carousel";

function TopProfile() {
  const { t } = useTranslation();
  const [data, setData]: any = useState(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        const userModuleObj = new gluedin.GluedInUserModule();
        const userModuleResponse = await userModuleObj.getTopProfiles({});
        setData(userModuleResponse.data.result);
        setIsClient(true);
      } catch (error) {
        // console.error(error);
        console.log("ddddddddddddddddddddddddddddddddddddddddddddddddddd");
      }
    }
    fetchData();
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="full-box home-feed-full-box" dir="ltr">
      <div className="feed-box">
        <div className="box top-profile-box">
          <div className="top-profile-box-left-sec">
            <div className="rail-header">
              <h4 className="ft-500">{t("feed-TopProfile")}</h4>
            </div>
            {/* {isClient && (
              <OwlCarousel
                loop
                dots={false}
                items={5}
                autoplay={true}
                responsive={{
                  1000: {
                    items: 6,
                    loop: false,
                  },
                  300: {
                    items: 4,
                    nav: false,
                  },
                  0: {
                    items: 4,
                    nav: false,
                  },
                }}
                className="list list-inline profile-box-slider owl-carousel owl-theme top-profile-list"
              >
                {data.map((item: any) => (
                  <li key={item.userId} className="item">
                    <a href={"profile/" + item.userId}>
                      <img
                        src={
                          item.profileImageUrl ||
                          "https://d3ibngdlgwl8mp.cloudfront.net/Profile.png"
                        }
                      />
                      <span className="sml-text name">
                        {item.fullName.length > 10
                          ? getLocalisedText(item, "fullName").substr(0, 10) +
                            ".."
                          : getLocalisedText(item, "fullName")}
                      </span>
                      <span className="followers">
                        {item.followersCount} {t("profile-followers")}
                      </span>
                    </a>
                  </li>
                ))}
              </OwlCarousel>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopProfile;
