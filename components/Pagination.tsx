import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
        // Show first page
        pages.push(1);

        // Show ellipsis or pages near current
        if (currentPage > 3) {
            pages.push('...');
        }

        // Show pages around current
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }

        // Show ellipsis or pages near end
        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        // Show last page
        pages.push(totalPages);
    } else {
        // Show all pages
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            {/* Previous button */}
            {currentPage > 1 ? (
                <Link
                    href={`${baseUrl}?page=${currentPage - 1}`}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    Previous
                </Link>
            ) : (
                <span className="px-4 py-2 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed">
                    Previous
                </span>
            )}

            {/* Page numbers */}
            {pages.map((page, index) => {
                if (page === '...') {
                    return (
                        <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
                            ...
                        </span>
                    );
                }

                const pageNum = page as number;
                const isActive = pageNum === currentPage;

                return (
                    <Link
                        key={pageNum}
                        href={`${baseUrl}?page=${pageNum}`}
                        className={`px-4 py-2 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-600 text-white font-semibold'
                                : 'border border-slate-300 hover:bg-slate-50'
                            }`}
                    >
                        {pageNum}
                    </Link>
                );
            })}

            {/* Next button */}
            {currentPage < totalPages ? (
                <Link
                    href={`${baseUrl}?page=${currentPage + 1}`}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    Next
                </Link>
            ) : (
                <span className="px-4 py-2 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed">
                    Next
                </span>
            )}
        </div>
    );
}
