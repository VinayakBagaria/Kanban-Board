import { IIssue, IssueStatusType } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import EachIssue from "./EachIssue";
import { useKanbanContext } from "./context";
import { useDroppable } from "@dnd-kit/core";

interface IKanbanColumnProps {
  id: IssueStatusType;
  title: string;
}

const KanbanColumn = ({ id, title }: IKanbanColumnProps) => {
  const { setNodeRef } = useDroppable({
    id,
  });
  const issues = useKanbanContext().issueByStatus?.[id] ?? [];
  const issueIds = issues.map((eachIssue) => eachIssue.id);

  return (
    <Card ref={setNodeRef}>
      <CardHeader>
        <CardTitle>
          {title} - {issues.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-2">
        {issues.length === 0 ? (
          <h1>No issues</h1>
        ) : (
          <SortableContext
            items={issueIds}
            strategy={verticalListSortingStrategy}
          >
            {issues.map((eachIssue) => (
              <EachIssue key={eachIssue.id} issue={eachIssue} />
            ))}
          </SortableContext>
        )}
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
