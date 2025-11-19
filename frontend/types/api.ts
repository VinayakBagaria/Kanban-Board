export type IssueStatus =
  | "Backlog"
  | "Todo"
  | "InProgress"
  | "Done"
  | "Canceled";
export type Priority = "Low" | "Med" | "High" | "Critical";

export interface IIssue {
  id: string;
  created_on: number;
  updated_on: number;
  title: string;
  description: string;
  status: IssueStatus;
  order_index: number;
  priority: Priority;
  assignee_id: string;
  assignee: IAssignee;
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

export interface IMoveIssueRequest {
  status: IIssue["status"];
  order_index: IIssue["order_index"];
}
