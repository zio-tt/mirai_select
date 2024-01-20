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

export const useMyDecisionsData = () => {
  const { currentUser,   setCurrentUser,
          users,         setUsers,
          decisions,     setDecisions,
          conversations, setConversations,
          comments,      setComments,
          bookmarks,     setBookmarks,
          decisionTags,  setDecisionTags,
          tags,          setTags } = useDecisions();

  const { data: session } = useSession();

  const [ token,     setToken ]     = useState<string>('');
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  useEffect(() => {
    if (session) {
      setToken(session.appAccessToken);
    }
  }, [session]);

  const fetchDecisionsData = async (
    token: string,
    decisions_condition: string,
  ) => {
    console.log('fetchDecisionsData');
    setIsLoading(true);
    try {
      const currentUser       = await getUsers(token, "current_user");
      const userData          = await getUsers(token, "all");
      const decisionsData     = await getDecisions({token: token, condition: decisions_condition});
      const conversationsData = await getConversations({token: token, condition: "all"});
      const commentsData      = await getComments(token);
      const bookmarksData     = await getBookmarks(token);
      const decisionTagsData  = await getDecisionTags(token);
      const tagsData          = await getTags(token);

      setUsers(userData.users);
      setCurrentUser(currentUser.current_user);
      setDecisions(decisionsData);
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
    decisions,
    conversations,
    comments,
    bookmarks,
    decisionTags,
    tags,
    fetchDecisionsData
  };
}