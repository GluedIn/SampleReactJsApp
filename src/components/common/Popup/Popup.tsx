import "./Popup.css";
import { useEffect, useState } from "react";

interface PopupHandlerProps {
  onBack?: () => void;
  title?: string;
  message?: string;
  triggerFromParent?: boolean; // Allow triggering from parent button
  onCancel?: () => void;
}

const PopupHandler: React.FC<PopupHandlerProps> = ({
  onBack,
  title,
  message,
  triggerFromParent = false,
  onCancel,
}) => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      setShowPopup(true);
      window.history.pushState(null, "", window.location.href); // Prevent actual navigation
    };

    window.history.pushState(null, "", window.location.href); // Push initial state
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  // Handle iOS swipe-back gesture
  //   useEffect(() => {
  //     const handleTouchStart = (event: TouchEvent) => {
  //       if (event.touches.length === 1 && event.touches[0].clientX < 50) {
  //         setShowPopup(true);
  //       }
  //     };

  //     window.addEventListener("touchstart", handleTouchStart);

  //     return () => {
  //       window.removeEventListener("touchstart", handleTouchStart);
  //     };
  //   }, []);

  // Trigger popup when parent component requests it
  useEffect(() => {
    if (triggerFromParent) {
      setShowPopup(true);
    }
  }, [triggerFromParent]);

  return (
    <>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            {title ? <h2>{title}</h2> : <h2>Are you sure you want to exit from creator?</h2>}

            {message && <p>{message}</p>}

            <div className="popup-actions">
              {onBack && (
                <button className="btn_primary" onClick={onBack}>
                  Yes
                </button>
              )}

              <button
                className={`${onBack ? "btn_transparent" : "btn_primary"} `}
                onClick={() => {
                  setShowPopup(false);
                  if (onCancel) onCancel();
                }}
              >
                {onBack ? "No" : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupHandler;
