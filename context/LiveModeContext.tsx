"use client";

import { createContext, useContext, useState, useEffect } from "react";

type LiveModeContextType = {
  isLive: boolean;
  toggleLive: (value: boolean) => void;
};

const LiveModeContext = createContext<LiveModeContextType | undefined>(
  undefined
);

export const LiveModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("isLive");
    if (stored !== null) setIsLive(stored === "true");
  }, []);

  const toggleLive = (value: boolean) => {
    setIsLive(value);
    localStorage.setItem("isLive", String(value));
  };

  return (
    <LiveModeContext.Provider value={{ isLive, toggleLive }}>
      {children}
    </LiveModeContext.Provider>
  );
};

export const useLiveMode = () => {
  const context = useContext(LiveModeContext);
  if (!context)
    throw new Error("useLiveMode must be used within LiveModeProvider");
  return context;
};
