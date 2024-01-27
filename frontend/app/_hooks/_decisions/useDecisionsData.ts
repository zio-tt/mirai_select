import { useState, useEffect } from 'react';
import { useSession }          from 'next-auth/react';
import { useDecisions }        from '@/app/_contexts/DecisionsContext';
import { getBookmarks,
         getComments,
         getConversations,
         getDecisions,
         getDecisionTags,
         getTags,
         getUsers } from '@/app/_features/fetchAPI';

export const useDecisionsData = () => {
  const { currentUser,        setCurrentUser,
          users,              setUsers,
          conversations,      setConversations,
          comments,           setComments,
          bookmarks,          setBookmarks,
          decisionTags,       setDecisionTags,
          tags,               setTags,
          decisionsCondition, setDecisionsCondition} = useDecisions();

  const { data: session } = useSession();

  const [ token,     setToken ]     = useState<string>('');
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  useEffect(() => {
    if (session) {
      setToken(session.appAccessToken);
    }
  }, [session]);

  useEffect(() => {
    if (token) {
      fetchDecisionsData(token);
    }
  }, [token]);

  const fetchDecisionsData = async (token: string) => {
    setIsLoading(true);
    try {
      const currentUser       = await getUsers(token, "current_user");
      const userData          = await getUsers(token, "all");
      const conversationsData = await getConversations({token: token, condition: "all"});
      const commentsData      = await getComments(token);
      const bookmarksData     = await getBookmarks(token);
      const decisionTagsData  = await getDecisionTags(token);
      const tagsData          = await getTags(token);

      setUsers(userData.users);
      setCurrentUser(currentUser.current_user);
      setConversations(conversationsData);
      setComments(commentsData);
      setBookmarks(bookmarksData);
      setDecisionTags(decisionTagsData);
      setTags(tagsData);

    } catch (error) {
      console.error('Error fetching initial data', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    token, setToken,
    currentUser,
    users,
    conversations,
    comments,
    bookmarks,
    decisionTags,
    tags,
    fetchDecisionsData
  };
}