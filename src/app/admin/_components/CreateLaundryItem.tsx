"use client";

import { FC, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateLaundryItem } from "@/app/admin/_hooks/useLaundryItems";
import Loading from "@/components/Loading";

interface CreateLaundryItemFormProps {
  onCancel: () => void;
}

const CreateLaundryItemForm: FC<CreateLaundryItemFormProps> = ({ onCancel }) => {
  const [name, setName] = useState("");
  const { mutate, isPending } = useCreateLaundryItem();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    mutate(
      { name },
      {
        onSuccess: () => {
          setName("");
          onCancel(); // tutup form setelah sukses create
        },
      }
    );
  };

  return (
    <Card className="max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Create Laundry Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            placeholder="Enter item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
          <div className="flex gap-2 justify-end">
            <Button className="cursor-pointer" type="submit" disabled={isPending}>
              {isPending ? <Loading /> : "Add"}
            </Button>
            <Button className="cursor-pointer" type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateLaundryItemForm;
