/*eslint-disable*/
import axios from "axios";
import gluedin from "gluedin-shorts-js";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ConfigContextType {
  appConfig?: any;
  fetchConfig: (value: any) => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | null>(null);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appConfig, setAppConfig] = useState<any>(null);
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const fetchConfig = async (userToken: any) => {
    try {
      const response = await new gluedin.GluedInUserModule().getUseConfig();
      //   const response = await axios.get(
      //     "https://stag-v2-api.gluedin.io/v2/user/config",
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${userToken ? userToken : userData?.token}`,
      //       },
      //     }
      //   );
      let result = response?.data?.result;
      setAppConfig(result);
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  };

  useEffect(() => {
    if (userData?.token) {
      fetchConfig(userData?.token);
    }
  }, [userData?.token]);

  return (
    <ConfigContext.Provider value={{ appConfig, fetchConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

// Custom hook to use the context
export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
