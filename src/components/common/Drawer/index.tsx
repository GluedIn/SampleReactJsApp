import CloseIcon from "../../VerticalPlayer/Icons/Close";

export default function Drawer({ open, onClose, title, children }: any) {
  const handleOverlayClick = () => {
    onClose();
  };

  return (
    <>
      <div
        className={`side-fixed-panel-inner sound-panel ${open ? "open" : ""}`}
      >
        <ul className="panel-header">
          <li>
            <h4>{title}</h4>
          </li>
          <li>
            <button className="popup-close" onClick={onClose}>
              <CloseIcon />
            </button>
          </li>
        </ul>
        {children}
      </div>

      <div className="side-fixed-panel" onClick={handleOverlayClick}>
        <div className={`overlay ${open ? "open" : ""}`}></div>
      </div>
    </>
  );
}
