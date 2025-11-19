import { ILabel } from "@/types/api";
import { fetchApi } from "./api";

export function getLabels() {
  return fetchApi<Array<ILabel>>("/labels");
}
