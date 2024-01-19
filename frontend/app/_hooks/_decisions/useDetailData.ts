import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getConversations,
         getUserCharacters,
         getCharacterResponses } from '@/app/_features/fetchAPI';
import { Decision,
         Conversation,
         Character } from '@/app/_types';

interface CharacterResponse {
  conversation_id: number;
  character_id?:   number;
  response:        string;
}

export const useDetailData = (decision: Decision) => {
  const { data: session } = useSession();

  const [ decisionCharacters, setDecisionCharacters ] = useState<Character[]>();
  const [ characterResponses, setCharacterResponses ] = useState<CharacterResponse[]>();

  const [ token,     setToken ]     = useState<string>('');
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  useEffect(() => {
    if (session) {
      setToken(session.appAccessToken);
    }
  }, [session]);

  useEffect(() => {
    fetchDetailData();
  }, [token]);

  const fetchDetailData = async () => {
    if (token) {
      setIsLoading(true);
      try {
        const decisionCharactersData = await getUserCharacters(token, "user");
        const characterResponsesData = await getCharacterResponses(token, decision.id);

        setDecisionCharacters(decisionCharactersData.charactersData);
        setCharacterResponses(characterResponsesData);

      } catch (error) {
        console.error('Error fetching initial data', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    decisionCharacters,
    characterResponses,
    isLoading
  };
}