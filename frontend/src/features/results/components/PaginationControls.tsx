interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
    maxVisiblePages?: number;
}

const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
    maxVisiblePages = 5,
}: PaginationControlsProps) => {
    if (totalPages <= 1) {
        return null; // 1ページ以下の場合はページネーションコントロールを表示しない
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
        onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
        }
    };

  // 表示するページ番号の配列を計算するロジック
    const getPageNumbers = (): (number | string)[] => {
        const pageNumbers: (number | string)[] = [];
        if (totalPages <= maxVisiblePages) {
        // 全ページ番号を表示
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
        } else {
        const halfVisible = Math.floor((maxVisiblePages - 2) / 2);
        let firstPage = 1;
        let lastPage = totalPages;
        let startPage = Math.max(2, currentPage - halfVisible);
        let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

        pageNumbers.push(firstPage);

        if (startPage > 2) {
            pageNumbers.push('...');
        }

        // startPageとendPageの調整 (表示されるページ番号がmaxVisiblePages - 2個を超えないように)
        if (currentPage - startPage < halfVisible && endPage - firstPage < maxVisiblePages -2) {
            endPage = Math.min(totalPages -1, firstPage + (maxVisiblePages -3) );
        }
        if (endPage - currentPage < halfVisible && lastPage - startPage < maxVisiblePages -2) {
            startPage = Math.max(2, lastPage - (maxVisiblePages -3));
        }


        for (let i = startPage; i <= endPage; i++) {
            if(i > firstPage && i < lastPage) { 
                pageNumbers.push(i);
            }
        }

        if (endPage < totalPages - 1) {
            pageNumbers.push('...'); 
        }
        pageNumbers.push(lastPage);
        }
        return pageNumbers;
    };

    const pageNumbersToDisplay = getPageNumbers();

    const buttonBaseClass = "px-3 py-1.5 rounded-md text-sm font-medium transition-colors border";
    const disabledButtonClass = "bg-gray-200 text-gray-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed border-gray-300 dark:border-slate-600";
    const activeButtonClass = "bg-light-accent text-white dark:bg-dark-accent dark:text-dark-bg border-light-accent dark:border-dark-accent cursor-default";
    const normalButtonClass = "bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border-gray-300 dark:border-slate-600";
    const ellipsisClass = "px-3 py-1.5 text-gray-500 dark:text-slate-400";


    return (
        <nav aria-label="Page navigation" className="flex justify-center items-center space-x-1 sm:space-x-2 mt-8 mb-4">
        
        <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`${buttonBaseClass} ${currentPage === 1 ? disabledButtonClass : normalButtonClass}`}
            aria-label="Previous Page"
        >
            前へ
        </button>

        {pageNumbersToDisplay.map((page, index) =>
            typeof page === 'number' ? (
            <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                disabled={currentPage === page}
                className={`${buttonBaseClass} ${currentPage === page ? activeButtonClass : normalButtonClass}`}
                aria-current={currentPage === page ? 'page' : undefined}
            >
                {page}
            </button>
            ) : (
            <span key={`ellipsis-${index}`} className={ellipsisClass}>
                {page}
            </span>
            )
        )}

        <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`${buttonBaseClass} ${currentPage === totalPages ? disabledButtonClass : normalButtonClass}`}
            aria-label="Next Page"
        >
            次へ
        </button>
        </nav>
    );
};

export default PaginationControls;