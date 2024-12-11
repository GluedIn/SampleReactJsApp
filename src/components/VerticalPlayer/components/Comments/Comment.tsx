import DeleteIcon from "../../../../assets/icons/DeleteIcon";
import EditIcon from "../../../../assets/icons/EditIcon";
import EyeCloseIcon from "../../../../assets/icons/EyeCloseIcon";
import EyeOpenIcon from "../../../../assets/icons/EyeOpenIcon";
import { useLoginModalContext } from "../../../../contexts/LoginModal";
import Report from "../../../Feed/Report";
import { isLoggedin } from "../../../Feed/Topic/helpers";
import LoaderDark from "../../../common/LoaderDark/LoaderDark";
import OptionsDark from "../../Icons/OptionsDark";
import ReportIcon from "../../Icons/Report";
import { Menu, Transition } from "@headlessui/react";
import gluedin from "gluedin-shorts-js";
import React, { useState, Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";

const getFormattedDate = (date: any) => {
  const options: any = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options);
};

export default function Comment({
  video,
  comment,
  onDelete,
  onEdit,
  handleReplyComment,
  setShowCommentReportModal,
  setCommentPostId,
  showReply,
  onReplyEdit,
  onReplyDelete,
}: any) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const { setShowLoginModal } = useLoginModalContext();
  const [commentReplies, setCommentReplies] = useState([]);
  const [replylimit, setReplyLimit]: any = useState(1);
  const [hideReplies, setHideReplies] = useState(showReply);
  const [showLoader, setShowLoader] = useState(false);

  const { t } = useTranslation();

  const {
    postId,
    commentRefId,
    userId,
    profileImageUrl,
    fullName,
    description,
    createdAt,
  } = comment ?? {};

  const [showFullDescription, setShowFullDescription] = useState({
    comment: false,
    reply: false,
    show: description.length > 100,
  });

  const displayedDescription = showFullDescription.show
    ? showFullDescription.comment
      ? description
      : `${description.slice(0, 100)}...`
    : description;

  const isActionEnabled = userData?.userId === userId;

  const toggleReportModal = () => {
    setCommentPostId(postId);
    setShowCommentReportModal((prevState: any) => !prevState);
  };

  async function fetchReplies() {
    try {
      setShowLoader(true);
      const activityTimelineModuleObj = new gluedin.GluedInActivityTimeline();
      const response =
        await activityTimelineModuleObj.getActivityTimelineCommentReplyList({
          limit: 3,
          offset: replylimit || 0,
          postId: postId,
        });

      if (response?.status === 200) {
        if (comment["replys"]) {
          comment["replys"] = comment["replys"].concat(response.data.result);
          setHideReplies((prevState: any) => prevState);
        } else {
          comment["replys"] = response.data.result;
          setHideReplies((prevState: any) => !prevState);
        }
        //comment["replys"] = removeDuplicates(comment["replys"]);
        comment.replyCount = comment.replyCount - 3;
        if (response.data.result.length !== 0) {
          const page = replylimit + 1;
          setReplyLimit(page);
        }
        setShowLoader(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  //   function removeDuplicates(array: any) {
  //     let uniqueMap: any = {};
  //     let uniqueArray = array.filter((item: any) => {
  //       if (!uniqueMap.hasOwnProperty(item.description)) {
  //         uniqueMap[item.description] = true;
  //         return true;
  //       }
  //       return false;
  //     });

  //     return uniqueArray;
  //   }

  const toggleRepliesHandler = () => {
    setHideReplies((prevState: any) => !prevState);
    fetchReplies();
  };

  const menuItems = [
    {
      show: userData.userId !== userId,
      onClick: async () => {
        const isUserLoggedIn = await isLoggedin();
        if (isUserLoggedIn) {
          toggleReportModal();
        } else {
          setShowLoginModal(true);
        }
      },
      icon: <ReportIcon />,
      label: t("report"),
    },
    {
      show: !hideReplies && comment?.replyCount < 0,
      onClick: toggleRepliesHandler,
      icon: <EyeOpenIcon />,
      label: `${t("show")} ${t("replies")}`,
    },
    {
      show: hideReplies && comment?.replyCount <= 0,
      onClick: toggleRepliesHandler,
      icon: <EyeCloseIcon />,
      label: `${t("hide")} ${t("replies")}`,
    },
    {
      show: isActionEnabled,
      className: "edit_btn",
      onClick: () => onEdit({ id: postId, refId: commentRefId }),
      icon: <EditIcon />,
      label: `${t("btn-edit")} ${t("label-comment")}`,
    },
    {
      show: isActionEnabled,
      className: "delete_btn",
      onClick: () => onDelete({ id: postId, refId: commentRefId }),
      icon: <DeleteIcon />,
      label: `${t("btn-delete")} ${t("label-comment")}`,
    },
  ];

  return (
    <>
      <div className="comment_info relative">
        <div className="left">
          <div className="img">
            <img
              src={
                profileImageUrl
                  ? profileImageUrl
                  : "/gluedin/images/Profile.png"
              }
              alt={`${fullName}-profile`}
            />
          </div>
          <div className="content">
            <h6>
              {fullName}
              <span>{getFormattedDate(createdAt)}</span>
            </h6>
            <p>
              {displayedDescription}{" "}
              {showFullDescription.show && (
                <button
                  className="hover:underline"
                  onClick={() =>
                    setShowFullDescription((prev) => ({
                      ...prev,
                      comment: !prev.comment,
                    }))
                  }
                >
                  {showFullDescription.comment ? "Show Less" : "Show More"}
                </button>
              )}
            </p>
            <div className="reply_content">
              <button
                className="reply_btn"
                onClick={() => {
                  handleReplyComment({ id: postId, refId: commentRefId });
                  setHideReplies(true);
                }}
              >
                {t("reply-btn")}
              </button>

              {showLoader && <LoaderDark />}

              <div className={hideReplies ? "show-reply" : "hide-reply"}>
                {comment?.replys &&
                  comment?.replys.map((reply: any) => (
                    <div
                      key={reply?.commentRefId}
                      className="comment_info mb_0"
                    >
                      <div className="left">
                        <div className="img">
                          <img
                            src={
                              reply?.profileImageUrl
                                ? reply.profileImageUrl
                                : "/gluedin/images/Profile.png"
                            }
                            alt=""
                          />
                        </div>
                        <div className="content">
                          <h6>
                            <span>{reply?.fullName}</span>
                          </h6>
                          <p>{reply?.description}</p>
                          <button
                            className="reply_btn"
                            onClick={() => {
                              handleReplyComment({
                                id: postId,
                                refId: commentRefId,
                              });
                              setHideReplies(true);
                            }}
                          >
                            {t("reply-btn")}
                          </button>
                        </div>
                      </div>

                      {/* Reply Context Menu Toggle */}
                      <div className="comment-menu-toggle right absolute right-[-15px] top-0">
                        <Menu as="div" className="inline-block text-left">
                          <Menu.Button>
                            <button className="misc_icon" title="More Options">
                              <OptionsDark />
                            </button>
                          </Menu.Button>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md focus:outline-none shadow-[0_0_32px_#00000014] cursor-pointer p-2 directionRtl">
                              {userData.userId !== userId && (
                                <Menu.Item>
                                  <div
                                    className={`reply_btn reply_actions`}
                                    onClick={async () => {
                                      const isUserLoggedIn = await isLoggedin();
                                      if (isUserLoggedIn) {
                                        toggleReportModal();
                                      } else {
                                        setShowLoginModal(true);
                                      }
                                    }}
                                  >
                                    <div className="btn-wrap">
                                      <span>
                                        <ReportIcon />
                                      </span>
                                      <p>{t("report")}</p>
                                    </div>
                                  </div>
                                </Menu.Item>
                              )}

                              {userData.userId === reply?.userId && (
                                <>
                                  <Menu.Item>
                                    <div
                                      className={`reply_btn reply_actions edit_btn`}
                                      onClick={() =>
                                        onReplyEdit({
                                          commentId: postId,
                                          commentRef: commentRefId,
                                          replyId: reply.postId,
                                          replyRefId: reply.commentRefId,
                                        })
                                      }
                                    >
                                      <div className="btn-wrap">
                                        <span>
                                          <EditIcon />
                                        </span>
                                        <p>
                                          {t("btn-edit")} {t("reply-btn")}
                                        </p>
                                      </div>
                                    </div>
                                  </Menu.Item>
                                  <Menu.Item>
                                    <div
                                      className={`reply_btn reply_actions delete_btn`}
                                      onClick={() =>
                                        onReplyDelete({
                                          commentId: postId,
                                          commentRef: commentRefId,
                                          replyId: reply.postId,
                                          replyRefId: reply.commentRefId,
                                        })
                                      }
                                    >
                                      <div className="btn-wrap">
                                        <span>
                                          <DeleteIcon />
                                        </span>
                                        <p>
                                          {t("btn-delete")} {t("reply-btn")}
                                        </p>
                                      </div>
                                    </div>
                                  </Menu.Item>
                                </>
                              )}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  ))}
              </div>

              {comment.replyCount > 0 && (
                <button className="view_replies" onClick={() => fetchReplies()}>
                  {t("view-reply")} {comment.replyCount} {t("replies")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Comment Context Menu Toggle */}
        <div className="comment-menu-toggle right absolute right-1 top-0">
          <Menu as="div" className="inline-block text-left">
            <Menu.Button>
              <button className="misc_icon" title="More Options">
                <OptionsDark />
              </button>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md focus:outline-none shadow-[0_0_32px_#00000014] cursor-pointer p-2 directionRtl">
                {menuItems
                  .filter(({ show }) => show)
                  .map((menuItem, index) => {
                    const {
                      onClick,
                      label,
                      className = "",
                      icon,
                    } = menuItem ?? {};

                    return (
                      <MenuItem
                        className={className}
                        onClick={onClick}
                        icon={icon}
                        label={label}
                      />
                    );
                  })}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      {/* {commentReplies.length ? (
        <div style={{ marginLeft: "4rem" }}>
          {commentReplies.map((reply: any) => (
            <Comment
              key={reply.commentRefId}
              video={video}
              comment={reply}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      ) : null} */}
    </>
  );
}

function MenuItem({ label, icon, className = "", onClick }: any) {
  return (
    <Menu.Item>
      <div
        className={`reply_btn reply_actions${className ? ` ${className}` : ""}`}
        onClick={onClick}
      >
        <div className="btn-wrap">
          <span>{icon}</span>
          <p>{label}</p>
        </div>
      </div>
    </Menu.Item>
  );
}
