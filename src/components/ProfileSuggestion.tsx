import { getLocalisedText } from "../Helper/helper";
import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function ProfileSuggestion() {
  const { t } = useTranslation();
  const [data, setData]: any = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const userModuleObj = new gluedin.GluedInUserModule();
        const userModuleResponse = await userModuleObj.getTopProfiles({});
        setData(userModuleResponse.data.result);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="full-box home-feed-full-box">
      <div className="feed-box">
        <div className="box top-profile-box">
          <div className="top-profile-box-left-sec">
            <div className="rail-header">
              <h4 className="ft-500">{t("feed-suggestion")}</h4>
            </div>
            <ul className="list top-profile-list">
              {data.map((item: any) => (
                <li key={item.userId} className="item">
                  <a href={`/profile/${item.userId}`}>
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
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSuggestion;
