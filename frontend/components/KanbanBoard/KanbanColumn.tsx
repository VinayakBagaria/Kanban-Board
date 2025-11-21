import { IIssue, IssueStatusType } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import EachIssue from "./EachIssue";
import { useKanbanContext } from "./context";
import { useDroppable } from "@dnd-kit/core";
import { Badge } from "../ui/badge";

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
    <div className="p-3 flex-1 bg-gray-100 rounded-lg" ref={setNodeRef}>
      <CardHeader className="px-0 flex">
        <CardTitle className="text-sm font-medium text-gray-900">
          {title}
        </CardTitle>
        <Badge
          variant="default"
          className="bg-white text-gray-900 border-gray-900"
        >
          {issueIds.length}
        </Badge>
      </CardHeader>
      <CardContent className="mt-4 flex-1 overflow-y-auto space-y-2 px-0">
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
    </div>
  );
};

export default KanbanColumn;
