"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface DeleteProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  projectTitle: string;
}

export function DeleteProjectDialog({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
}: DeleteProjectDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Project"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg bg-rose-50 border border-rose-200 p-3 text-rose-800 text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Are you absolutely sure?</p>
            <p className="text-xs text-rose-700 mt-1">
              Deleting <span className="font-bold">"{projectTitle}"</span> is permanent and will automatically remove all associated tasks and activity records.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={isDeleting}>
            Delete Project
          </Button>
        </div>
      </div>
    </Modal>
  );
}
