'use client';

import "@/app/_common/styles/inputForm.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Bookmark, Character, Comment, Conversation, Decision, Tag, User} from "@/app/_common/types";
import { useSession } from "next-auth/react";

// 2023/12/5 作業予定(バックエンドの修正）
// ConversationTagは本来Decisionに紐づくべきなので修正が必要
// DecisionTagモデル・テーブルを作成し、DecisionとTagを紐づける
interface DecisionIndex extends Decision {
  // id: number;
  // user_id: number;
  // public: boolean;
  // created_at: string;
  // updated_at: string;
  users: User[];
  characters: Character[];
  first_query: string;
  conversations: Conversation[];
  tags: Tag[];
  comments: Comment[];
  bookmarks: Bookmark[];
}

export default function Index() {
  const [decisions, setDecisions] = useState<DecisionIndex[]>([]);
  const { data: session, status } = useSession();
  const token = session?.appAccessToken;
  // バックエンドから必要なデータを取得する
  // 取得はasync/awaitとaxiosを使用し、JSON形式で取得する
  const fetchCharacters = async () => {
    try{
      const getIndexData = await axios({
        method: 'post',
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/index/`,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      });
      if (getIndexData.status === 200) {
        const data = getIndexData.data;
        console.log(data);
        setDecisions(data);
      }
      return;
    } catch (error) {
      console.error('Catch error', error);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-start w-screen min-h-screen">
        <div className='flex flex-col items-center justify-center w-[80vw] h-[90vh] mt-[5vh]'>
          <div className='h-full w-full bg-gray-200/30 backdrop-blur-lg rounded-md border border-gray-200/30 shadow-lg flex flex-col items-center justify-start py-[1vh] px-[3vw] overflow-auto'>
            <div className='flex text-center text-gray-500 text-lg md:text-2xl lg:text-4xl underline mb-[3vh]'>
              <h1>みんなの悩みごと </h1>
            </div>
            <div className="flex flex-col w-full lg:flex-row">
              <div className="w-[50%] h-full flex flex-col">
                <div className="thought-bubble w-[30%] flex flex-col items-center justify-center mr-10">
                  <div className="form-control w-full max-w-lg bg-white p-4">
                    あいうえおかきくけこさしすせそたちつてとなにぬねの
                  </div>
                </div>
              </div>
              <div className="w-[50%] h-full flex flex-col">
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}