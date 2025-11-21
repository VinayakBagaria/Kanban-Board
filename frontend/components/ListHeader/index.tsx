import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import CreateIssueModal from "./CreateIssueModal";
import { ProjectFilled } from "@ant-design/icons";

const ListHeader = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
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
      {isCreateOpen && <CreateIssueModal onOpenChange={setIsCreateOpen} />}
    </>
  );
};

export default ListHeader;
