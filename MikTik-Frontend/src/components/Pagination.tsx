import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pages, onPageChange }: PaginationProps) {
  if (pages <= 1) return null;

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);

    const nums: (number | 'ellipsis')[] = [1];
    const left = Math.max(2, page - 1);
    const right = Math.min(pages - 1, page + 1);

    if (left > 2) nums.push('ellipsis');
    for (let i = left; i <= right; i++) nums.push(i);
    if (right < pages - 1) nums.push('ellipsis');
    nums.push(pages);

    return nums;
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      </button>

      {getPageNumbers().map((num, i) =>
        num === 'ellipsis' ? (
          <span key={`e${i}`} aria-hidden="true" className="flex items-center justify-center w-8 h-8 text-sm text-slate-600 dark:text-slate-400">
            …
          </span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            aria-label={`Page ${num}`}
            aria-current={page === num ? 'page' : undefined}
            className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
              page === num
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            {num}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        aria-label="Next page"
        className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
