"use client";

import { FC } from "react";
import OutletDetail from "../../_components/OutletDetail";
import { useParams } from "next/navigation";

interface OutletPageProps {
  params: {
    id: string;
  };
}

const OutletPage: FC<OutletPageProps> = () => {
    const params = useParams()
    const id = params?.id as string

    console.log("ID >>>", id)

  return (
    <div className="p-4">
      <OutletDetail id={id} />
    </div>
  );
};

export default OutletPage;
