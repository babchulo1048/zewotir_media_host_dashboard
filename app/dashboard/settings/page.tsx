"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// New tabs (you’ll create these components)
import StaffSizeTab from "@/components/settings/StaffSizeTab";
import StateTab from "@/components/settings/StateTab";
import IndustryTab from "@/components/settings/IndustryTab";
import SubCityTab from "@/components/settings/SubCityTab";
import StatusTab from "@/components/settings/StatusTab";
import CountriesTab from "@/components/settings/CountriesTab";
import DefaultCurrencyTab from "@/components/settings/DefaultCurrencyTab";
import BanksTab from "@/components/settings/BanksTab";
import FAQTab from "@/components/settings/FAQTab";

const tabData = [
  { value: "staff-size", label: "Staff Size" },
  { value: "state", label: "State" },
  { value: "industry", label: "Industry" },
  { value: "sub-city", label: "Sub City" },
  { value: "status", label: "Status" },
  // { value: "countries", label: "Countries" },
  { value: "default-currency", label: "Default Currency" },
  // { value: "banks", label: "Banks" },
  // { value: "faq", label: "FAQ" },
];

const Settings = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "staff-size";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="p-6">
      <Tabs value={tabParam} onValueChange={handleTabChange} className="w-full">
        {/* Tab list for medium+ screens */}
        <div className="hidden md:block max-w-full overflow-x-auto">
          <TabsList className="flex justify-start gap-6 mb-6">
            {tabData.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Dropdown menu for small screens */}
        <div className="md:hidden mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                {tabData.find((t) => t.value === tabParam)?.label ||
                  "Select Tab"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {tabData.map((tab) => (
                <DropdownMenuItem
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={tab.value === tabParam ? "bg-gray-100" : ""}
                >
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tab Content */}
        <TabsContent value="staff-size">
          <StaffSizeTab />
        </TabsContent>
        <TabsContent value="state">
          <StateTab />
        </TabsContent>
        <TabsContent value="industry">
          <IndustryTab />
        </TabsContent>
        <TabsContent value="sub-city">
          <SubCityTab />
        </TabsContent>
        {/* <TabsContent value="status">
          <StatusTab />
        </TabsContent> */}
        {/* <TabsContent value="countries">
          <CountriesTab />
        </TabsContent> */}
        <TabsContent value="default-currency">
          <DefaultCurrencyTab />
        </TabsContent>
        {/* <TabsContent value="banks">
          <BanksTab />
        </TabsContent> */}
        {/* <TabsContent value="faq">
          <FAQTab />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default Settings;
