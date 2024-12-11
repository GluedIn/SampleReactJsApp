// NotificationContext.js
import { TOAST_TYPES } from "../../constants";
import React, { createContext, useContext, useEffect, useState } from "react";

interface IShowNotification {
  title: string;
  subTitle: string;
  autoClose?: boolean;
  type?: string;
}

const NotificationContext = createContext({
  notification: {
    show: false,
    title: "",
    subTitle: "",
    type: "info",
    autoClose: true,
  },
  showNotification: ({
    title,
    subTitle,
    autoClose,
    type,
  }: IShowNotification) => {},
  closeNotification: () => {},
});

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }: any) => {
  const [notification, setNotification] = useState({
    show: false,
    title: "",
    subTitle: "",
    type: "",
    autoClose: true,
  });

  useEffect(() => {
    if (notification.show && notification.autoClose) {
      const timer = setTimeout(() => {
        closeNotification();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show, notification.autoClose]);

  const showNotification = ({
    title,
    subTitle,
    type = TOAST_TYPES.INFO,
    autoClose = true,
  }: IShowNotification) => {
    setNotification((prev) => ({
      ...prev,
      show: true,
      title,
      type,
      subTitle,
      autoClose,
    }));
  };

  const closeNotification = () => {
    setNotification((prev) => ({
      ...prev,
      show: false,
    }));
  };

  return (
    <NotificationContext.Provider
      value={{ notification, showNotification, closeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
