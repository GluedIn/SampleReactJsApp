import { useLoginModalContext } from "../../../contexts/LoginModal";
import { isLoggedin } from "./helpers";
import gluedin from "gluedin-shorts-js";
import React from "react";

const userModule = new gluedin.GluedInUserModule();

function Follow({ userId }: { userId: string }) {
  const { setShowLoginModal } = useLoginModalContext();

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const followingList: any[] = JSON.parse(
    localStorage.getItem("following") || "[]"
  );

  const isFollowing = (() => {
    if (followingList.includes(userId)) return true;
    return false;
  })();

  const handleFollowEvent = async (event: any) => {
    const isUserLoggedIn: any = await isLoggedin();
    if (!isUserLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    const followBtnText = event.target.innerText;
    var formData = {
      followingId: userId,
      isFollow: followBtnText === "Follow +" ? true : false,
    };
    const userModuleResponse = await userModule.followUser(formData);
    const { status } = userModuleResponse ?? {};
    if (status === 201 || status === 200) {
      if (followingList.length) {
        const target: any = document.getElementById("follow-" + userId);
        if (target.innerHTML === "Follow +") {
          followingList.push(userId);
          localStorage.setItem("following", JSON.stringify(followingList));
          target.innerHTML = "Unfollow";
          const followButtons = document.querySelectorAll(
            ".follow-user-" + userId
          );
          followButtons.forEach(function (fb) {
            fb.innerHTML = "Unfollow";
          });
        } else {
          const newFollowing = followingList.filter(
            (value: any) => value !== userId
          );
          localStorage.setItem("following", JSON.stringify(newFollowing));
          target.innerHTML = "Follow +";
          const followButtons = document.querySelectorAll(
            ".follow-user-" + userId
          );
          followButtons.forEach(function (fb) {
            fb.innerHTML = "Follow +";
          });
        }
      }
    }
  };

  return (
    <>
      {userData?.userId !== userId && (
        <button
          className={`follow-user follow-user-${userId}`}
          id={`follow-${userId}`}
          onClick={(e) => handleFollowEvent(e)}
        >
          {isFollowing ? "Unfollow" : "Follow +"}
        </button>
      )}
    </>
  );
}

export default Follow;
