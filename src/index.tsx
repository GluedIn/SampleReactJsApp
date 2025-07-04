import App from "./App";
import { ConfigProvider } from "./contexts/Config/configContext";
import { DirectionProvider } from "./contexts/Direction";
import { LoginModalProvider } from "./contexts/LoginModal";
import { NotificationProvider } from "./contexts/Notification";
import { ThemeProvider } from "./contexts/Theme";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "font-awesome/css/font-awesome.min.css";
import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ConfigProvider>
        <DirectionProvider>
          <LoginModalProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </LoginModalProvider>
        </DirectionProvider>
      </ConfigProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
