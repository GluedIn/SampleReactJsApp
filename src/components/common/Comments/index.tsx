import CommentsList from "./List";
import gluedin from "gluedin-shorts-js";
import { t } from "i18next";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

function Comments({ contentInfo }: any) {
  const [comments, setComments] = useState([]);

  const handleViewMoreComments = () => {
    fetchComments(contentInfo.commentCount);
  };

  useEffect(() => {
    fetchComments();
  }, [contentInfo?.videoId]);

  async function fetchComments(limit = 5) {
    try {
      const activityTimelineModuleObj = new gluedin.GluedInActivityTimeline();
      const response =
        await activityTimelineModuleObj.getActivityTimelineCommentList({
          limit: limit,
          offset: 1,
          topicId: contentInfo.videoId,
        });
      if (response?.status == 200) {
        setComments(response?.data?.result);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="comment-box-parent">
      {contentInfo.commentCount > 5 && comments.length <= 5 && (
        <div
          className="text ft-500 view-previous-comment"
          onClick={() => handleViewMoreComments()}
          role="link"
        >
          <span className="comment-count ">{contentInfo.commentCount - 5}</span>
          {t("view-previous-comments")}
        </div>
      )}
      <CommentsList
        videoId={contentInfo.videoId}
        comments={comments}
        setComments={setComments}
      />
    </div>
  );
}

Comments.propTypes = {
  contentInfo: PropTypes.object,
};

export default Comments;
