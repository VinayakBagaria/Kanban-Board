import { IssuePriorityType } from "@/types/api";
import {
  DownOutlined,
  LineOutlined,
  UpOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { ChevronDown, ChevronUp, CircleAlert, Minus } from "lucide-react";

interface IPriorityIconProps {
  id: IssuePriorityType;
}

const PriorityIcon = ({ id }: IPriorityIconProps) => {
  if (id === "low") {
    return <ChevronDown size={20} className="text-blue-500" />;
  }

  if (id === "medium") {
    return (
      <div className="flex flex-col">
        <Minus size={20} className="text-red-500" />
        <Minus size={20} className="mt-[-12] text-red-500" />
      </div>
    );
  }

  if (id === "high") {
    return <ChevronUp size={20} className="text-red-600" />;
  }

  if (id === "critical") {
    return <CircleAlert size={20} className="text-red-600" />;
  }

  return null;
};

export default PriorityIcon;
