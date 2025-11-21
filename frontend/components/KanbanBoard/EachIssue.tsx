import { IIssue } from "@/types/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { HolderOutlined } from "@ant-design/icons";

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
        <p className="text-sm w-48 font-medium leading-snug text-gray-900">
          {issue.title}
        </p>
        {issue.assignee && (
          <Avatar>
            <AvatarImage
              src={issue.assignee.avatar}
              alt={issue.assignee.name}
            />
          </Avatar>
        )}
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

      <div {...attributes} {...listeners} className="ml-auto">
        <HolderOutlined />
      </div>
    </Card>
  );
};

export default EachIssue;
