"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useEffect } from "react";

interface Permission {
  id: number;
  name: string;
  category: string;
  action: string;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onSaveSuccess: () => void;
}

// Static list of all permissions
const staticAllPermissions: Permission[] = [
  { id: 101, name: "view_users", category: "Users", action: "View Users" },
  { id: 102, name: "edit_users", category: "Users", action: "Edit Users" },
  {
    id: 201,
    name: "view_reports",
    category: "Reports",
    action: "View Reports",
  },
  {
    id: 301,
    name: "view_dashboard",
    category: "Dashboard",
    action: "View Dashboard",
  },
];

export default function PermissionDialog({
  open,
  onOpenChange,
  role,
  onSaveSuccess,
}: Props) {
  const allPermissions = staticAllPermissions;

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    for (const permission of allPermissions) {
      if (!groups[permission.category]) {
        groups[permission.category] = [];
      }
      groups[permission.category].push(permission);
    }
    return groups;
  }, [allPermissions]);

  const allAvailablePermissionNames = useMemo(() => {
    const names = new Set<string>();
    allPermissions.forEach((p) => names.add(p.name));
    return Array.from(names);
  }, [allPermissions]);

  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (role && open) {
      const initialSelected = new Set(role.permissions.map((p) => p.name));
      setSelectedPermissions(initialSelected);
    } else if (!open) {
      setSelectedPermissions(new Set());
    }
  }, [role, open]);

  const handleToggleSingle = (name: string, checked: boolean) => {
    const updated = new Set(selectedPermissions);
    checked ? updated.add(name) : updated.delete(name);
    setSelectedPermissions(updated);
  };

  const handleToggleGroup = (category: string, checked: boolean) => {
    const perms = groupedPermissions[category];
    const updated = new Set(selectedPermissions);
    if (checked) {
      perms.forEach((p) => updated.add(p.name));
    } else {
      perms.forEach((p) => updated.delete(p.name));
    }
    setSelectedPermissions(updated);
  };

  const handleSave = () => {
    console.log(
      "Updated permissions for role:",
      role?.name,
      Array.from(selectedPermissions)
    );
    onOpenChange(false);
    onSaveSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-8 bg-background rounded-lg shadow-xl flex flex-col max-h-[95vh]">
        <DialogHeader className="pb-4 pt-4 border-b border-border flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Permissions for {role?.name || "Selected Role"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm mt-2 mb-6">
            Manage the specific permissions assigned to this role.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="pr-4 py-4 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedPermissions).map(
              ([category, permissions]) => {
                const allGroupChecked = permissions.every((p) =>
                  selectedPermissions.has(p.name)
                );
                const someGroupChecked = permissions.some((p) =>
                  selectedPermissions.has(p.name)
                );
                return (
                  <div
                    key={category}
                    className="rounded-lg border border-border bg-muted p-5 shadow-sm"
                  >
                    <h4 className="text-base font-semibold text-foreground mb-3">
                      {category}
                    </h4>
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        id={`group-all-${category}`}
                        checked={allGroupChecked}
                        indeterminate={someGroupChecked && !allGroupChecked}
                        onCheckedChange={(checked) =>
                          handleToggleGroup(category, Boolean(checked))
                        }
                      />
                      <Label
                        htmlFor={`group-all-${category}`}
                        className="text-sm font-medium"
                      >
                        All
                      </Label>
                    </div>
                    <div className="space-y-3">
                      {permissions.map((perm) => (
                        <div
                          key={perm.id}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={perm.name}
                            checked={selectedPermissions.has(perm.name)}
                            onCheckedChange={(checked) =>
                              handleToggleSingle(perm.name, Boolean(checked))
                            }
                          />
                          <Label
                            htmlFor={perm.name}
                            className="text-sm capitalize text-foreground cursor-pointer"
                          >
                            {perm.action}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t border-border flex justify-end space-x-2 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
