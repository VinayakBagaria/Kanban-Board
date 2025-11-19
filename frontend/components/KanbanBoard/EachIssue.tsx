import { IIssue } from "@/types/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "../ui/card";
import { useRouter } from "next/navigation";

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      onClick={() => router.push(`/issues/${issue.id}`)}
      className={`cursor-grab gap-4 rounded-md p-3 shadow-sm ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      {/* <div {...attributes} {...listeners}> */}
      <p className="m-0 font-medium text-sm">{issue.title}</p>
      {/* </div> */}
    </Card>
  );
};

export default EachIssue;
