import {
  ICreateIssueRequest,
  IIssue,
  IIssueListRequest,
  IMoveIssueRequest,
  IPaginatedDataResponse,
  UpdateIssueRequestType,
} from "@/types/api";
import { fetchApi } from "./api";

export function getIssues(params?: IIssueListRequest) {
  const searchParams = new URLSearchParams();

  if (params?.assignee) {
    searchParams.set("assignee", params.assignee);
  }
  if (params?.labels && params?.labels.length > 0) {
    params.labels.forEach((eachLabel) =>
      searchParams.append("labels[]", eachLabel)
    );
  }
  if (params?.priority && params?.priority.length > 0) {
    params.priority.forEach((eachPriority) =>
      searchParams.append("priority[]", eachPriority)
    );
  }
  if (params?.status && params?.status.length > 0) {
    params.status.forEach((eachStatus) =>
      searchParams.append("status[]", eachStatus)
    );
  }

  const queryString = searchParams.toString();
  return fetchApi<IPaginatedDataResponse<IIssue>>(
    queryString ? `/issues?${queryString}` : "/issues"
  );
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

export function updateIssue(data: UpdateIssueRequestType) {
  return fetchApi<IIssue>(`/issues/${data.id}`, {
    method: "PUT",
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
  return fetchApi<IIssue>(`/issues/${id}/move`, {
    method: "PATCH",
    body: JSON.stringify(restData),
  });
}
