import { IIssue } from "@/types/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

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
  const router = useRouter();

  return (
    <Card
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      onClick={() => router.push(`/issues/${issue.id}`)}
      className={`cursor-grab gap-4 rounded-md p-3 shadow-sm ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      <div className="flex justify-between gap-2">
        <p className="m-0 font-medium text-sm">{issue.title}</p>
        <div {...attributes} {...listeners}>
          <GripVertical />
        </div>
      </div>

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

      <Badge>{issue.priority}</Badge>

      {issue.assignee && (
        <>
          <Avatar>
            <AvatarImage
              src={issue.assignee.avatar}
              alt={issue.assignee.name}
            />{" "}
          </Avatar>
          {issue.assignee.name}
        </>
      )}
    </Card>
  );
};

export default EachIssue;
