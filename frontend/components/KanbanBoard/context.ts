import { IIssue, IssueStatusType } from "@/types/api";
import { createContext, useContext } from "react";

type KanbanContextProps = {
  issueByStatus: Record<IssueStatusType, Array<IIssue>> | null;
  activeCard: string | null;
};

export const KanbanContext = createContext<KanbanContextProps>({
  issueByStatus: null,
  activeCard: null,
});

export function useKanbanContext() {
  const data = useContext(KanbanContext);
  return data;
}
