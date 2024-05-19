import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';

export default function Pagination({data, setCurrentItems}) {
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(data.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, setCurrentItems]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setItemOffset(newOffset);
  };

  return (
    <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        containerClassName={'custom-pagination'}
        pageLinkClassName={'page-number'}
        previousLinkClassName={'next-prev'}
        nextLinkClassName={'next-prev'}
        activeLinkClassName={'active'}
        breakLinkClassName={'break'}
        disabledLinkClassName={'disabled'}
      />
  )
}
