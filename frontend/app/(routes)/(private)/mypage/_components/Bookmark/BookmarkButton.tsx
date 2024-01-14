interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
}

const BookmarkButton = ({ isBookmarked, onToggle } : BookmarkButtonProps) => (
  <button
    className={`px-4 py-2 rounded ${isBookmarked ? 'bg-red-500' : 'bg-gray-300'}`}
    onClick={onToggle}
  >
    {isBookmarked ? 'ブックマーク解除' : 'ブックマーク'}
  </button>
);

export { BookmarkButton };