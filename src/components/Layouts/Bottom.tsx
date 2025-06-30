import DiscoverIcon from "../../assets/icons/DiscoverIcon";
import HomeIcon from "../../assets/icons/HomeIcon";
import NotificationIcon from "../../assets/icons/NotificationIcon";
import ProfileIcon from "../../assets/icons/ProfileIcon";
import { useConfig } from "../../contexts/Config/configContext";
import { useLoginModalContext } from "../../contexts/LoginModal";
import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Bottom() {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const { setShowLoginModal } = useLoginModalContext();
  const { appConfig } = useConfig();

  useEffect(() => {
    const accessToken = new gluedin.GluedInAuthModule().getAccessToken();
    accessToken
      .then((data: any) => {
        // handle success case
        if (data) {
          setIsLoggedin(true);
        }
      })
      .catch((error: any) => {
        // handle error case
        console.error(error);
      });
  }, []);

  const _navigateToProfile = () => {
    const accessToken = new gluedin.GluedInAuthModule().getAccessToken();
    accessToken
      .then((data: any) => {
        // handle success case
        // console.log('access Token', data);
        if (!data) {
          // Show Login Modal
          setShowLoginModal(true);
        } else {
          navigate("/my-profile");
        }
      })
      .catch((error: any) => {
        // handle error case
        console.error(error);
      });
  };
  const _navigateToNotification = () => {
    const accessToken = new gluedin.GluedInAuthModule().getAccessToken();
    accessToken
      .then((data: any) => {
        // handle success case
        if (!data) {
          // Show Login Modal
          setShowLoginModal(true);
        } else {
          navigate("/notification");
        }
      })
      .catch((error: any) => {
        // handle error case
        console.error(error);
      });
  };

  return (
    <>
      <div className="res-bootom-bar">
        <ul className="res-bootom-bar-ul">
          <li>
            <Link to="/vertical-player">
              <HomeIcon />
            </Link>
          </li>
          <li>
            <Link to="/discover">
              <DiscoverIcon />
            </Link>
          </li>
          {isLoggedin &&
            ((userData?.creator && appConfig?.inviteOnlyCreation) ||
              (!appConfig?.inviteOnlyCreation && appConfig?.ugcEnabled)) && (
              <li className="creator-button">
                <a href="/create-post" className="go-to-page-create-content">
                  <img src="/gluedin/images/creator-button.svg" alt="" />
                </a>
              </li>
            )}
          <li>
            <button
              className="go-to-notification"
              onClick={_navigateToNotification}
            >
              <NotificationIcon />
            </button>
          </li>
          <li>
            <button className="go-to-user-profile" onClick={_navigateToProfile}>
              <ProfileIcon />
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Bottom;
