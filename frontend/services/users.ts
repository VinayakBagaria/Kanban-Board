import { IAssignee, IPaginatedDataResponse } from "@/types/api";
import { fetchApi } from "./api";

export function getUsers() {
  return fetchApi<IPaginatedDataResponse<IAssignee>>("/users");
}
