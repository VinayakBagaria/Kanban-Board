import { IIssue } from "@/types/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PriorityIcon from "../PriorityIcon";
import UserAvatar from "../UserDetails";
import { ISSUE_PRIORITY } from "../constants";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import IssueMenu from "./IssueMenu";

interface IEachIssueProps {
  issue: IIssue;
}

const EachIssue = ({ issue }: IEachIssueProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id });

  return (
    <Card
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`cursor-grab gap-4 rounded-md p-3 shadow-sm ${
        isDragging ? "opacity-30" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      <p className="text-sm w-48 font-medium leading-snug text-gray-900">
        {issue.title}
      </p>

      {issue.labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {issue.labels.map((eachLabel) => (
            <Badge
              key={eachLabel.id}
              variant="outline"
              style={{
                borderColor: eachLabel.color,
                color: eachLabel.color,
              }}
            >
              {eachLabel.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <p className="text-xs text-gray-600">
            {
              ISSUE_PRIORITY.find(
                (eachPriority) => eachPriority.id === issue.priority
              )?.name
            }
          </p>
          <PriorityIcon id={issue.priority} />
        </div>
        <div className="flex justify-between items-center gap-1">
          {issue.assignee && <UserAvatar assignee={issue.assignee} />}
          <IssueMenu issueId={issue.id} />
        </div>
      </div>
    </Card>
  );
};

export default EachIssue;
