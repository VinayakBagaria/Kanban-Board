import { IssueStatusType, PriorityType } from "@/types/api";

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

export const ISSUE_PRIORITY: Array<{ id: PriorityType; name: string }> = [
  {
    id: "low",
    name: "Low",
  },
  {
    id: "medium",
    name: "Medium",
  },
  {
    id: "high",
    name: "High",
  },
  {
    id: "critical",
    name: "Critical",
  },
];
