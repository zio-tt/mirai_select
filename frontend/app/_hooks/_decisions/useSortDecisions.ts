import { Decision, Comment, Bookmark } from '@/app/_types';

const useSortDecisions = (
  newSortOrder: string,
  setSortOrder: (sortOrder: string) => void,
  filteredDecisions: Decision[],
  setFilteredDecisions: (decisions: Decision[]) => void,
  comments?: Comment[],
  bookmarks?: Bookmark[]
) => {
  setSortOrder(newSortOrder);

  let sortedDecisions = [...filteredDecisions];
  
  if (newSortOrder === 'date_new') {
    sortedDecisions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (newSortOrder === 'date_old') {
    sortedDecisions.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  } else if (newSortOrder === 'comments') {
    // 各decisionのidとcommentsのdecision_idを比較
    // commentsの数でソート
    // decisionの配列を更新
    sortedDecisions.sort((a, b) => {
      const aComments = comments!.filter(comment => comment.decision_id === a.id);
      const bComments = comments!.filter(comment => comment.decision_id === b.id);
      return bComments.length - aComments.length;
    });
  } else if (newSortOrder === 'bookmarks') {
    // 各decisionのidとbookmarksのdecision_idを比較
    // bookmarksの数でソート
    // decisionの配列を更新
    sortedDecisions.sort((a, b) => {
      const aBookmarks = bookmarks!.filter(bookmark => bookmark.decision_id === a.id);
      const bBookmarks = bookmarks!.filter(bookmark => bookmark.decision_id === b.id);
      return bBookmarks.length - aBookmarks.length;
    });
  }

  setFilteredDecisions(sortedDecisions);
};

export {useSortDecisions};