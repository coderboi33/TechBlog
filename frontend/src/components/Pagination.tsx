import { useState } from "react";

interface PaginationProps {
    totalPages: number;
}


export default function Pagination({ totalPages }: PaginationProps) {

    const [page, setPage] = useState(1);
    return (
        <div>
            <button onClick={() => {
                if (page > 1) {
                    setPage(page - 1)
                }
            }}>
                Previous
            </button>
            <span>{page} of {Math.ceil(totalPages / 10)}</span>
            <button onClick={() => {
                if (page < Math.ceil(totalPages / 10)) {
                    setPage(page + 1)
                }
            }}>
                Next
            </button>
        </div>
    )
}