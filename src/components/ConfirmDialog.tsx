"use client";

import { FC, ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";

interface ConfirmDialogProps {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isPending?: boolean;
  trigger?: ReactNode; 
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  title = "Confirm Action",
  description = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isPending = false,
  trigger,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button type="button" disabled={isPending}>
            {isPending ? <Loading /> : "Open"}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <AlertDialogCancel disabled={isPending}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? <Loading /> : confirmText}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
