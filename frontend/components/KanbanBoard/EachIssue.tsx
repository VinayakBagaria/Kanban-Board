import { IIssue } from "@/types/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab gap-4 rounded-md p-3 shadow-sm ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      <p className="m-0 font-medium text-sm">{issue.title}</p>
    </Card>
  );
};

export default EachIssue;
