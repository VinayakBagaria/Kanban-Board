import { IAssignee } from "@/types/api";
import { getInitials, getUserColor } from "@/utils/user";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface IUserDetailsProps {
  assignee: IAssignee;
}

const UserDetails = ({ assignee }: IUserDetailsProps) => (
  <Avatar className="size-6">
    <AvatarFallback
      className="text-white text-xs"
      style={{ backgroundColor: getUserColor(assignee.name) }}
    >
      {getInitials(assignee.name)}
    </AvatarFallback>
  </Avatar>
);

export default UserDetails;
