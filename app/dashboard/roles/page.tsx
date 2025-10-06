"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Loader2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import instance from "@/lib/axios";
import axios from "axios";

// --- Interfaces for Role/Permission ---
interface RolePermission {
  id: string;
  name: string;
}
interface Role {
  id: string;
  name: string;
  permissions: RolePermission[];
}

import PermissionDialog from "@/components/PermissionDialog";
// Main Component
export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches the list of roles from the backend API using the inline 'instance'.
   */
  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:9090/api/roles", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token here
        },
      });
      setRoles(response.data);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      setError("Failed to load roles. Using inline data simulation.");
      // Conditional check for toast availability
      if (typeof toast !== "undefined" && (toast as any).error) {
        (toast as any).error(
          "Failed to load roles (using simulation fallback)."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const openDialog = (role: Role) => {
    setSelectedRole(role);
    setDialogOpen(true);
  };

  const handleSaveSuccess = () => {
    setDialogOpen(false);
    fetchRoles();
    if (typeof toast !== "undefined" && (toast as any).success) {
      (toast as any).success("Role permissions updated successfully!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6 min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg text-muted-foreground">Loading Roles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-6 min-h-screen">
        <Card className="w-full max-w-4xl border border-destructive shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchRoles} className="mt-4" variant="destructive">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-6 min-h-screen">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="border-b">
          <CardTitle className="text-3xl font-bold">Role Management</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80%] text-lg font-semibold">
                  Role Name
                </TableHead>
                <TableHead className="text-center text-lg font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium py-3">
                    {/* Clean up role names for display (e.g., ROLE_ADMIN -> ADMIN) */}
                    {role.name.replace("ROLE_", "").replace("_", " ")}
                    <span className="ml-4 text-sm text-muted-foreground">
                      ({role.permissions.length} permissions)
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost" // Use ghost for a cleaner, theme-aware action button
                      size="icon"
                      title={`Edit permissions for ${role.name}`}
                      onClick={() => openDialog(role)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {roles.length === 0 && !isLoading && (
            <p className="text-center py-8 text-xl text-muted-foreground font-light">
              No roles found.
            </p>
          )}
        </CardContent>
      </Card>

      <PermissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        role={selectedRole}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}
