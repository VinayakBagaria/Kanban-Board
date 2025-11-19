"use client";

import IssueDetails from "@/components/IssueDetails";
import { getIssue } from "@/services/issues";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const IssueDetailsPage = () => {
  const params = useParams();
  const id = params.id as string;

  const { data: issue, isLoading } = useQuery({
    queryKey: ["issue", id],
    queryFn: () => getIssue(id),
  });

  if (isLoading) {
    return "Loading...";
  }

  if (!issue) {
    return "Issue not found...";
  }

  return <IssueDetails issue={issue} />;
};

export default IssueDetailsPage;
