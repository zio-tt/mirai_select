import { Decision } from '@/app/_types';
import { useState, useEffect } from 'react';

interface PaginationProps {
  initialData: Decision[];
  initialPage?: number;
  itemsPerPage?: number;
}

const usePagination = ({
  initialData,        // ページネーションに利用するDecisions
  initialPage = 1,    // ユーザーが選択しているページ（初期値は1）
  itemsPerPage = 10   // 1ページに表示するアイテム数
}: PaginationProps) => {
  const [currentPage,  setCurrentPage]  = useState<number>(initialPage);
  const [currentItems, setCurrentItems] = useState<Decision[]>([]);
  const [pageNumbers,  setPageNumbers]  = useState<number[]>([]);

  useEffect(() => {
    // ページ番号の計算
    const totalItems = initialData.length;
    const numbers = Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, i) => i + 1);
    setPageNumbers(numbers);

    // 現在のページのアイテムを設定
    const indexOfLast  = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    setCurrentItems(initialData.slice(indexOfFirst, indexOfLast));
  }, [initialData, currentPage, itemsPerPage]);

  return {
    currentPage,
    currentItems,
    pageNumbers,
    setCurrentPage
  };
};

export { usePagination };
