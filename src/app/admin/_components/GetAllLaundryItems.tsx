"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Plus, SquarePen, Trash, X } from "lucide-react";
import { useState } from "react";
import {
  useDeleteLaundryItem,
  useLaundryItems,
  useUpdateLaundryItem,
} from "../_hooks/useLaundryItems";
import CreateLaundryItemForm from "./CreateLaundryItem";
import Loading from "@/components/Loading";
import { Card, CardContent } from "@/components/ui/card";

interface ILaundryItem {
  id: string;
  name: string;
}

export default function GetAllLaundryItems() {
  const { data, isLoading } = useLaundryItems();
  const updateMutation = useUpdateLaundryItem();
  const deleteMutation = useDeleteLaundryItem();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showForm, setShowForm] = useState(false);

  if (isLoading) return <Loading />;

  const handleSave = (id: string) => {
    updateMutation.mutate(
      { id, data: { name: editValue } },
      {
        onSuccess: () => {
          setEditingId(null);
          setEditValue("");
        },
      }
    );
  };

  return (
    <Card className="p-6">
      <CardContent className="flex flex-col gap-4">
        {/* Header (Add new item) */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          {!showForm ? (
            <Button
              className="cursor-pointer w-full sm:w-auto"
              onClick={() => setShowForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add new item
            </Button>
          ) : (
            <div className="w-full max-w-sm">
              <CreateLaundryItemForm onCancel={() => setShowForm(false)} />
            </div>
          )}
        </div>

        {/* List Items */}
        <TooltipProvider>
          <div className="flex flex-col gap-2">
            {data?.map((item: ILaundryItem) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center border p-2 rounded gap-2"
              >
                {editingId === item.id ? (
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1"
                  />
                ) : (
                  <span className="break-words">{item.name}</span>
                )}

                <div className="flex gap-2 justify-end">
                  {editingId === item.id ? (
                    <>
                      <Button
                        className="cursor-pointer"
                        size="icon"
                        variant="outline"
                        onClick={() => handleSave(item.id)}
                      >
                        <Check />
                      </Button>
                      <Button
                        className="cursor-pointer"
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        <X />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="cursor-pointer"
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              setEditingId(item.id);
                              setEditValue(item.name);
                            }}
                          >
                            <SquarePen />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="cursor-pointer"
                            size="icon"
                            variant="destructive"
                            onClick={() => deleteMutation.mutate(item.id)}
                          >
                            <Trash />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
