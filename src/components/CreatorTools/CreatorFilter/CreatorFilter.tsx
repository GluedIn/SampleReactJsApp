import FilterImage from "../../../assets/img/img_01.jpg";
import "./CreatorFilter.css";
import React, { useEffect, useState } from "react";

const filters = {
  normal: "none",
  grayscale: "grayscale(100%)",
  sepia: "sepia(100%)",
  vintage: "contrast(1.4) brightness(1.2) sepia(0.5) saturate(1.2)",
  blackWhite: "grayscale(100%) contrast(1.5) brightness(0.9)",
  bright: "brightness(1.5) contrast(1.3) saturate(1.2)",
  warm: "sepia(40%) contrast(1.2) brightness(1.1) hue-rotate(-10deg)",
  cold: "brightness(0.9) contrast(1.2) hue-rotate(180deg) saturate(0.8)",
  glow: "brightness(1.3) contrast(1.5) saturate(1.4)",
  darken: "brightness(0.8) contrast(1.2) saturate(0.9)",
  fade: "brightness(1.1) contrast(0.8) saturate(0.7)",
  pop: "contrast(1.5) saturate(1.8) brightness(1.1)",
  vivid: "contrast(1.2) brightness(1.1) saturate(1.3)",
  vividWarm:
    "contrast(1.3) brightness(1.1) saturate(1.3) sepia(0.3) hue-rotate(-10deg)",
  vividCool: "contrast(1.3) brightness(1.1) saturate(1.3) hue-rotate(180deg)",
  dramatic: "contrast(1.5) brightness(0.9) saturate(0.8)",
  dramaticWarm:
    "contrast(1.5) brightness(0.9) saturate(0.8) sepia(0.4) hue-rotate(-10deg)",
  dramaticCool:
    "contrast(1.5) brightness(0.9) saturate(0.8) hue-rotate(180deg)",
  mono: "grayscale(100%) contrast(1.2) brightness(1.1)",
  silvertone: "grayscale(100%) contrast(1.3) brightness(1.1) sepia(0.15)",
  noir: "grayscale(100%) contrast(1.8) brightness(0.8)",
};

const FilterSelector = ({
  onFilterSelect,
  poster,
}: {
  onFilterSelect: (filterName: string, filterValue: string) => void;
  poster?: any;
}) => {
  // Get stored filter or fallback to "normal"
  const getStoredFilter = () => localStorage.getItem("filterName") || "normal";
  const [selectedFilter, setSelectedFilter] = useState<string>(getStoredFilter);

  // Store filter in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("filterName", selectedFilter);
  }, [selectedFilter]);

  return (
    <div className="filter-container">
      {Object.entries(filters).map(([filterName, filterValue]) => (
        <div
          key={filterName}
          className={`filter-box ${
            selectedFilter === filterName ? "selected" : ""
          }`}
          onClick={() => {
            setSelectedFilter(filterName);
            onFilterSelect(filterName, filterValue);
          }}
        >
          <div
            className="filter-preview"
            style={{
              backgroundImage: `url(${poster ? poster : FilterImage})`,
              filter: filterValue,
            }}
          ></div>
          <span className="filter-label">{filterName}</span>
        </div>
      ))}
    </div>
  );
};

export default FilterSelector;
