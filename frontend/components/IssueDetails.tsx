import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowLeft } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "@/services/users";
import { getLabels } from "@/services/labels";
import { useState } from "react";
import { IIssue, PriorityType, UpdateIssueRequestType } from "@/types/api";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ISSUE_PRIORITY, ISSUE_STATUS } from "./constants";
import { Button } from "./ui/button";
import { updateIssue } from "@/services/issues";

interface IIssueDetailsProps {
  issue: IIssue;
}

const IssueDetails = ({ issue }: IIssueDetailsProps) => {
  const queryClient = useQueryClient();
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const { data: labels = [] } = useQuery({
    queryKey: ["labels"],
    queryFn: getLabels,
  });
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
        <div>
          <Label>Title</Label>
          <Input
            value={formData.title || ""}
            onChange={(e) => updateFormData({ title: e.target.value })}
          />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description || ""}
            onChange={(e) => updateFormData({ description: e.target.value })}
          />
        </div>

        <div>
          <Label>Status</Label>
          <Select
            value={formData.status || ""}
            onValueChange={(newValue) => updateFormData({ status: newValue })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {ISSUE_STATUS.map((eachStatus) => (
                <SelectItem key={eachStatus.id} value={eachStatus.id}>
                  {eachStatus.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Priority</Label>
          <Select
            value={formData.priority || ""}
            onValueChange={(newValue) =>
              updateFormData({ priority: newValue as PriorityType })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {ISSUE_PRIORITY.map((eachPriority) => (
                <SelectItem key={eachPriority.id} value={eachPriority.id}>
                  {eachPriority.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Assignee</Label>
          <Select
            value={formData.assignee_id || ""}
            onValueChange={(newValue) =>
              updateFormData({ assignee_id: newValue })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              {users.map((eachUser) => (
                <SelectItem key={eachUser.id} value={eachUser.id}>
                  {eachUser.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Labels</Label>
          <div className="flex flex-wrap gap-2">
            {labels.map((eachLabel) => (
              <Button
                key={eachLabel.id}
                variant="outline"
                onClick={() => {
                  const currentLabels = formData.labels ?? [];
                  const newLabels = currentLabels.includes(eachLabel.id)
                    ? currentLabels.filter((eachId) => eachLabel.id !== eachId)
                    : [...currentLabels, eachLabel.id];
                  updateFormData({ labels: newLabels });
                }}
                style={{
                  borderColor: formData.labels?.includes(eachLabel.id)
                    ? undefined
                    : eachLabel.color,
                }}
              >
                {eachLabel.name}
              </Button>
            ))}
          </div>

          <div>
            Created at: {new Date(issue.created_on).toLocaleString()}
            <br />
            Last updated at: {new Date(issue.updated_on).toLocaleString()}
          </div>
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
