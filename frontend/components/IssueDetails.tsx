import { updateIssue } from "@/services/issues";
import { IIssue, UpdateIssueRequestType } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import IssueForm from "./IssueForm";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface IIssueDetailsProps {
  issue: IIssue;
}

const IssueDetails = ({ issue }: IIssueDetailsProps) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UpdateIssueRequestType>({
    ...issue,
    labels: issue.labels.map((eachLabel) => eachLabel.id),
  });
  const updateMutation = useMutation({
    mutationFn: updateIssue,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["issue", issue.id] });
    },
  });

  function updateFormData(updates: Partial<UpdateIssueRequestType>) {
    setFormData({ ...formData, ...updates });
  }

  return (
    <Card>
      <Link href="/issues">
        <ArrowLeft />
        Issue List
      </Link>

      <CardHeader>
        <CardTitle>Issue Details</CardTitle>
      </CardHeader>

      <CardContent>
        <IssueForm formData={formData} updateFormData={updateFormData} />

        <div>
          Created at: {new Date(issue.created_on).toLocaleString()}
          <br />
          Last updated at: {new Date(issue.updated_on).toLocaleString()}
        </div>

        <Button
          onClick={() => updateMutation.mutate(formData)}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Saving..." : "Save changes"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default IssueDetails;
