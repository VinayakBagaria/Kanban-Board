"use client";

import CreateIssue from "@/components/CreateIssue";
import IssueFilters from "@/components/IssueFilters";
import KanbanProvider from "@/components/KanbanBoard/KanbanProvider";
import { getIssues } from "@/services/issues";
import { IssueStatusType, IssuePriorityType } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const IssuesList = () => {
  const searchParams = useSearchParams();
  const assignee = searchParams.get("assignee") || undefined;
  const priorityParam = searchParams.get("priority");
  const priorities = priorityParam
    ? [priorityParam as IssuePriorityType]
    : undefined;
  const labelsParam = searchParams.get("labels");
  const labels = labelsParam
    ? labelsParam.split(",").filter(Boolean)
    : undefined;
  const statusParam = searchParams.get("status");
  const statuses = statusParam ? [statusParam as IssueStatusType] : undefined;

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
