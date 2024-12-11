import React, { createContext, useState, useContext, useEffect } from "react";

const DirectionContext = createContext({
  isRtl: false,
  isLtr: false,
});

export const DirectionProvider = ({ children }: { children: JSX.Element }) => {
  const [direction, setDirection] = useState("ltr");

  useEffect(() => {
    const directionElement = document.getElementById("direction");
    if (directionElement) {
      if (directionElement.getAttribute("dir") === "rtl") {
        setDirection("rtl");
      }
      if (directionElement.getAttribute("dir") === "ltr") {
        setDirection("ltr");
      }
    }
  }, []);

  return (
    <DirectionContext.Provider
      value={{ isRtl: direction === "rtl", isLtr: direction === "ltr" }}
    >
      {children}
    </DirectionContext.Provider>
  );
};

export const useDirectionContext = () => useContext(DirectionContext);
