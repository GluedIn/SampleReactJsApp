import { useLoginModalContext } from "../../../contexts/LoginModal";
import Comment from "./Comment";
import gluedin from "gluedin-shorts-js";
import PropTypes from "prop-types";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

const CommentsList = ({ videoId, comments, setComments }: any) => {
  const { t } = useTranslation();
  const inputRef: any = useRef(null);
  const [reply, setReply] = useState("");
  const [replyComment, setReplyComment] = useState(false);
  const [replyData, setReplyData]: any = useState(null);
  const [comment, setComment] = useState("");
  const [commentToUpdate, setCommentToUpdate]: any = useState(null);
  const { setShowLoginModal } = useLoginModalContext();

  const handleCreateComment = async (event: any) => {
    event.preventDefault();
    if (!comment) return;

    const accessToken = await new gluedin.GluedInAuthModule().getAccessToken();
    if (!accessToken) {
      setShowLoginModal(true);
      return;
    }
    try {
      const activityTimelineModuleObj = new gluedin.GluedInActivityTimeline();
      const userPostedComment =
        await activityTimelineModuleObj.activityTimelineAddComment({
          assetId: videoId,
          description: comment || reply,
          postId: "",
        });
      if (userPostedComment?.data?.success) {
        const commentResponse = userPostedComment?.data?.result;
        const username = JSON.parse(
          localStorage.getItem("userData") || "{}"
        )?.fullName;
        const profileImageUrl = JSON.parse(
          localStorage.getItem("userData") || "{}"
        )?.profileImageUrl;
        const commentData = {
          ...commentResponse,
          fullName: username,
          profileImageUrl: profileImageUrl,
        };
        setComments([...comments, commentData]);
      }
    } catch (error) {
      console.error(error);
    }
    setComment("");
    // reFetchComments();
  };
  const handleCreateReply = async (event: any, ids: any) => {
    let data: any = {};
    if (ids.postId) {
      data = comments.find(({ postId }: any) => postId === ids.postId);
    } else {
      data = comments.find(
        ({ commentRefId }: any) => commentRefId === ids.commentRefId
      );
    }
    event.preventDefault();
    if (!reply) return;
    const accessToken = await new gluedin.GluedInAuthModule().getAccessToken();
    if (accessToken == "" || accessToken == undefined || accessToken == null) {
      setShowLoginModal(true);
      return;
    }
    try {
      let dataToSend: any = {
        assetId: videoId,
        description: reply,
      };
      if (ids.postId !== "") {
        dataToSend.postId = ids.postId;
      } else {
        dataToSend.postId = ids.commentRefId;
      }
      const activityTimelineModuleObj = new gluedin.GluedInActivityTimeline();
      const userPostedComment =
        await activityTimelineModuleObj.activityTimelineAddComment(dataToSend);
      if (userPostedComment?.data?.success) {
        const commentResponse = userPostedComment?.data?.result;
        const username = JSON.parse(
          localStorage.getItem("userData") || "{}"
        )?.fullName;
        const profileImageUrl = JSON.parse(
          localStorage.getItem("userData") || "{}"
        )?.profileImageUrl;
        const commentData = {
          ...commentResponse,
          fullName: username,
          profileImageUrl: profileImageUrl,
        };
        if (data["replys"]) {
          data["replys"] = data["replys"].concat(commentData);
        } else {
          data["replys"] = [commentData];
        }
        if (data["limit"]) {
          data["limit"]++;
        } else {
          data["limit"] = 1;
        }
        setReply("");
        setReplyComment(false);
      }
    } catch (error) {
      console.error(error);
    }
    setComment("");
    // reFetchComments();
  };

  const handleCommentChange = (e: any) => {
    const comment = e.target.value.trim();
    setComment(comment);
  };
  const handleReplyChange = (e: any) => {
    const comment = e.target.value;
    setReply(comment);
  };
  const handleReplyClose = () => {
    setReply("");
    setReplyComment(false);
  };
  const authVerify = async (e: any) => {
    const accessToken = await new gluedin.GluedInAuthModule().getAccessToken();
    if (accessToken) {
      setShowLoginModal(false);
    } else {
      setShowLoginModal(true);
    }
  };
  const handleEditComment = async ({ id, refId }: any) => {
    let commentToEdit: any = {};
    if (id) {
      commentToEdit = comments.find(({ postId }: any) => postId === id);
    } else {
      commentToEdit = comments.find(
        ({ commentRefId }: any) => commentRefId === refId
      );
    }
    const { description }: any = commentToEdit ?? {};
    setComment(description);
    setCommentToUpdate(commentToEdit);
    inputRef?.current?.focus();
    inputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };
  const handleReplyComment = async ({ id, refId }: any) => {
    console.log("===================", id, refId);
    let replyToEdit: any = {};
    if (id) {
      replyToEdit = comments.find(({ postId }: any) => postId === id);
    } else {
      replyToEdit = comments.find(
        ({ commentRefId }: any) => commentRefId === refId
      );
    }
    inputRef?.current?.focus();
    inputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
    console.log("===================", replyToEdit);
    setReplyData(replyToEdit);
    setReply(`@${replyToEdit.fullName} `);
    setReplyComment(true);
  };
  const handleUpdateComment = async ({ event, id, refId }: any) => {
    // event.preventDefault();
    try {
      const feedModuleObj = new gluedin.GluedInFeedModule();
      const response = await feedModuleObj.UpdateComment({
        assetId: videoId,
        description: comment,
        ...(id ? { postId: id } : { commentRefId: refId }),
      });
      if (response?.data?.success) {
        const commentResponse = response?.data?.result;
        const username = JSON.parse(
          localStorage.getItem("userData") || "{}"
        )?.fullName;
        const profileImageUrl = JSON.parse(
          localStorage.getItem("userData") || "{}"
        )?.profileImageUrl;
        const commentData = {
          ...commentResponse,
          fullName: username,
          profileImageUrl: profileImageUrl,
        };
        comments.map((data: any) => {
          if (data.postId == id) {
            data.description = commentResponse.description;
          }
        });
        setComments([...comments]);
        setCommentToUpdate(null);
      }
    } catch (error) {
      console.error(error);
    }
    setComment("");
    // reFetchComments();
  };

  const handleDeleteComment = async ({ id, refId }: any) => {
    try {
      const activityTimelineModuleObj = new gluedin.GluedInActivityTimeline();
      const response =
        await activityTimelineModuleObj.activityTimelineDeleteComment({
          assetId: videoId,
          ...(id ? { postId: id } : { commentRefId: refId }),
        });
      if (response.status === 201) {
        const deletedCommentIndex = comments.findIndex(
          ({ postId }: any) => postId === id
        );
        comments.splice(deletedCommentIndex, 1);
        setComments([...comments]);
      }
    } catch (error) {
      console.error(error);
    }
    // reFetchComments();
  };

  return (
    <>
      {comments?.map((comment: any) => (
        <Comment
          key={comment?.postId}
          videoId={videoId}
          comment={comment}
          handleDeleteComment={handleDeleteComment}
          handleEditComment={handleEditComment}
          handleReplyComment={handleReplyComment}
        />
      ))}
      <div className="creat-comment-strip">
        <div className="creat-comment-box">
          <form
            action="submit"
            onSubmit={(event) => {
              if (
                commentToUpdate &&
                (commentToUpdate.postId || commentToUpdate.commentRefId)
              ) {
                handleUpdateComment({
                  event,
                  id: commentToUpdate.postId,
                  refId: commentToUpdate.commentRefId,
                });
              } else {
                console.log("before data");
                handleCreateComment(event);
              }
            }}
          >
            {!replyComment && (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  name="post_comment"
                  placeholder={t("write-a-comment") || ""}
                  value={comment}
                  onChange={handleCommentChange}
                  onClick={authVerify}
                />
              </>
            )}
            {replyComment && (
              <>
                <div className="close_reply">
                  <p className="user_name">Replying to {replyData?.fullName}</p>
                  <button className="close_button" onClick={handleReplyClose}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24px"
                      height="24px"
                    >
                      <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z" />
                    </svg>
                  </button>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  name="post_comment"
                  placeholder="write a reply"
                  value={reply}
                  onChange={handleReplyChange}
                  onClick={authVerify}
                />
              </>
            )}
            <a
              href="javascript:void(0);"
              className={`comment-submit ${
                replyComment ? "reply-comment" : ""
              }`}
              onClick={(event) => {
                if (
                  commentToUpdate &&
                  (commentToUpdate.postId || commentToUpdate.commentRefId)
                ) {
                  handleUpdateComment({ id: commentToUpdate.postId });
                } else {
                  if (replyComment && replyData) {
                    console.log("after reply");
                    handleCreateReply(event, replyData);
                  } else {
                    console.log("after comment");
                    handleCreateComment(event);
                  }
                }
              }}
            >
              <img src="/gluedin/images/send-icon.svg" />
            </a>
          </form>
        </div>
      </div>
    </>
  );
};

CommentsList.propTypes = {
  videoId: PropTypes.string,
  comments: PropTypes.array,
  setComments: PropTypes.func,
};

export default CommentsList;
