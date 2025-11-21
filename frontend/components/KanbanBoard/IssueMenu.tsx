import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteIssue } from "@/services/issues";

interface IIssueMenuProps {
  issueId: string;
}

const IssueMenu = ({ issueId }: IIssueMenuProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const deleteIssueMutation = useMutation({
    mutationFn: deleteIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.removeQueries({ queryKey: ["issue", issueId] });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <EllipsisVertical
          className="h-4"
          style={{ color: "oklch(44.6% 0.03 256.802)" }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent onPointerDown={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => router.push(`/issues/${issueId}`)}>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => deleteIssueMutation.mutate(issueId)}>
          <Trash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default IssueMenu;
