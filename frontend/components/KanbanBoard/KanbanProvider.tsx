import { moveIssue } from "@/services/issues";
import { IIssue, IssueStatusType } from "@/types/api";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ISSUE_STATUS } from "../constants";
import EachIssue from "./EachIssue";
import KanbanColumn from "./KanbanColumn";
import { KanbanContext } from "./context";
import { Card } from "../ui/card";

interface IKanbanProviderProps {
  issues: Array<IIssue>;
}

const KanbanProvider = ({ issues }: IKanbanProviderProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [issueList, setIssueList] = useState(issues);
  const moveMutation = useMutation({
    mutationFn: moveIssue,
  });

  useEffect(() => {
    setIssueList(issues);
  }, [issues]);

  const issueByStatus = ISSUE_STATUS.reduce(
    (acc, status) => ({
      ...acc,
      [status.id]: issueList.filter(
        (eachIssue) => eachIssue.status === status.id
      ),
    }),
    {} as Record<IssueStatusType, Array<IIssue>>
  );
  const activeIssue = issueList.find((eachIssue) => eachIssue.id == activeId);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    console.log({ active, over });
    if (!over) {
      return;
    }

    const activeIssue = issueList.find(
      (eachIssue) => eachIssue.id == active.id
    );
    if (!activeIssue) {
      return;
    }

    // If dropped on a column
    if (ISSUE_STATUS.find((eachStatus) => eachStatus.id == over.id)) {
      const newStatusId = over.id as IssueStatusType;
      const newIndex = issueByStatus[newStatusId].length;
      const updatedIssues = issueList
        .map((eachIssue) => {
          if (eachIssue.id === activeIssue.id) {
            return {
              ...eachIssue,
              status: newStatusId,
              order_index: newIndex,
            };
          }
          return eachIssue;
        })
        .sort((a, b) => a.order_index - b.order_index);

      setIssueList(updatedIssues);
      moveMutation.mutate({
        id: activeIssue.id,
        status: newStatusId,
        order_index: newIndex,
      });
      return;
    }

    // If dropped on another issue
    const overIssue = issueList.find((eachIssue) => eachIssue.id == over.id);
    if (!overIssue) {
      return;
    }

    const oldIndex = issueList.findIndex(
      (eachIssue) => eachIssue.id == active.id
    );
    const newIndex = issueList.findIndex(
      (eachIssue) => eachIssue.id == over.id
    );
    if (oldIndex == -1 || newIndex == -1) {
      return;
    }

    const reordered = arrayMove(issueList, oldIndex, newIndex);
    const updatedIssues = reordered.map((eachIssue) => {
      const myStatusIssues = reordered.filter(
        (eachItem) => eachItem.status === eachIssue.status
      );
      const myIndex = myStatusIssues.findIndex(
        (eachItem) => eachItem.id === eachIssue.id
      );
      return {
        ...eachIssue,
        status:
          eachIssue.id === activeIssue.id ? overIssue.status : eachIssue.status,
        order_index: myIndex,
      };
    });
    setIssueList(updatedIssues);

    const activeIssueUpdated = updatedIssues.find(
      (eachIssue) => eachIssue.id === activeIssue.id
    );
    if (activeIssueUpdated) {
      moveMutation.mutate({
        id: activeIssue.id,
        status: overIssue.status,
        order_index: activeIssueUpdated.order_index,
      });
    }
  }

  return (
    <KanbanContext.Provider
      value={{
        issueByStatus,
        activeCard: activeId,
      }}
    >
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-row gap-2 p-3">
          {ISSUE_STATUS.map((eachStatus) => (
            <KanbanColumn
              key={eachStatus.id}
              id={eachStatus.id}
              title={eachStatus.name}
            />
          ))}
        </div>
        <DragOverlay>
          {activeIssue && <EachIssue issue={activeIssue} />}
        </DragOverlay>
      </DndContext>
    </KanbanContext.Provider>
  );
};

export default KanbanProvider;
