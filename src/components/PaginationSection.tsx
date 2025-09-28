import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { PaginationMeta } from "@/types/pagination";

interface PaginationServiceProps {
  meta: PaginationMeta;
  setPage: (page: number) => void;
}

const PaginationSection = ({ meta, setPage }: PaginationServiceProps) => {
  const { page, take, total } = meta;

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    const totalPage = Math.ceil(total / take);

    if (page < totalPage) {
      setPage(page + 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={handlePrev} />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink className="hover:cursor-default">{page}</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
};

export default PaginationSection;
