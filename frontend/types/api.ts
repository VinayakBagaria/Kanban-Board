export type IssueStatusType =
  | "backlog"
  | "todo"
  | "in_progress"
  | "done"
  | "cancelled";

export type PriorityType = "low" | "medium" | "high" | "critical";

export interface IIssue {
  id: string;
  created_on: number;
  updated_on: number;
  title: string;
  description: string;
  status: IssueStatusType;
  order_index: number;
  priority: PriorityType;
  assignee_id: string | null;
  assignee: IAssignee | null;
  labels: Array<ILabel>;
}

export interface IAssignee {
  id: string;
  name: string;
  avatar: string;
}

export interface ILabel {
  id: string;
  name: string;
  color: string;
}

export interface IPaginatedDataResponse<T> {
  data: Array<T>;
  total: number;
}

export interface ICreateIssueRequest {
  title: IIssue["title"];
  description: IIssue["description"];
  status: IIssue["status"];
  priority: IIssue["priority"];
  assignee_id: IIssue["assignee_id"];
  labels: Array<ILabel["id"]>;
}

export type UpdateIssueRequestType = {
  id: string;
} & Partial<ICreateIssueRequest>;

export interface IMoveIssueRequest {
  id: string;
  status: IIssue["status"];
  order_index: IIssue["order_index"];
}
