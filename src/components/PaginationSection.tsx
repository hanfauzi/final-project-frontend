import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationMeta } from "@/types/pagination";

interface PaginationServiceProps {
  meta?: PaginationMeta;
  setPage: (page: number) => void;
}

const PaginationSection = ({ meta, setPage }: PaginationServiceProps) => {
  if (!meta) return null;
  
  const { page, take, total } = meta;
  const totalPages = Math.ceil(total / take);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const renderPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 2) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (page >= totalPages - 1) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }

    return pages.map((p, i) =>
      typeof p === "number" ? (
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setPage(p)}
            isActive={page === p}
            className={`cursor-pointer border-0 rounded-md size-7 flex items-center justify-center
              ${page === p 
                ? "bg-primary !text-white shadow-md hover:bg-primary/70"
                : ""}`
            }
          >
            {p}
          </PaginationLink>
        </PaginationItem>
      ) : (
        <PaginationItem key={i}>
          <span className="px-2">…</span>
        </PaginationItem>
      )
    );
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrev}
            className="cursor-pointer"
          />
        </PaginationItem>

        {renderPages()}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className="cursor-pointer"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSection;
