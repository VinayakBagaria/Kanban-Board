"use client";

import IssueDetails from "@/components/IssueDetails";
import { Skeleton } from "@/components/ui/skeleton";
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
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Skeleton className="w-[90%] h-[90%]" />
      </div>
    );
  }

  if (!issue) {
    return "Issue not found...";
  }

  return <IssueDetails issue={issue} />;
};

export default IssueDetailsPage;
