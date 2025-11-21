import { updateIssue } from "@/services/issues";
import { IIssue, UpdateIssueRequestType } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import IssueForm from "./IssueForm";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";

interface IIssueDetailsProps {
  issue: IIssue;
}

const IssueDetails = ({ issue }: IIssueDetailsProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [formData, setFormData] = useState<UpdateIssueRequestType>({
    ...issue,
    labels: issue.labels.map((eachLabel) => eachLabel.id),
  });
  const updateMutation = useMutation({
    mutationFn: updateIssue,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["issue", issue.id] });
      router.push("/issues");
    },
  });

  function updateFormData(updates: Partial<UpdateIssueRequestType>) {
    setFormData({ ...formData, ...updates });
  }

  function handleSave() {
    if (!formData.title?.trim()) return;

    updateMutation.mutate(formData);
  }

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.push("/issues")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to List
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
        </CardHeader>

        <CardContent>
          <IssueForm formData={formData} updateFormData={updateFormData} />

          <div className="my-4 border-t">
            <h3 className="text-sm font-medium my-2">Activity</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                Created at: {new Date(issue.created_on).toLocaleString()}
                <br />
                Last updated at: {new Date(issue.updated_on).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/issues")}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IssueDetails;
