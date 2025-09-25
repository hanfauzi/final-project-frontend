// components/PageHeader.tsx
import { FC, ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: ReactNode; // misal tombol + Add New
}

const PageHeader: FC<PageHeaderProps> = ({ title, subtitle, rightElement }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {rightElement && <div className="mt-4 sm:mt-0">{rightElement}</div>}
    </div>
  );
};

export default PageHeader;
