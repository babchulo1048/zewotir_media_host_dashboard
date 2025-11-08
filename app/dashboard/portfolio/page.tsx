// app/admin/portfolio/page.tsx

"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { PlusCircle, Layers } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetDeleteDialog } from "@/components/assets/AssetDeleteDialog";

import { PortfolioAsset, AssetType, PortfolioAssets } from "@/lib/models";

// --- Import Placeholder Components (You will create these) ---
import { AssetsDataTable } from "@/components/assets/AssetsDataTable";
import { AssetFormDialog } from "@/components/assets/AssetFormDialog";
import { AssetViewDialog } from "@/components/assets/AssetViewDialog";
import { apiFetch } from "@/lib/axios"; // Assuming apiFetch is imported from here
import { useToast } from "@/components/ui/use-toast";

// --- 🎯 UPDATED: Define the 5 valid lowercase types ---
type LowercaseAssetType =
  | "tvhost"
  | "mcing"
  | "interviews"
  | "voiceover"
  | "art";

// --- 🎯 UPDATED: Map for UI Display vs. Backend Value (5 Tabs) ---
const ASSET_TYPE_MAP: { name: string; type: LowercaseAssetType }[] = [
  { name: "TV Host", type: "tvhost" },
  { name: "MC & Events", type: "mcing" },
  { name: "Strategic Interviews", type: "interviews" },
  { name: "Voice-Overs", type: "voiceover" },
  { name: "Art/Design", type: "art" },
];

export default function PortfolioPage() {
  const { toast } = useToast();
  // --- UPDATED: Initial state set to the first new asset type ---
  const [currentTab, setCurrentTab] = useState<LowercaseAssetType>("tvhost");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<PortfolioAsset | undefined>(
    undefined
  );

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingAsset, setViewingAsset] = useState<PortfolioAsset | undefined>(
    undefined
  );

  // --- Asset Delete Dialog States 🌟 NEW 🌟 ---
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<
    PortfolioAsset | undefined
  >(undefined);
  // We will store all fetched assets here
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 CORE FUNCTION: Fetch data from the API (No logic change needed here)
  const fetchAssets = useCallback(
    async (assetType: LowercaseAssetType) => {
      setIsLoading(true);
      try {
        // This endpoint now correctly fetches data for any of the 5 types
        const endpoint = `/portfolio/assets/${assetType}`;
        const data: PortfolioAssets[] = await apiFetch(endpoint);

        // Map snake_case backend to camelCase frontend model
        const mappedAssets: PortfolioAsset[] = data.map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          assetType: a.asset_type,
          url: a.link_url,
          thumbnailUrl: a.thumbnail_url,
          tags: a.tags,
          isFeatured: a.is_featured,
          isActive: a.is_active,
          createdAt: a.created_at,
        }));

        setAssets(mappedAssets);
      } catch (error) {
        console.error("Failed to fetch portfolio assets:", error);
        toast({
          title: "Error",
          description: `Failed to load assets: ${(error as Error).message}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Fetch data when the component mounts or the tab changes
  useEffect(() => {
    // Pass the current tab (lowercase) to the fetch function
    fetchAssets(currentTab);
  }, [currentTab, fetchAssets]); // Re-fetch whenever the currentTab changes

  // 1. Filter data based on the selected tab (The name of this is slightly misleading now, as the API already filtered it)
  const filteredAssets = useMemo(() => {
    const targetType = currentTab.toLowerCase();

    return (
      assets?.filter(
        (asset) => (asset.assetType || "").toLowerCase() === targetType
      ) ?? []
    );
  }, [assets, currentTab]);

  // 2. Handler to open the dialog for creating a NEW asset
  const handleCreate = () => {
    setEditingAsset(undefined); // Clear any old editing data
    setIsDialogOpen(true);
  };

  // 3. Handler to open the dialog for editing an existing asset
  const handleEdit = (asset: PortfolioAsset) => {
    setEditingAsset(asset); // Set the asset data to pre-fill the form
    setIsDialogOpen(true);
  };

  // 🌟 NEW Handler: For the "Delete Asset" action
  const handleDelete = (asset: PortfolioAsset) => {
    setAssetToDelete(asset);
    setIsDeleteDialogOpen(true); // Open the delete confirmation modal
  };

  // 🌟 NEW Handler: For the "View Details" action
  const handleView = (asset: PortfolioAsset) => {
    setViewingAsset(asset); // Set the asset data to be displayed
    setIsViewDialogOpen(true); // Open the view modal
  };

  // 🌟 NEW: Callback function to run after a successful form submission (Create/Update/Delete)
  const handleFormSuccess = () => {
    setIsDialogOpen(false); // Close the dialog
    setEditingAsset(undefined);
    setIsDeleteDialogOpen(false);
    setAssetToDelete(undefined);
    // Re-fetch the data for the *current* tab to update the table
    fetchAssets(currentTab);
    toast({
      title: "Success",
      description: "Portfolio asset saved successfully!",
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Layers className="h-7 w-7" />
          Portfolio Content Manager
        </h1>
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Asset
        </Button>
      </div>

      {/* Reusable Dialog Component */}
      <AssetFormDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        assetToEdit={editingAsset} // undefined for create, object for edit
        onSuccess={handleFormSuccess}
      />

      <AssetViewDialog
        open={isViewDialogOpen}
        setOpen={setIsViewDialogOpen}
        asset={viewingAsset} // Pass the asset currently selected for viewing
      />

      {/* 🌟 NEW: Reusable Dialog Component (Delete) 🌟 */}
      <AssetDeleteDialog
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        assetToDelete={assetToDelete}
        onSuccess={handleFormSuccess}
      />

      {/* Tabs for Filtering (UPDATED) */}
      <Tabs
        defaultValue={currentTab}
        onValueChange={(value) => setCurrentTab(value as LowercaseAssetType)}
      >
        {/* 5 Tabs List */}
        <TabsList className="w-full justify-start overflow-x-auto">
          {ASSET_TYPE_MAP.map((tab) => (
            <TabsTrigger
              key={tab.type}
              value={tab.type} // 🎯 Uses the specific lowercase type ('tvhost', 'art', etc.)
              className="min-w-[150px]"
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content (The Data Table) */}
        {ASSET_TYPE_MAP.map((tab) => (
          <TabsContent key={tab.type} value={tab.type}>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{tab.name} Assets</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Render the DataTable with the filtered data */}
                <AssetsDataTable
                  data={filteredAssets}
                  assetType={currentTab}
                  onEdit={handleEdit}
                  onView={handleView}
                  isLoading={isLoading} // Pass loading state to table
                  onDelete={handleDelete} // We will implement this later
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
