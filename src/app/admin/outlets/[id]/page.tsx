"use client";

import { useParams } from "next/navigation";
import OutletDetail from "../../_components/OutletDetail";

const OutletPage = () => {
    const params = useParams()
    const id = params?.id as string

  return (
    <div className="p-4">
      <OutletDetail id={id} />
    </div>
  );
};

export default OutletPage;
