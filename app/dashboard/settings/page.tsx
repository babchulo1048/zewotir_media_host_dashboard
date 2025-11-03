"use client"; // must be first line

import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;

// import React from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import StaffSizeTab from "@/components/settings/StaffSizeTab";
// import StateTab from "@/components/settings/StateTab";
// import IndustryTab from "@/components/settings/IndustryTab";
// import SubCityTab from "@/components/settings/SubCityTab";
// import DefaultCurrencyTab from "@/components/settings/DefaultCurrencyTab";

// const tabData = [
//   { value: "staff-size", label: "Staff Size" },
//   { value: "state", label: "State" },
//   { value: "industry", label: "Industry" },
//   { value: "sub-city", label: "Sub City" },
//   { value: "default-currency", label: "Default Currency" },
// ];

// export default function SettingsPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   if (!searchParams) return null; // ✅ prevent errors during pre-render

//   const tabParam = searchParams.get("tab") || "staff-size";

//   const handleTabChange = (value: string) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("tab", value);
//     router.push(`?${params.toString()}`);
//   };

//   return (
//     <div className="p-6">
//       <Tabs value={tabParam} onValueChange={handleTabChange}>
//         <div className="hidden md:block max-w-full overflow-x-auto mb-4">
//           <TabsList className="flex gap-4">
//             {tabData.map((tab) => (
//               <TabsTrigger key={tab.value} value={tab.value}>
//                 {tab.label}
//               </TabsTrigger>
//             ))}
//           </TabsList>
//         </div>

//         <TabsContent value="staff-size">
//           <StaffSizeTab />
//         </TabsContent>
//         <TabsContent value="state">
//           <StateTab />
//         </TabsContent>
//         <TabsContent value="industry">
//           <IndustryTab />
//         </TabsContent>
//         <TabsContent value="sub-city">
//           <SubCityTab />
//         </TabsContent>
//         <TabsContent value="default-currency">
//           <DefaultCurrencyTab />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
