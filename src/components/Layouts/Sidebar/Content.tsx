import ShortsSdkVersion from "../../common/SDKVersion";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { useLocation } from "react-router-dom";

// function SidebarLink({ route, label, imgSrc }: any) {
function SidebarLink({ route, label, imgSrc }: any) {
  const { pathname } = useLocation();

  const isLinkActive = useCallback(
    (path: any) => pathname === path,
    [pathname]
  );
  // Replace with your condition

  const textContentSVG = `
  <svg id="Text-nonactive"
  xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect id="Rectangle_9129" data-name="Rectangle 9129" width="32" height="32" transform="translate(0 0)" fill="none"/>
  <g id="Group_18613" data-name="Group 18613" transform="translate(3.564 3.696)">
    <path id="path484" d="M55.177,181.619c-.212-.116-.217-.146-.217-1.46,0-1.582-.084-1.452.955-1.474l.739-.015.116-.135.116-.135V166.874l-.116-.135-.116-.135h-2.89l-.124.117-.124.117v.859c0,.96-.043,1.156-.272,1.243a8.673,8.673,0,0,1-1.326.036c-1.169-.014-1.2-.017-1.3-.124l-.11-.11v-4.9l.11-.109.11-.11,7.58-.012c4.981-.008,7.623,0,7.707.036.259.1.267.176.267,2.645s-.008,2.547-.266,2.644a16.408,16.408,0,0,1-2.5,0c-.222-.084-.266-.288-.266-1.24v-.858l-.124-.117L63,166.6H60.1l-.116.135-.116.135V178.4l.116.135.116.135.739.015c1.039.022.955-.1.955,1.455,0,.681-.013,1.273-.03,1.315-.083.216-.123.219-3.4.217-2.148,0-3.126-.018-3.193-.054Z" transform="translate(-46.058 -159.34)" fill="#596870"/>
    <path id="path484-2" data-name="path484" d="M36.474,174.39a.732.732,0,0,1-.3-.283c-.1-.183-.1-.217-.1-2.37,0-2.034.006-2.2.089-2.35a.734.734,0,0,1,1.266,0c.082.153.089.3.089,1.912v1.745h1.745c1.607,0,1.759.007,1.912.089a.734.734,0,0,1,0,1.266c-.155.083-.316.089-2.333.089C36.761,174.487,36.662,174.483,36.474,174.39Zm19.136.008a.734.734,0,0,1,0-1.266c.153-.082.3-.089,1.912-.089h1.745V171.3c0-1.607.007-1.759.089-1.912a.734.734,0,0,1,1.266,0c.083.155.089.316.089,2.33,0,2.086,0,2.171-.1,2.368a.588.588,0,0,1-.3.3c-.2.1-.282.1-2.368.1-2.014,0-2.175-.006-2.33-.089ZM36.473,155.266a.8.8,0,0,1-.265-.229l-.115-.162-.013-2.229c-.013-2.2-.012-2.231.09-2.413a.884.884,0,0,1,.285-.286c.177-.1.23-.1,2.365-.1,2.034,0,2.2.006,2.35.089a.734.734,0,0,1,0,1.266c-.153.082-.3.089-1.912.089H37.513v1.745c0,1.607-.007,1.759-.089,1.912a.93.93,0,0,1-.213.259.91.91,0,0,1-.738.061Zm23.2,0a.8.8,0,0,1-.265-.229l-.115-.162-.014-1.793-.014-1.793H57.52c-1.605,0-1.757-.007-1.91-.089a.734.734,0,0,1,0-1.266c.155-.083.316-.089,2.35-.089,2.156,0,2.186,0,2.371.105a.709.709,0,0,1,.283.3c.092.19.1.3.1,2.362,0,2.014-.006,2.175-.089,2.33a.929.929,0,0,1-.213.259.911.911,0,0,1-.738.061Z" transform="translate(-36.069 -149.845)" fill="#596870" stroke="#596870" strokeLinecap="square" stroke-width="0.5"/>
  </g>
</svg>
`;

  const mediaSVG = `
  <svg id="Media-nonactive"
  xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect id="Rectangle_9135" data-name="Rectangle 9135" width="32" height="32" transform="translate(0 0)" fill="none"/>
  <g id="Group_18621" data-name="Group 18621" transform="translate(3.664 4.774)">
    <path id="Path_13315" data-name="Path 13315" d="M23.1,3a1.1,1.1,0,0,1,1.1,1.1v10H21.985V5.221H4.221V20.763l11.1-11.1,3.331,3.331v3.141L15.323,12.8,7.359,20.764h7.964v2.221H3.1a1.1,1.1,0,0,1-1.1-1.1V4.1A1.11,1.11,0,0,1,3.1,3Z" transform="translate(-2 -3)" fill="#596870"/>
    <path id="Path_13316" data-name="Path 13316" d="M33.2,26.428v3.331H36.53v2.221H33.2V35.31H30.979V31.979H27.648V29.758h3.331V26.428ZM18.766,17.545a2.221,2.221,0,1,1-2.221,2.221A2.221,2.221,0,0,1,18.766,17.545Z" transform="translate(-12.104 -13.104)" fill="#596870"/>
  </g>
</svg>
`;
  const renderSVG = imgSrc === "text-content" ? textContentSVG : mediaSVG;

  return (
    <a href={route} style={{ textDecoration: "none", color: "#000000" }}>
      <li
        className={isLinkActive(route) ? "active" : ""}
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: renderSVG }} />
        <span style={{ marginLeft: 5 }}>{label}</span>
      </li>
    </a>
  );
}

function CreateContentSidebar() {
  return (
    <>
      <div className="sidebar">
        <ul className="sidebar-ul">
          <SidebarLink
            label="Media Content"
            imgSrc="media-content"
            route="/create-post"
          />
          {/* <SidebarLink
            label="Text Content"
            imgSrc="text-content"
            route="/create-text"
          /> */}
        </ul>
      </div>

      <ShortsSdkVersion />
    </>
  );
}

SidebarLink.propTypes = {
  route: PropTypes.string,
  label: PropTypes.string,
  imgSrc: PropTypes.string,
};

export default CreateContentSidebar;
