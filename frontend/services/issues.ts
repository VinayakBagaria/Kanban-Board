import {
  ICreateIssueRequest,
  IIssue,
  IMoveIssueRequest,
  IPaginatedDataResponse,
} from "@/types/api";
import { fetchApi } from "./api";

export function getIssues() {
  return fetchApi<IPaginatedDataResponse<IIssue>>("/issues");
}

export function getIssue(id: string) {
  return fetchApi<IIssue>(`/issues/${id}`);
}

export function createIssue(data: ICreateIssueRequest) {
  return fetchApi<IIssue>("/issues", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteIssue(id: string) {
  return fetchApi<null>(`/issues/${id}`, {
    method: "DELETE",
  });
}

export function moveIssue(data: IMoveIssueRequest) {
  const { id, ...restData } = data;
  return fetchApi<IIssue>(`/issues/${id}/move-status`, {
    method: "PATCH",
    body: JSON.stringify(restData),
  });
}
