'use client';

import "@/app/_common/styles/inputForm.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Bookmark, Character, Comment, Conversation, Decision, Tag, User} from "@/app/_common/types";
import { useSession } from "next-auth/react";
import { Table } from "@/app/_components/ui-elements/Index/Table";

// 2023/12/5 作業予定(バックエンドの修正）
// ConversationTagは本来Decisionに紐づくべきなので修正が必要
// DecisionTagモデル・テーブルを作成し、DecisionとTagを紐づける
interface DecisionIndex extends Decision {
  // id: number;
  // user_id: number;
  // public: boolean;
  // created_at: string;
  // updated_at: string;
  user: User;
  characters: Character[];
  first_query: string;
  conversations: Conversation[];
  tags: Tag[];
  comments: Comment[];
  bookmarks: Bookmark[];
}

export default function Index() {
  const [ decisions, setDecisions] = useState<DecisionIndex[]>([]); // 初期値として空の配列を設定
  const { data: session, status } = useSession();
  const token = session?.appAccessToken;

  const fetchCharacters = async () => {
    try {
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
        setDecisions(data.decisions);
      }
      return;
    } catch (error) {
      console.error('Catch error', error);
    }
  };

  const headerTitle = [
    'query_text',
    'user',
    'comments',
    'bookmarks',
    'tags'
  ]

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
            <div className="min-w-[70%] h-full flex flex-col">
              <div className="p-8 rounded-md w-full">
                <div className=" flex items-center justify-between pb-6">
                  <div className="-mx-4 sm:-mx-8 px-4 sm:px-8
                   py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                      <Table
                        header={headerTitle}
                        data={decisions}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}