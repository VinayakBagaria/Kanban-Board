import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ISSUE_PRIORITY } from "../constants";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

const CRITICAL_PRIORITY = ISSUE_PRIORITY[ISSUE_PRIORITY.length - 1];

interface ICommandCenterProps {
  handleCreate(): void;
}

const CommandCenter = ({ handleCreate }: ICommandCenterProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) {
    return null;
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              handleCreate();
            }}
          >
            Create Issue
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setOpen(false);
              router.push(`/issues?priority=${CRITICAL_PRIORITY.id}`);
            }}
          >
            Search "{CRITICAL_PRIORITY.name}" priority items
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setOpen(false);
              router.push("/issues");
            }}
          >
            Clear Filters
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandCenter;
