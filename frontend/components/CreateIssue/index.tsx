import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import CreateIssueModal from "./CreateIssueModal";

const CreateIssue = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsCreateOpen(true)}>
        <Plus />
        Create Issue
      </Button>
      {isCreateOpen && <CreateIssueModal onOpenChange={setIsCreateOpen} />}
    </>
  );
};

export default CreateIssue;
