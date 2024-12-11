import { getLocalisedText } from "../../Helper/helper";
import React from "react";
import { useNavigate } from "react-router-dom";

function HashtagRail(props: any) {
  const navigate = useNavigate();
  const { data }: any = props;

  const handleHashtagDetail = (hashtagName: any) => {
    navigate(`/hashtag/${hashtagName}`);
  };

  if (!data) return null;

  return (
    <div className="inner-box hashtag-box">
      <ul className="head-part">
        <li>
          <h4>{getLocalisedText(data, "railName")}</h4>
        </li>
      </ul>

      <ul className="hashtag-ul">
        {data?.itemList?.map((hashtagInfo: any, index: number) => (
          <li key={index}>
            <a
              href="javascript:void(0)"
              className="hashtag-detail"
              onClick={(e) => handleHashtagDetail(hashtagInfo.hashtag?.title)}
            >
              <span>#</span>
              {hashtagInfo.hashtag?.title}{" "}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HashtagRail;
