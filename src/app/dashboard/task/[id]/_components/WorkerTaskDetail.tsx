"use client";

import { useParams } from "next/navigation";

export default function WorkerTaskDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-4 pb-14">
      <div className="bg-white border-1 rounded-md p-3">
        <div>No Data Provided Yet</div>
        <div>This Component Not Yet Implemented</div>
      </div>
    </div>
  );
}
