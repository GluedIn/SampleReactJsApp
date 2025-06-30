import React from "react";
import { Link } from "react-router-dom";

interface TaggedFriendsListProps {
  taggedFriends?: any[];
  handleRemove?: (user: any) => void;
  storyView?: boolean;
}

const TaggedFriendsList: React.FC<TaggedFriendsListProps> = ({
  taggedFriends,
  handleRemove,
  storyView,
}) => {
  return (
    <div className="tagged-friends-container">
      <ul className="tagged-friends-list">
        {taggedFriends?.map((friend) => (
          <li key={friend?.id} className="tagged-friend-item">
            <div className="friend-info">
              {/* <img
                src={friend.thumbnail}
                alt={friend.fullName}
                className="friend-avatar"
              /> */}
              <div>
                {/* <p className="friend-name">{friend.fullName}</p> */}
                <p className="friend-username">
                  {storyView ? (
                    <Link to={`/profile/${friend?.id}`}>{friend?.userName}</Link>
                  ) : (
                    friend?.userName
                  )}
                </p>
              </div>
            </div>
            {/* <button className="remove-btn" onClick={() => handleRemove(friend)}>
              <DeleteGrayIcon />
            </button> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaggedFriendsList;
