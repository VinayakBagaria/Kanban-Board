"use client";

import { getLabels } from "@/services/labels";
import { getUsers } from "@/services/users";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { ISSUE_PRIORITY } from "./constants";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CameraFilled, ProjectFilled } from "@ant-design/icons";
import { ChevronDownIcon, X } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "./ui/menubar";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

const IssueFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const { data: labels = [] } = useQuery({
    queryKey: ["labels"],
    queryFn: getLabels,
  });

  const assignee = searchParams.get("assignee");
  const priority = searchParams.get("priority");
  const selectedLabels =
    searchParams.get("labels")?.split(",").filter(Boolean) ?? [];

  const hasActiveFilters = assignee || priority || selectedLabels.length > 0;

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/issues?${params.toString()}`);
  }

  function toggleLabel(labelId: string) {
    const params = new URLSearchParams(searchParams.toString());
    const newLabels = selectedLabels.includes(labelId)
      ? selectedLabels.filter((eachLabel) => eachLabel != labelId)
      : [...selectedLabels, labelId];

    if (newLabels.length > 0) {
      params.set("labels", newLabels.join(","));
    } else {
      params.delete("labels");
    }
    router.push(`/issues?${params.toString()}`);
  }

  return (
    <div className="py-4 px-6 flex gap-2">
      <Select
        value={assignee || "all"}
        onValueChange={(value) =>
          updateFilter("assignee", value === "all" ? null : value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={priority || "all"}
        onValueChange={(value) =>
          updateFilter("priority", value === "all" ? null : value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {ISSUE_PRIORITY.map((eachPriority) => (
            <SelectItem key={eachPriority.id} value={eachPriority.id}>
              {eachPriority.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className="w-[160] flex justify-between items-center">
            <div className="flex gap-1 items-center">
              Labels{" "}
              {selectedLabels.length > 0 && <p>({selectedLabels.length})</p>}
            </div>
            <ChevronDownIcon className="size-4 opacity-50" />
          </MenubarTrigger>
          <MenubarContent>
            {labels.map((eachLabel) => (
              <MenubarItem
                key={eachLabel.id}
                className="cursor-pointer"
                onClick={(event) => {
                  event.preventDefault();
                  toggleLabel(eachLabel.id);
                }}
              >
                <Checkbox
                  id={eachLabel.id}
                  checked={selectedLabels.includes(eachLabel.id)}
                  className="cursor-pointer"
                />
                <Label htmlFor={eachLabel.id}>{eachLabel.name}</Label>
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={() => router.push("/issues")}>
          <X />
          Clear filters
        </Button>
      )}
    </div>
  );
};

export default IssueFilters;
