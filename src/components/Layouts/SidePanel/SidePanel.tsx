import FilterClose from "../../../assets/icons/FilterClose";
import TickIcon from "../../../assets/icons/TickIcon";
import useIsMobile from "../../../hooks/useIsMobile";
import CloseIcon from "../../VerticalPlayer/Icons/Close";
import "./SidePanel.css";
import React from "react";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: any;
  selectedTool?: any;
  setSelectedFilter?: any;
}

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  selectedTool,
  setSelectedFilter,
}) => {
  const isMobile = useIsMobile();
  const handleFilterReset = () => {
    setSelectedFilter({
      filterName: "normal",
      filterValue: "none",
    });
    onClose();
    localStorage.removeItem("filterName");
  };

  return (
    <div
      className={`side-panel-overlay ${isOpen ? "open" : ""}`}
      onClick={onClose}
    >
      <div
        className={`side-panel ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="side-panel-header">
          {selectedTool === "music" && isMobile && (
            <button className="back-btn" onClick={onClose}>
              <svg
                id="arrow-left-line"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  id="Path_13228"
                  data-name="Path 13228"
                  d="M0,0H24V24H0Z"
                  fill="none"
                />
                <path
                  id="Path_13229"
                  data-name="Path 13229"
                  d="M7.828,11H20v2H7.828l5.364,5.364-1.414,1.414L4,12l7.778-7.778,1.414,1.414Z"
                  fill="#fff"
                />
              </svg>
            </button>
          )}
          <h2>{title}</h2>
          {(selectedTool !== "filter" || !isMobile) && (
            <button className="close-btn" onClick={onClose}>
              <CloseIcon width="40" height="40" />
            </button>
          )}
          {selectedTool === "filter" && isMobile && (
            <button className="close-btn left-4" onClick={handleFilterReset}>
              <FilterClose />
            </button>
          )}
          {selectedTool === "filter" && isMobile && (
            <button className="close-btn" onClick={onClose}>
              <TickIcon />
            </button>
          )}
        </div>
        <div className="side-panel-content">{children}</div>
      </div>
    </div>
  );
};

export default SidePanel;
