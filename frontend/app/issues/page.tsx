"use client";

import KanbanProvider from "@/components/KanbanBoard/KanbanProvider";
import { getIssues } from "@/services/issues";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";

const IssuesList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["issues"],
    queryFn: () => getIssues(),
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
