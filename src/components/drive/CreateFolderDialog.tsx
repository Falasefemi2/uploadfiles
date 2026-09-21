import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";

export function CreateFolderDialog({
  open,
  onOpenChange,
  onCreate,
  isPending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (name: string) => void;
  isPending: boolean;
}) {
  const [name, setName] = React.useState("");
  React.useEffect(() => {
    if (!open) setName("");
  }, [open]);

  const submit = () => {
    const trimmed = name.trim();
    if (trimmed) onCreate(trimmed);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] gap-6">
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
          <DialogDescription>Names must be unique per parent. You can nest folders infinitely.</DialogDescription>
        </DialogHeader>

        <Field>
          <Label htmlFor="folder-name" className="tracking-widest">Folder name</Label>
          <Input
            id="folder-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) submit();
            }}
            placeholder="Invoices 2026"
          />
        </Field>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!name.trim() || isPending}>
            {isPending ? "Creating…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
