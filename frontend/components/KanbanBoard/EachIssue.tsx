import { IIssue } from "@/types/api";
import {
  HolderOutlined,
  LineChartOutlined,
  LineOutlined,
} from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { getInitials, getUserColor } from "@/utils/user";
import UserDetails from "../UserDetails";
import PriorityIcon from "../PriorityIcon";

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
        <PriorityIcon id={issue.priority} />
        <div className="flex justify-between gap-2">
          <div {...attributes} {...listeners} className="ml-auto">
            <HolderOutlined />
          </div>
          {issue.assignee && <UserDetails assignee={issue.assignee} />}
        </div>
      </div>
    </Card>
  );
};

export default EachIssue;
