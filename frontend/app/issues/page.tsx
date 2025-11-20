"use client";

import CreateIssue from "@/components/CreateIssue";
import IssueFilters from "@/components/IssueFilters";
import KanbanProvider from "@/components/KanbanBoard/KanbanProvider";
import { getIssues } from "@/services/issues";
import { IssueStatusType, PriorityType } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const IssuesList = () => {
  const searchParams = useSearchParams();
  const assignee = searchParams.get("assignee") || undefined;
  const priority = searchParams.get("priority");
  const priorities = priority ? [priority as PriorityType] : undefined;
  const labels = searchParams.get("labels")?.split(",").filter(Boolean) ?? [];
  const status = searchParams.get("status");
  const statuses = status ? [status as IssueStatusType] : undefined;

  const { data, isLoading, error } = useQuery({
    queryKey: ["issues", assignee, priorities, labels, statuses],
    queryFn: () =>
      getIssues({
        assignee,
        priority: priorities,
        labels,
        status: statuses,
      }),
  });

  const issues = data?.data || [];

  if (error) {
    return <h1>Error</h1>;
  }

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  return (
    <div className="min-h-screen">
      <IssueFilters />
      <CreateIssue />
      <KanbanProvider issues={issues} />
    </div>
  );
};

export default function IssuesPage() {
  return (
    <Suspense>
      <IssuesList />
    </Suspense>
  );
}
