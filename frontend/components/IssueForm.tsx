import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/users";
import { getLabels } from "@/services/labels";
import {
  ICreateIssueRequest,
  IssueStatusType,
  IssuePriorityType,
} from "@/types/api";

interface IIssueFormProps {
  formData: Partial<ICreateIssueRequest>;
  updateFormData(updates: Partial<ICreateIssueRequest>): void;
}

const IssueForm = ({ formData, updateFormData }: IIssueFormProps) => {
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const { data: labels = [] } = useQuery({
    queryKey: ["labels"],
    queryFn: getLabels,
  });

  return (
    <>
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
          onValueChange={(newValue) =>
            updateFormData({ status: newValue as IssueStatusType })
          }
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
            updateFormData({ priority: newValue as IssuePriorityType })
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
      </div>
    </>
  );
};

export default IssueForm;
