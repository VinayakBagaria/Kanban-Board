import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { ReactNode } from "react";

interface ITooltipDataProps {
  children: ReactNode;
  hover: ReactNode;
}

const TooltipData = ({ children, hover }: ITooltipDataProps) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent>{hover}</TooltipContent>
  </Tooltip>
);

export default TooltipData;
