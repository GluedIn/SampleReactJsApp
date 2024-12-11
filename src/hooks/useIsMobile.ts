import * as React from "react";

const useIsMobile = (mobileScreenSize = 991) => {
  if (typeof window.matchMedia !== "function") {
    throw Error("matchMedia not supported by browser!");
  }
  const [isMobile, setIsMobile] = React.useState(
    window.matchMedia(`(max-width: ${mobileScreenSize}px)`).matches
  );

  const checkIsMobile = React.useCallback((event: any) => {
    setIsMobile(event.matches);
  }, []);

  React.useEffect(() => {
    const mediaListener = window.matchMedia(
      `(max-width: ${mobileScreenSize}px)`
    );
    mediaListener.addEventListener("change", checkIsMobile);

    return () => {
      mediaListener.removeEventListener("change", checkIsMobile);
    };
  }, [mobileScreenSize]);

  return isMobile;
};

export default useIsMobile;
