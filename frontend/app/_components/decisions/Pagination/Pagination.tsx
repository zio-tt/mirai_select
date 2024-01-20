interface PaginationProps {
  postsPerPage: number;
  totalPosts: number;
  paginate: (number: number) => void;
  currentPage: number;
  paginateFirst: () => void;
  paginateLast: () => void;
}

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage, paginateFirst, paginateLast }: PaginationProps) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='pagination flex justify-center items-center my-4'>
      <button onClick={paginateFirst} className='page-link text-lg mx-2 text-black'>{'<<'}</button>
      {pageNumbers.map(number => (
        number >= currentPage - 2 && number <= currentPage + 2 && (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`page-link text-lg mx-2 ${currentPage === number ? 'text-blue-500 font-bold' : 'text-black'}`}
          >
            {number}
          </button>
        )
      ))}
      <button onClick={paginateLast} className='page-link text-lg mx-2 text-black'>{'>>'}</button>
    </div>
  );
}

export { Pagination }