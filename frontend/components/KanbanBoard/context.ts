import { IIssue, IssueStatusType } from "@/types/api";
import { createContext, useContext } from "react";

type KanbanContextProps = {
  issueByStatus: Record<IssueStatusType, Array<IIssue>> | null;
  isLoading: boolean;
};

export const KanbanContext = createContext<KanbanContextProps>({
  issueByStatus: null,
  isLoading: true,
});

export function useKanbanContext() {
  const data = useContext(KanbanContext);
  return data;
}
