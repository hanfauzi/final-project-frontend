"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { WorkerTask } from "@/types/workerTasks";
import { Check, X, Eye } from "lucide-react";
import { useState } from "react";
import {
  useAcceptBypassRequest,
  useBypassRequest,
  useRejectBypassRequest,
} from "../_hooks/useBypassRequest";
import LaundryItemsTable from "@/components/LaundryItemsTable";

export default function BypassRequestsPage() {
  const { data: tasks = [], isLoading, isError } = useBypassRequest();
  const acceptMutation = useAcceptBypassRequest();
  const rejectMutation = useRejectBypassRequest();

  const [selectedTaskReject, setSelectedTaskReject] =
    useState<WorkerTask | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reviewNote, setReviewNote] = useState("");

  const [selectedTaskAccept, setSelectedTaskAccept] =
    useState<WorkerTask | null>(null);
  const [showAccept, setShowAccept] = useState(false);

  const [selectedTaskItems, setSelectedTaskItems] =
    useState<WorkerTask | null>(null);
  const [showItems, setShowItems] = useState(false);

  function openReject(task: WorkerTask) {
    setSelectedTaskReject(task);
    setReviewNote("");
    setShowReject(true);
  }

  function handleReject(taskId: string, note: string) {
    rejectMutation.mutate({ taskId, adminId: "ADMIN_ID", note });
    setShowReject(false);
  }

  function openAcceptModal(task: WorkerTask) {
    setSelectedTaskAccept(task);
    setShowAccept(true);
  }

  function openItemsModal(task: WorkerTask) {
    setSelectedTaskItems(task);
    setShowItems(true);
  }

  if (isLoading) return <p className="p-6">Loading bypass requests...</p>;
  if (isError)
    return <p className="p-6 text-red-500">Error loading bypass requests</p>;

  return (
    <div className="p-2 space-y-2">
      <Card>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="p-3">Station</th>
                  <th className="p-3">Invoice</th>
                  <th className="p-3">Worker</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Requested</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-6 text-center text-sm text-muted-foreground"
                    >
                      No bypass requests match the filters.
                    </td>
                  </tr>
                )}
                {tasks.map((t) => (
                  <tr key={t.id} className="border-t hover:bg-muted/50">
                    <td className="p-3 align-top">{t.station}</td>
                    <td className="p-3 align-top">
                      <div className="font-semibold">
                        {t.orderHeader?.invoiceNo}
                      </div>
                      <div className="text-sm">{t.orderItem?.name}</div>
                    </td>
                    <td className="p-3 align-top">{t.employee?.name}</td>
                   
                    <td
                      className="p-3 align-top truncate max-w-xs"
                      title={t.bypassReqNote ?? ""}
                    >
                      {t.bypassReqNote}
                    </td>
                    <td className="p-3 align-top text-sm">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 align-top">
                      <Badge
                        variant={
                          t.status === "PENDING" ? "outline" : "secondary"
                        }
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td className="p-3 align-top">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          title="View Items"
                          onClick={() => openItemsModal(t)}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button size="sm" onClick={() => openAcceptModal(t)}>
                          <Check size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openReject(t)}
                        >
                          <X size={14} />
                        </Button>
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Accept Modal */}
      <Dialog open={showAccept} onOpenChange={setShowAccept}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Accept</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p>Are you sure you want to accept this bypass request?</p>
            <Textarea
              placeholder="Please make sure before submitting notes for next station..."
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setShowAccept(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!selectedTaskAccept) return;
                acceptMutation.mutate({
                  taskId: selectedTaskAccept.id,
                  adminId: "ADMIN_ID",
                  note: reviewNote,
                });
                setShowAccept(false);
                setReviewNote("");
              }}
            >
              Accept
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Bypass Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Note for rejection..."
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowReject(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  selectedTaskReject &&
                  handleReject(selectedTaskReject.id, reviewNote)
                }
              >
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Laundry Items Modal */}
      <Dialog open={showItems} onOpenChange={setShowItems}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {" "}
              {selectedTaskItems?.orderHeader?.invoiceNo || "No invoice"}
            </DialogTitle>
          </DialogHeader>

          {selectedTaskItems?.orderHeader?.OrderItem?.length ? (
            <LaundryItemsTable
              orderItems={selectedTaskItems.orderHeader.OrderItem}
            />
          ) : (
            <p>No laundry items found.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
