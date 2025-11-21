"use client";

import { getLabels } from "@/services/labels";
import { getUsers } from "@/services/users";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
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
    <div className="flex flex-wrap items-center gap-2">
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

      <div className="flex items-center gap-2 flex-wrap">
        {labels.map((label) => (
          <button
            key={label.id}
            type="button"
            onClick={() => toggleLabel(label.id)}
            className={`px-3 py-1 rounded-md text-xs border transition-colors ${
              selectedLabels.includes(label.id)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:bg-accent"
            }`}
            style={{
              borderColor: selectedLabels.includes(label.id)
                ? undefined
                : label.color,
            }}
          >
            {label.name}
          </button>
        ))}

        {hasActiveFilters && (
          <Button variant="ghost" onClick={() => router.push("/issues")}>
            <X />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default IssueFilters;
