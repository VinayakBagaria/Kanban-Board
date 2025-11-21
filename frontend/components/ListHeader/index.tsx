import { ProjectFilled } from "@ant-design/icons";
import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Button } from "../ui/button";

const CreateIssueModal = dynamic(() => import("./CreateIssueModal"));

interface IListHeaderProps {
  isCreateOpen: boolean;
  setIsCreateOpen(newValue: boolean): void;
}

const ListHeader = ({ isCreateOpen, setIsCreateOpen }: IListHeaderProps) => (
  <>
    <header className="px-6 flex items-center justify-between py-2 border-b-2 border-gray-200">
      <div className="flex gap-2 items-center">
        <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
          All Issues
        </h2>
        <ProjectFilled style={{ fontSize: "32px" }} />
      </div>
      <Button onClick={() => setIsCreateOpen(true)}>
        <Plus />
        Create Issue
      </Button>
    </header>

    {isCreateOpen && (
      <Suspense>
        <CreateIssueModal onOpenChange={setIsCreateOpen} />
      </Suspense>
    )}
  </>
);

export default ListHeader;
