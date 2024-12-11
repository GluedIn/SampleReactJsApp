import { useLoginModalContext } from "../../../../contexts/LoginModal";
import { useNotification } from "../../../../contexts/Notification";
import { isLoggedin } from "../../../Feed/Topic/helpers";
import LoaderDark from "../../../common/LoaderDark/LoaderDark";
import CloseIcon from "../../Icons/Close";
import Comment from "./Comment";
import gluedin from "gluedin-shorts-js";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const activityTimelineModule = new gluedin.GluedInActivityTimeline();

export default function Comments({
  setShowComments,
  video,
  videoRef,
  videoControls,
  setShowCommentReportModal,
  setCommentPostId,
  commentCount,
  setCommentCount,
}: //   commentId,
//   setShowHighlightedComment,
any) {
  const inputRef: any = useRef(null);
  const [reply, setReply] = useState("");
  const [totalComments, setTotalComments] = useState(0);
  const [replyComment, setReplyComment] = useState(false);
  const [noMoreComments, setNoMoreComments] = useState(false);
  const [replyData, setReplyData]: any = useState(null);
  const [comments, setComments] = useState<any>([]);
  const [comment, setComment] = useState("");
  const [commentToUpdate, setCommentToUpdate]: any = useState(null);
  const [replyToUpdate, setReplyToUpdate]: any = useState(null);
  const [rows, setRows] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading");
  const [commentError, setCommentError] = useState(false);
  const [replyError, setReplyError] = useState(false);
  const [showReply, setShowReply] = useState(false);

  const { t } = useTranslation();
  const { setShowLoginModal } = useLoginModalContext();
  const { showNotification } = useNotification();

  const incrementCount = () => {
    setCommentCount((prev: number) => prev + 1);
  };

  const decrementCount = (count = 1) => {
    setCommentCount((prev: number) => prev - count);
  };

  const handleViewMoreComments = () => {
    fetchComments(video.commentCount);
  };

  useEffect(() => {
    if (!isLoading) {
      setLoadingText("Loading");
    }
  }, [isLoading]);

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments(limit = 8) {
    setIsLoading(true);
    try {
      const response =
        await activityTimelineModule.getActivityTimelineCommentList({
          limit: limit,
          offset: 1,
          topicId: video.videoId,
        });
      if (response?.status === 200) {
        setComments(response?.data?.result);
        setTotalComments(response?.data?.total);
        if (response?.data?.result.length === 0) {
          setNoMoreComments((prev) => !prev);
        } else {
          setNoMoreComments((prev) => !prev);
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  const handleCreateComment = async (event: any) => {
    event.preventDefault();
    if (!comment) {
      showNotification({
        title: "Post Comment",
        subTitle: "Comment can not be empty",
      });
      return;
    }

    if (comment.length > 200) {
      showNotification({
        title: "Post Comment",
        subTitle: "Comment can not exceed 200 characters limit.",
      });
      return;
    }

    if (handleCommentValidation()) {
      const accessToken =
        await new gluedin.GluedInAuthModule().getAccessToken();
      if (!accessToken) {
        setShowLoginModal(true);
        return;
      }
      setComment("");
      setIsLoading(true);
      setLoadingText("Posting comment");
      try {
        const activityTimelineModuleObj = new gluedin.GluedInActivityTimeline();
        const userPostedComment =
          await activityTimelineModuleObj.activityTimelineAddComment({
            assetId: video.videoId,
            description: comment,
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
            createdAt: commentResponse.created_at,
            updatedAt: commentResponse.updated_at,
            fullName: username,
            profileImageUrl: profileImageUrl,
          };
          setComments([commentData, ...comments]);
          incrementCount();
          setShowReply(true);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    } else {
      showNotification({
        title: "Post Comment",
        subTitle: "Comment can not be empty",
      });
      return;
    }
  };

  const handleCreateReply = async (event: any, ids: any) => {
    if (!reply) {
      showNotification({
        title: "Post Reply",
        subTitle: "Reply can not be empty",
      });
      return;
    }

    if (handleReplyValidation()) {
      setReply("");
      setComment("");
      setLoadingText("Posting reply");

      let data: any = {};
      if (ids.postId) {
        data = comments.find(({ postId }: any) => postId === ids.postId);
      } else {
        data = comments.find(
          ({ commentRefId }: any) => commentRefId === ids.commentRefId
        );
      }
      event.preventDefault();
      const accessToken =
        await new gluedin.GluedInAuthModule().getAccessToken();
      if (!accessToken) {
        setShowLoginModal(true);
        return;
      }

      setIsLoading(true);
      try {
        let dataToSend: any = {
          assetId: video.videoId,
          description: reply,
        };
        if (ids.postId !== "") {
          dataToSend.postId = ids.postId;
        } else {
          dataToSend.postId = ids.commentRefId;
        }
        const activityTimelineModuleObj = new gluedin.GluedInActivityTimeline();
        const userPostedComment =
          await activityTimelineModuleObj.activityTimelineAddComment(
            dataToSend
          );
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
          setReplyComment(false);
          setIsLoading(false);
          setShowReply(true);
          incrementCount();
        }
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    } else {
      showNotification({
        title: "Post Reply",
        subTitle: "Reply can not be empty",
      });
      return;
    }
  };

  // onChange Textarea Handler - Case 1: the textarea height increases when the user manually enters input //
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const comment = e.target.value;
    if (commentError) {
      setCommentError(false); // Clear error when user starts typing again
    }
    let textAreaRows;
    if (e.target.scrollHeight < 72) {
      textAreaRows = Math.floor(e.target.scrollHeight / 36);
    } else {
      textAreaRows = Math.ceil(e.target.scrollHeight / 36);
    }
    if (rows < 4) {
      setRows(textAreaRows);
    }
    setComment(comment);
  };

  // onKeyDown Textarea Handler - Case 2: the textarea height decreases when the user manually removes input //
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isBackspaceOrDelete =
      event.key === "Backspace" || event.key === "Delete";
    if (event.nativeEvent instanceof KeyboardEvent) {
      if (rows === 1) {
        return;
      }
      if (isBackspaceOrDelete && event.currentTarget.scrollTop === 0) {
        setRows(rows - 1);
      }
    }

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleCommentValidation();
    }
  };

  // onInput Textarea Handler - Case 3: the textarea's height increases or decreases due to copy-pasting text or removing text with select all //
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if (
      e.currentTarget.value === "" &&
      e.currentTarget.selectionStart === 0 &&
      e.currentTarget.selectionEnd === e.currentTarget.value.length
    ) {
      setRows(1);
    }
  };

  const handleCommentFocus = async (
    e: React.FormEvent<HTMLTextAreaElement>
  ) => {
    const isUserLoggedIn = await isLoggedin();
    if (isUserLoggedIn) {
      return true;
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

  // Reply Edit Handler //
  const handleEditReply = async ({
    commentId,
    commentRef,
    replyId,
    replyRefId,
  }: any) => {
    let replyToEdit: any = {};
    let commentData: any = {};
    if (commentId) {
      commentData = comments.find(({ postId }: any) => postId === commentId);
    } else {
      commentData = comments.find(
        ({ commentRefId }: any) => commentRefId === commentRef
      );
    }

    replyToEdit = commentData.replys.find(
      ({ commentRefId }: any) => commentRefId === replyRefId
    );
    console.log(commentData, replyToEdit);
    const { description }: any = replyToEdit ?? {};
    if (commentId) {
      replyToEdit["commentId"] = commentId;
    } else {
      replyToEdit["commentRef"] = commentRef;
    }

    console.log("parent comment replays", commentData.replys, replyToEdit);
    setReplyComment(true);
    setReply(description);
    setReplyToUpdate(replyToEdit);
    inputRef?.current?.focus();
    inputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  const handleUpdateComment = async ({ event, id, refId }: any) => {
    //setComment("");
    if (handleCommentValidation()) {
      setIsLoading(true);
      setLoadingText("Updating comment");
      try {
        const feedModuleObj = new gluedin.GluedInFeedModule();
        const response = await feedModuleObj.UpdateComment({
          assetId: video.videoId,
          description: comment,
          ...(id ? { postId: id } : { commentRefId: refId }),
        });
        if (response?.data?.success) {
          const commentResponse = response?.data?.result;
          const modifiedCommentsList = comments.map((data: any) => {
            if (
              (id && data.postId === id) ||
              (refId && data.commentRefId === refId)
            ) {
              return {
                ...data,
                description: commentResponse.description,
              };
            }
            return data;
          });
          setComments(modifiedCommentsList);
          setCommentToUpdate(null);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    } else {
      showNotification({
        title: "Post Comment",
        subTitle: "Comment can not be empty",
      });
      return;
    }
  };

  // Reply Update Handler //
  const handleUpdateReply = async ({
    event,
    commentId,
    commentRef,
    replyId,
    replyRefId,
  }: any) => {
    setIsLoading(true);
    setLoadingText("Updating reply");
    try {
      const feedModuleObj = new gluedin.GluedInFeedModule();
      const response = await feedModuleObj.UpdateComment({
        assetId: video.videoId,
        description: reply,
        ...(replyId ? { postId: replyId } : { commentRefId: replyRefId }),
      });
      if (response?.data?.success) {
        const commentResponse = response?.data?.result;

        const updatedComments = comments.map((comment: any) => {
          if (
            (commentId && comment.postId === commentId) ||
            (commentRef && comment.commentRefId === commentRef)
          ) {
            const updatedReplies = comment.replys.map((reply: any) => {
              if (replyRefId && reply.commentRefId === replyRefId) {
                return { ...reply, description: commentResponse.description };
              }
              return reply;
            });
            return { ...comment, replys: updatedReplies };
          }
          return comment;
        });
        setComments(updatedComments);
        setReply("");
        setReplyToUpdate("");
        setReplyComment(false);
        setCommentToUpdate(null);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleDeleteComment = async ({ id, refId }: any) => {
    setIsLoading(true);
    setLoadingText("Deleting comment");
    try {
      const activityTimelineModuleObj = new gluedin.GluedInActivityTimeline();
      const response =
        await activityTimelineModuleObj.activityTimelineDeleteComment({
          assetId: video.videoId,
          ...(id ? { postId: id } : { commentRefId: refId }),
        });
      if (response.status === 201) {
        let deletedCommentIndex: any;
        if (id) {
          deletedCommentIndex = comments.findIndex(
            ({ postId }: any) => postId === id
          );
        } else {
          deletedCommentIndex = comments.findIndex(
            ({ commentRefId }: any) => commentRefId === refId
          );
        }
        // const deletedCommentIndex = comments.findIndex(
        //   ({ postId }: any) => postId === id
        // );
        const deletedComment = comments[deletedCommentIndex];
        if (deletedComment) {
          decrementCount(1 + (deletedComment?.replyCount ?? 0));
        } else {
          decrementCount();
        }
        comments.splice(deletedCommentIndex, 1);
        setComments([...comments]);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
    // reFetchComments();
  };

  // Reply Delete Handler //
  const handleDeleteReply = async ({
    commentId,
    commentRef,
    replyId,
    replyRefId,
  }: any) => {
    setIsLoading(true);
    setLoadingText("Deleting reply");
    try {
      const activityTimelineModuleObj = new gluedin.GluedInActivityTimeline();
      const response =
        await activityTimelineModuleObj.activityTimelineDeleteComment({
          assetId: video.videoId,
          ...(replyId ? { postId: replyId } : { commentRefId: replyRefId }),
        });
      if (response.status === 201) {
        let deletedReplyIndex: any;
        let commentData: any = {};
        if (commentId) {
          commentData = comments.find(
            ({ postId }: any) => postId === commentId
          );
        } else {
          commentData = comments.find(
            ({ commentRefId }: any) => commentRefId === commentRef
          );
        }

        deletedReplyIndex = commentData.replys.findIndex(
          ({ commentRefId }: any) => commentRefId === replyRefId
        );
        const deletedComment = commentData.replys[deletedReplyIndex];
        if (deletedComment) {
          decrementCount(1 + (deletedComment?.replyCount ?? 0));
        } else {
          decrementCount();
        }
        commentData.replys.splice(deletedReplyIndex, 1);
        const updatedComments = comments.map((comment: any) => {
          if (
            (commentId && comment.postId === commentId) ||
            (commentRef && comment.commentRefId === commentRef)
          ) {
            return { ...comment, replys: commentData.replys };
          }
          return comment;
        });
        setComments(updatedComments);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleReplyComment = async ({ id, refId }: any) => {
    const isUserLoggedIn = await isLoggedin();
    if (isUserLoggedIn) {
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
      setReplyData(replyToEdit);
      setReply(`@${replyToEdit.fullName} `);
      setReplyComment(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleReplyChange = (e: any) => {
    const comment = e.target.value;
    if (replyError) {
      setReplyError(false); // Clear error when user starts typing again
    }
    let textAreaRows;
    if (e.target.scrollHeight < 72) {
      textAreaRows = Math.floor(e.target.scrollHeight / 36);
    } else {
      textAreaRows = Math.ceil(e.target.scrollHeight / 36);
    }
    if (rows < 4) {
      setRows(textAreaRows);
    }
    setReply(comment);
  };

  const handleCommentValidation = () => {
    if (!isCommentValid(comment)) {
      setCommentError(true);
      return false;
    }
    return true;
  };

  const isCommentValid = (comment: any) => {
    console.log(comment.trim().length > 0);
    return comment.trim().length > 0;
  };

  const handleReplyValidation = () => {
    if (!isReplyValid(reply)) {
      setCommentError(true);
      return false;
    }
    return true;
  };

  const isReplyValid = (reply: any) => {
    console.log(reply.trim().length > 0);
    return reply.trim().length > 0;
  };

  //   const highlightedComment = comments.filter(
  //     (commentItem: any) => commentItem && commentItem.postId === commentId
  //   );

  //   const moveItemToTop = (commentId: any) => {
  //     // Find the index of the item with the specified ID
  //     console.log("Commentid", commentId, comments);
  //     const index = comments.findIndex(
  //       (commentItem: any) => commentItem.postId === commentId
  //     );
  //     console.log("Index", index);
  //     // If the item is found
  //     if (index !== -1) {
  //       // Create a copy of the array
  //       const newArray = [...comments];
  //       // Remove the item from its current position
  //       const movedItem = newArray.splice(index, 1)[0];
  //       // Add the item to the beginning of the array
  //       newArray.unshift(movedItem);
  //       console.log("Newarray", newArray);
  //       // Update the state with the new array
  //       setComments(newArray);
  //     }
  //   };

  //   useEffect(() => {
  //     moveItemToTop(commentId);
  //   }, [comments]);

  return (
    <div
      data-loading={isLoading}
      className="comment_wrapper pointer-events-auto data-[loading=true]:pointer-events-none"
    >
      {isLoading && (
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col gap-5">
            <LoaderDark />
            <div>{loadingText || "Loading"}...</div>
          </div>
        </div>
      )}
      <div
        data-loading={isLoading}
        className="opacity-100 data-[loading=true]:opacity-25 h-full"
      >
        <div className="top_content">
          <h5>
            {commentCount}{" "}
            {commentCount > 1 ? t("label-comments") : t("label-comment")}
          </h5>
          <button
            className="close_button"
            onClick={() => {
              setShowComments(false);
              // setShowHighlightedComment(false);
              if (videoRef.current) {
                videoRef.current.classList.remove("video-player-radius");
                videoControls.current.classList.remove("video-player-radius");
              }
            }}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="comments_list overflow-y-auto">
          {/* {commentId &&
          highlightedComment?.length > 0 &&
          highlightedComment?.map((comment: any) => (
            <Comment
              video={video}
              comment={comment}
              key={comment.postId}
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
              handleReplyComment={handleReplyComment}
            />
          ))} */}
          {comments.map((comment: any) => (
            <Comment
              video={video}
              comment={comment}
              key={comment.postId}
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
              handleReplyComment={handleReplyComment}
              setShowCommentReportModal={setShowCommentReportModal}
              setCommentPostId={setCommentPostId}
              showReply={showReply}
              onReplyEdit={handleEditReply}
              onReplyDelete={handleDeleteReply}
            />
          ))}
          {totalComments > 8 && !noMoreComments && (
            <button
              className="view-more-comments"
              onClick={() => handleViewMoreComments()}
              role="link"
            >
              <span className="comment-count ">
                {t("view-reply")} {t("text-more")} {t("label-comments")}
              </span>
            </button>
          )}
        </div>

        <div className="comment_input">
          <div className="left">
            <img src="/gluedin/images/Profile.png" alt="" />
          </div>
          <div className="input_field">
            <form
              action=""
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <div className="">
                {!replyComment && (
                  <textarea
                    ref={inputRef}
                    placeholder={`${t("add-a-comment")}...`}
                    aria-label="comment"
                    aria-describedby="comment"
                    value={comment}
                    onChange={handleCommentChange}
                    className="comment-textarea"
                    rows={rows}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    onFocus={handleCommentFocus}
                  ></textarea>
                )}
                {replyComment && (
                  <textarea
                    ref={inputRef}
                    placeholder="Write a reply"
                    aria-label="comment"
                    aria-describedby="comment"
                    value={reply}
                    onChange={handleReplyChange}
                    className="comment-textarea"
                    rows={rows}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    onFocus={handleCommentFocus}
                  />
                )}
                <button
                  type="submit"
                  id="button-addon2"
                  onClick={(event) => {
                    setRows(1);
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
                      if (replyComment && replyData && !replyToUpdate) {
                        handleCreateReply(event, replyData);
                      } else if (
                        replyToUpdate &&
                        (replyToUpdate.postId || replyToUpdate.commentRefId)
                      ) {
                        handleUpdateReply({
                          event,
                          commentId: replyToUpdate.commentId,
                          commentRef: replyToUpdate.commentRef,
                          replyId: replyToUpdate.postId,
                          replyRefId: replyToUpdate.commentRefId,
                        });
                      } else {
                        handleCreateComment(event);
                      }
                    }
                  }}
                >
                  {isLoading ? (
                    <LoaderDark />
                  ) : (
                    <img src="/gluedin/images/send-icon.svg" alt="" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
