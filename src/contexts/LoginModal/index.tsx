import { createContext, useContext, useState } from "react";

const LoginModalContext = createContext({
  showLoginModal: false,
  setShowLoginModal: (value: boolean) => {},
});

export const LoginModalProvider = ({ children }: { children: JSX.Element }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <LoginModalContext.Provider value={{ showLoginModal, setShowLoginModal }}>
      {children}
    </LoginModalContext.Provider>
  );
};

export const useLoginModalContext = () => useContext(LoginModalContext);
