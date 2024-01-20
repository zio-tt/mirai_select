import { useState, createContext, useContext, useRef } from 'react';
import { User, Decision, Conversation, Comment, Bookmark, DecisionTag, Tag } from '../_types';

type DecisionsContextType = {
  users:                 User[];
  currentUser:           User;
  decisions:             Decision[];
  conversations:         Conversation[];
  comments:              Comment[];
  bookmarks:             Bookmark[];
  decisionTags:          DecisionTag[];
  tags:                  Tag[];
  selectedDecision:      Decision | undefined;
  decisionsCondition:    string;
  isLoading:             boolean;
  setUsers:              React.Dispatch<React.SetStateAction<User[]>>;
  setCurrentUser:        React.Dispatch<React.SetStateAction<User>>;
  setDecisions:          React.Dispatch<React.SetStateAction<Decision[]>>;
  setConversations:      React.Dispatch<React.SetStateAction<Conversation[]>>;
  setComments:           React.Dispatch<React.SetStateAction<Comment[]>>;
  setBookmarks:          React.Dispatch<React.SetStateAction<Bookmark[]>>;
  setDecisionTags:       React.Dispatch<React.SetStateAction<DecisionTag[]>>;
  setTags:               React.Dispatch<React.SetStateAction<Tag[]>>;
  setSelectedDecision:   React.Dispatch<React.SetStateAction<Decision | undefined>>;
  setDecisionsCondition: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading:          React.Dispatch<React.SetStateAction<boolean>>;
};

type ChildrenType = {
  children: React.ReactNode;
};

const DecisionsContext = createContext<DecisionsContextType | null>(null);

export const useDecisions = () => {
  const context = useContext(DecisionsContext);
  if (!context) {
    throw new Error('useDecisions must be used within a DecisionsProvider');
  }
  return context;
};

export const DecisionsProvider = ({ children }: ChildrenType) => {

  // undefinedにしないためのダミーデータ
  const current_user = {
    id:     0,
    name:   '',
    email:  '',
    avatar: '',
    token:  0
  }

  // APIから取得するデータ
  const [ currentUser,      setCurrentUser ]      = useState<User>(current_user);
  const [ users,            setUsers ]            = useState<User[]>([]);
  const [ decisions,        setDecisions ]        = useState<Decision[]>([]);
  const [ conversations,    setConversations ]    = useState<Conversation[]>([]);
  const [ comments,         setComments ]         = useState<Comment[]>([]);
  const [ bookmarks,        setBookmarks ]        = useState<Bookmark[]>([]);
  const [ decisionTags,     setDecisionTags ]     = useState<DecisionTag[]>([]);
  const [ tags,             setTags ]             = useState<Tag[]>([]);

  // Decisionsで選択されたDecision
  const [ selectedDecision, setSelectedDecision ] = useState<Decision | undefined>();

  // Decisionsで選択された条件
  const [ decisionsCondition, setDecisionsCondition ] = useState<string>('public');

  // ローディング
  const [ isLoading, setIsLoading ]        = useState<boolean>(false);

  return (
    <DecisionsContext.Provider 
      value={{ 
        currentUser,        setCurrentUser,
        users,              setUsers,
        decisions,          setDecisions,
        conversations,      setConversations,
        comments,           setComments,
        bookmarks,          setBookmarks,
        decisionTags,       setDecisionTags,
        tags,               setTags,
        selectedDecision,   setSelectedDecision,
        decisionsCondition, setDecisionsCondition,
        isLoading,          setIsLoading,
      }}>
      {children}
    </DecisionsContext.Provider>
  );
};
