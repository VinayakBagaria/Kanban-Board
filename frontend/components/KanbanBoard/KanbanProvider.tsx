import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { ReactNode, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { ISSUE_STATUS } from "./constants";
import { KanbanContext } from "./context";
import { IIssue, IssueStatusType } from "@/types/api";

interface IKanbanProviderProps {
  issues: Array<IIssue>;
}

const KanbanProvider = ({ issues }: IKanbanProviderProps) => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const issueByStatus = ISSUE_STATUS.reduce(
    (acc, status) => ({
      ...acc,
      [status.id]: issues.filter((eachIssue) => eachIssue.status === status.id),
    }),
    {} as Record<IssueStatusType, Array<IIssue>>
  );

  function handleDragStart(event: DragStartEvent) {}

  function handleDragOver(event: DragOverEvent) {}

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    console.log(event);
  }

  return (
    <KanbanContext.Provider
      value={{
        issueByStatus,
        activeCard,
      }}
    >
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-5 gap-4 h-full">
          {ISSUE_STATUS.map((eachStatus) => (
            <KanbanColumn
              key={eachStatus.id}
              id={eachStatus.id}
              title={eachStatus.name}
            />
          ))}
        </div>
      </DndContext>
    </KanbanContext.Provider>
  );
};

export default KanbanProvider;
