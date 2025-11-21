import { createIssue } from "@/services/issues";
import { ICreateIssueRequest } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import IssueForm from "../IssueForm";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface ICreateIssueModalProps {
  onOpenChange(value: boolean): void;
}

const CreateIssueModal = ({ onOpenChange }: ICreateIssueModalProps) => {
  const [formData, setFormData] = useState<ICreateIssueRequest>({
    title: "",
    description: "",
    status: "backlog",
    priority: "medium",
    assignee_id: null,
    labels: [],
  });
  const queryClient = useQueryClient();
  const router = useRouter();
  const createMutation = useMutation({
    mutationFn: createIssue,
    onSuccess: (newIssue) => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      onOpenChange(false);
      router.push(`/issues/${newIssue.id}`);
    },
  });

  function updateFormData(updates: Partial<ICreateIssueRequest>) {
    setFormData({ ...formData, ...updates });
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
          <DialogDescription>
            Create a new issue to track work items.
          </DialogDescription>
        </DialogHeader>

        <IssueForm formData={formData} updateFormData={updateFormData} />

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => createMutation.mutate(formData)}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create issue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssueModal;
