"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import {
  useAcceptBypassRequest,
  useBypassRequest,
  useRejectBypassRequest,
} from "../_hooks/useBypassRequest";
import { Station, WorkerTask } from "@/types/workerTasks";

export default function BypassRequestsPage() {
  const { data: tasks = [], isLoading, isError } = useBypassRequest();
  const acceptMutation = useAcceptBypassRequest();
  const rejectMutation = useRejectBypassRequest();
  
  console.log("Bypass Requests:>>>>>>", tasks);
  const [query] = useState("");

  // modal states
  const [selectedTask, setSelectedTask] = useState<WorkerTask | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  

  function handleAccept(taskId: string) {
    acceptMutation.mutate({ taskId, adminId: "ADMIN_ID" });
    setShowDetail(false);
  }

  function openReject(t: WorkerTask) {
    setSelectedTask(t);
    setRejectNote("");
    setShowReject(true);
  }

  function handleReject(taskId: string, note: string) {
    rejectMutation.mutate({ taskId, adminId: "ADMIN_ID", note });
    setShowReject(false);
    setShowDetail(false);
  }

  if (isLoading) return <p className="p-6">Loading bypass requests...</p>;
  if (isError)
    return <p className="p-6 text-red-500">Error loading bypass requests</p>;

  return (
    <div className="p- space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="p-3">Station</th>
                  <th className="p-3">Invoice</th>
                  <th className="p-3">Worker</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Requested</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
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
                    <td className="p-3 align-top">
                      <div className="font-medium">{t.station}</div>
                    </td>
                    <td className="p-3 align-top">
                      <div className="font-semibold">{t.orderHeader?.invoiceNo}</div>
                      <div className="text-sm">{t.orderItem?.name}</div>
                    </td>
                    <td className="p-3 align-top">{t.employee?.name}</td>
                    <td className="p-3 align-top">
                      {t.itemQty ?? "-"} {t.itemUnit ?? ""}
                    </td>
                    <td className="p-3 align-top truncate max-w-xs" title={t.bypassReqNote ?? ""}>
                      {t.bypassReqNote}
                    </td>
                    <td className="p-3 align-top text-sm">
                      {new Date(t.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 align-top">
                      <Badge variant={t.status === "PENDING" ? "outline" : "secondary"}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="p-3 align-top">
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAccept(t.id)}>
                          <Check size={14} />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => openReject(t)}>
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

      {/* Detail Modal */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="w-[700px]">
          <DialogHeader>
            <DialogTitle>Bypass Detail</DialogTitle>
          </DialogHeader>
          {selectedTask ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Worker</p>
                  <p className="font-medium">
                    {selectedTask.employee?.name} — {selectedTask.workStation?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Requested</p>
                  <p className="font-medium">
                    {new Date(selectedTask.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Order</p>
                <p className="font-medium">{selectedTask.orderHeader?.invoiceNo}</p>
                <p className="font-medium">{selectedTask.orderItem?.name}</p>
                <p className="font-medium">
                  {selectedTask.itemQty} {selectedTask.itemUnit}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Bypass note</p>
                <p className="mt-1">{selectedTask.bypassReqNote}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleAccept(selectedTask.id)}>Accept</Button>
                <Button variant="destructive" onClick={() => openReject(selectedTask)}>
                  Reject
                </Button>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Admin note / history</p>
                <div className="mt-2 bg-slate-50 p-3 rounded text-sm text-muted-foreground">
                  {selectedTask.itemPassedNote ?? "—"}
                </div>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
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
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Alasan reject..."
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowReject(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  selectedTask && handleReject(selectedTask.id, rejectNote)
                }
              >
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
