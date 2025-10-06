"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface BusinessContextType {
  businessId: string | null;
  setBusinessId: (id: string) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(
  undefined
);

export const BusinessProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [businessId, setBusinessIdState] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("businessId");
    if (storedId) setBusinessIdState(storedId);
  }, []);

  const setBusinessId = (id: string) => {
    localStorage.setItem("businessId", id);
    setBusinessIdState(id);
  };

  return (
    <BusinessContext.Provider value={{ businessId, setBusinessId }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinessContext = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error(
      "useBusinessContext must be used within a BusinessProvider"
    );
  }
  return context;
};
