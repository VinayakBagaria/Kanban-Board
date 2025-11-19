import { IssueStatusType } from "@/types/api";

export const ISSUE_STATUS: Array<{ id: IssueStatusType; name: string }> = [
  {
    id: "backlog",
    name: "Backlog",
  },
  {
    id: "todo",
    name: "To-do",
  },
  {
    id: "in_progress",
    name: "In Progress",
  },
  {
    id: "cancelled",
    name: "Cancelled",
  },
  {
    id: "done",
    name: "Done",
  },
];
