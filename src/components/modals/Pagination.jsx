import { useEffect, useState } from "react";
import styles from "./Pagination.module.scss";
import { TbArrowBigRight, TbArrowBigLeft } from "react-icons/tb";

export default function Pagination({ items, itemsPerPage, maxVisiblePages, onCurrentItemsChange }) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const handlePageChange = (page) => {
        const currentItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        onCurrentItemsChange(currentItems);
        setCurrentPage(page);
    };

    const visiblePages = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
    }

    
    useEffect(() => {
        handlePageChange(1);
    }, [])

    return (
        <div className={styles.pagination}>
            <button className={styles.buttonPrev}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <TbArrowBigLeft/>
            </button>
            {startPage > 1 && (
                <button className={`${styles.pageNumber} ${currentPage === 1 ? styles.currentPage : ''}`} onClick={() => handlePageChange(1)}>1</button>
            )}
            {startPage > 2 && <span>...</span>}
            {visiblePages.map((pageNumber) => (
                <button className={`${styles.pageNumber} ${currentPage === pageNumber ? styles.currentPage : ''}`} key={pageNumber} onClick={() => handlePageChange(pageNumber)}>
                    {pageNumber}
                </button>
            ))}
            {endPage < totalPages - 1 && <span>...</span>}
            {endPage < totalPages && (
                <button className={`${styles.pageNumber} ${currentPage === totalPages ? styles.currentPage : ''}`} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </button>
            )}
            <button className={styles.buttonNext} onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                <TbArrowBigRight/>
            </button>
        </div>
    );
}
