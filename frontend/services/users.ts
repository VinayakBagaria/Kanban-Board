import { IAssignee } from "@/types/api";
import { fetchApi } from "./api";

export function getUsers() {
  return fetchApi<Array<IAssignee>>("/users");
}
