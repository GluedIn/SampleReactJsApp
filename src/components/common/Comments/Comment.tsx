import { getLocalisedText } from "../../../Helper/helper";
import { useLoginModalContext } from "../../../contexts/LoginModal";
import Report from "../../Feed/Report";
import LoginModal from "../../Login-UI/LoginModal";
// import LoginModal from '../../PSAW-UI/LoginModal';
import gluedin from "gluedin-shorts-js";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function Comment({
  videoId,
  comment,
  handleDeleteComment,
  handleEditComment,
  handleReplyComment,
}: any) {
  const { t } = useTranslation();
  const [commentReply, setCommentReply] = useState([]);
  const [isReportCommentVisible, setIsReportCommentVisible] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const { setShowLoginModal } = useLoginModalContext();
  const [replylimit, setReplyLimit]: any = useState(1);
  const {
    postId,
    commentRefId,
    userId,
    profileImageUrl,
    fullName,
    description,
  } = comment ?? {};

  const isUserIdSame =
    JSON.parse(localStorage.getItem("userData") || "{}")?.userId === userId;
  const toggleReportComment = async () => {
    const isUserLoggedIn: any = await isLoggedin();
    if (isUserLoggedIn) {
      setIsReportCommentVisible((state) => !state);
    } else {
      setShowLoginModal(true);
    }
  };

  const toggleReportModal = () => {
    setShowReportModal((state) => !state);
  };
  const isLoggedin = async () => {
    const accessToken = await new gluedin.GluedInAuthModule().getAccessToken();
    if (accessToken) {
      return true;
    } else {
      return false;
    }
  };
  async function fetchReply() {
    try {
      const activityTimelineModuleObj = new gluedin.GluedInActivityTimeline();
      const response =
        await activityTimelineModuleObj.getActivityTimelineCommentReplyList({
          limit: 3,
          offset: replylimit || 0,
          postId: postId,
        });
      if (response?.status == 200) {
        if (comment["replys"]) {
          comment["replys"] = comment["replys"].concat(response.data.result);
          comment["replys"] = removeDuplicates(comment["replys"]);
          comment.replyCount = comment.replyCount - 3;
        } else {
          comment.replyCount = comment.replyCount - 3;
          comment["replys"] = response.data.result;
          comment["replys"] = removeDuplicates(comment["replys"]);
        }
        if (response.data.result.length != 0) {
          const page = replylimit + 1;
          setReplyLimit(page);
        }
        setCommentReply(comment["replys"]);
        console.log("reply limit-->>", comment["replys"]);
      }
    } catch (error) {
      console.error(error);
    }
  }
  function removeDuplicates(array: any) {
    let uniqueMap: any = {};
    let uniqueArray = array.filter((item: any) => {
      if (!uniqueMap.hasOwnProperty(item.description)) {
        uniqueMap[item.description] = true;
        return true;
      }
      return false;
    });

    return uniqueArray;
  }
  return (
    <div className="comment-box mt-t-15" key={postId}>
      <ul>
        <li className="img-li">
          <div className="img-holder">
            <a href={`profile/${userId}`}>
              <img src={profileImageUrl} />
            </a>
          </div>
        </li>
        <li className="content-li">
          <a href={`profile/${userId}`}>
            <h6 className="text">
              {getLocalisedText({ fullName }, "fullName")}
            </h6>
          </a>
          <span className="text-blk">
            {getLocalisedText({ description }, "description")}
          </span>
          {isUserIdSame && (
            <div className="edit-delete-option">
              <button
                className="edit-option"
                onClick={() =>
                  handleEditComment({ id: postId, refId: commentRefId })
                }
              >
                <img src="/gluedin/images/edit.svg" alt="" />
              </button>
              <button
                className="delete-option"
                onClick={() =>
                  handleDeleteComment({ id: postId, refId: commentRefId })
                }
              >
                <img src="/gluedin/images/delete.svg" alt="" />
              </button>
            </div>
          )}
          <div className="reply_content">
            <button
              className="reply_btn"
              onClick={() =>
                handleReplyComment({ id: postId, refId: commentRefId })
              }
            >
              {t("reply-btn")}
            </button>
            {comment?.replys &&
              comment?.replys.map((reply: any) => (
                <div className="comment_info">
                  <div className="left">
                    <div className="img">
                      <img src={reply?.profileImageUrl} alt="" />
                    </div>
                    <div className="content">
                      <h6>
                        <span>{reply?.fullName}</span>
                        {/* <span>9:12AM</span> */}
                      </h6>
                      <p>{reply?.description}</p>
                      <button
                        className="reply_btn"
                        onClick={() =>
                          handleReplyComment({
                            id: postId,
                            refId: commentRefId,
                          })
                        }
                      >
                        {t("reply-btn")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {comment.replyCount > 0 && (
              <button className="view_replies" onClick={() => fetchReply()}>
                {t("view-reply")} {comment.replyCount} {t("replies")}
              </button>
            )}
          </div>
        </li>
      </ul>
      <div className="report-wrapper">
        {!isUserIdSame && (
          <>
            <button className="comment-dots" onClick={toggleReportComment}>
              <img
                src="/gluedin/images/hor-dot.svg"
                className="dot-options"
                data-post-id={comment.postId}
                data-userid={comment.userId}
                data-action="comment"
                data-assetid={videoId}
                alt=""
              />
            </button>
          </>
        )}

        {isReportCommentVisible && (
          <ul className="dot-suboption">
            <li onClick={() => toggleReportModal()}>
              <a href="#" className="report-button" data-action="comment">
                <span>
                  <i
                    className="fa fa-exclamation-circle"
                    aria-hidden="true"
                  ></i>
                </span>
                <span className="text">{t("report-comment")}</span>
              </a>
            </li>
          </ul>
        )}
      </div>
      {showReportModal && (
        <Report
          show={showReportModal}
          onHide={() => toggleReportModal()}
          type="comment"
          payloadData={{ userId, assetId: videoId, postId }}
          handleClose={toggleReportModal}
        />
      )}
    </div>
  );
}

Comment.propTypes = {
  videoId: PropTypes.string,
  comment: PropTypes.object,
  handleDeleteComment: PropTypes.func,
  handleEditComment: PropTypes.func,
  handleReplyComment: PropTypes.func,
};

export default Comment;
