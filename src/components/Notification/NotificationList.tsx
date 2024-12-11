import LoaderWithText from "../common/LoaderWithText";
import gluedin from "gluedin-shorts-js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NotificationList() {
  const navigate = useNavigate();

  const [data, setData]: any = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const notificationModuleObj = new gluedin.GluedInNotificationModule();
        const notificationModuleResponse =
          await notificationModuleObj.getNotificationList({
            limit: 20,
            offset: 1,
          });
        if (notificationModuleResponse.status === 200) {
          let notificationList = notificationModuleResponse.data.result;
          setData(notificationList);
        } else {
          if (notificationModuleResponse.status === 401) {
            localStorage.clear();
            navigate("/sign-in");
            // loginModalHandler();
          }
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }
    fetchData();
  }, []);

  if (!data && !isLoading) return <p>No data</p>;

  if (isLoading) return <LoaderWithText />;

  const getDate = (inputDate: any) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const d = new Date(inputDate);
    return d.getDate() + " " + monthNames[d.getMonth()] + " " + d.getFullYear();
  };

  const getTime = (date: any) => {
    if (typeof date !== "object") {
      date = new Date(date);
    }
    let currentDate: any = new Date();
    var seconds: any = Math.floor((currentDate - date) / 1000);
    var intervalType;

    var interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      intervalType = "year";
    } else {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        intervalType = "month";
      } else {
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          intervalType = "day";
        } else {
          interval = Math.floor(seconds / 3600);
          if (interval >= 1) {
            intervalType = "hour";
          } else {
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
              intervalType = "minute";
            } else {
              interval = seconds;
              intervalType = "second";
            }
          }
        }
      }
    }

    if (interval > 1 || interval === 0) {
      intervalType += "s";
    }

    return interval + " " + intervalType;
  };

  const renderNotifications = (contentInfo: any) => {
    return contentInfo.notifications.map((notification: any, index: any) => (
      <div className="notification-box" key={index}>
        <ul className="notification-box-ul">
          <li className="content-sec">
            <ul>
              <li> {getTime(contentInfo.date)}</li>
              <li> {getDate(contentInfo.date)}</li>
            </ul>
            <div className="text mt-t-10"> {notification.discription}</div>
          </li>
          <li className="img-sec">
            <img
              src={
                notification.videoThumbnail ||
                notification?.actingUserProfileImage
              }
              alt="notification"
            />
          </li>
        </ul>
      </div>
    ));
  };

  return data.map((notification: any) => {
    return renderNotifications(notification);
  });
}

export default NotificationList;
