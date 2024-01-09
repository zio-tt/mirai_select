'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { DecisionCard } from './_components/DecisionCard';
import { DecisionDetail } from './_components/DecisionDetail';
import { Decision, Conversation, Character, CharacterResponse, User, Comment, Bookmark } from '@/app/_types';

interface DecisionIndex {
  decision: Decision;
  user: User;
  comments: Comment[];
  bookmarks: Bookmark[];
  conversations: Conversation[];
  characters: Character[];
  character_responses: CharacterResponse[];
}

export default function Index() {
  const [decisions, setDecisions] = useState<DecisionIndex[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<DecisionIndex | null>(null);
  const { data: session } = useSession();
  const token = session?.appAccessToken;

  const fetchDecisions = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/index/`,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setDecisions(response.data.decisions);
      }
    } catch (error) {
      console.error('Error fetching decisions', error);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

  const handleDecisionClick = (decision: DecisionIndex) => {
    setSelectedDecision(decision);
  };

  const handleCloseDetail = () => {
    setSelectedDecision(null);
  };

  return (
    <div className='flex flex-col items-center justify-start w-screen min-h-screen'>
      <div className='w-[80vw] mt-[5vh]'>
        {decisions.map((decision) => (
          <div key={decision.decision.id} onClick={() => handleDecisionClick(decision)}>
            <DecisionCard
              query_text={decision.conversations[0].query_text}
              user={decision.user}
              comments={decision.comments}
              bookmarks={decision.bookmarks}
            />
          </div>
        ))}
      </div>

      {selectedDecision && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-5 rounded-lg">
            <DecisionDetail
              decision={selectedDecision.decision}
              conversations={selectedDecision.conversations}
              characters={selectedDecision.characters}
              character_responses={selectedDecision.character_responses}
            />
            <button onClick={handleCloseDetail} className="rounded bg-blue-500 text-white px-4 py-2 mt-4">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
}