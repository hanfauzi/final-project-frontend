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
  children?: ReactNode;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  title = "Confirm Action",
  description = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isPending = false,
  trigger,
  children,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button className="cursor-pointer" type="button" disabled={isPending}>
            {isPending ? <Loading /> : "Open"}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children && <div className="mt-4">{children}</div>}
        <div className="flex justify-end gap-2 mt-4">
          <AlertDialogCancel className="cursor-pointer" disabled={isPending}>
            {cancelText}
          </AlertDialogCancel>
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
