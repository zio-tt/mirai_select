"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import * as z from 'zod';

const MessageSchema = z.object({
  message: z.string().min(1).max(50),
  sender: z.enum(["user", "character1", "character2"])
});
type Message = z.infer<typeof MessageSchema>;

export default function Helper() {
  const [ avatar, setAvatar ]= useState<string>('');
  const { data: session, status } = useSession();

  useEffect(() => {
    const user_image = session?.user.image ? session.user.image : '';
    setAvatar(user_image);
    console.log(avatar)
  },[])

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<Message>({ message: '', sender: 'user' });

  const repliesCharacter1 = [
    "この広い世界には、様々な想いが溢れていますね。私たちはそれらを優しく見守る役目があるのです。",
    "人々の心には、時に痛みや悲しみが宿ります。私にできることは、そっと寄り添い、癒しを与えることです。",
    "天の光が、地上のすべての生きとし生けるものを照らします。その光の中で、私は人間の幸せを願い続けます。",
    "時には迷いや困難に直面するものですが、私たちは常に導きの手を差し伸べます。人々の未来は輝かしいものになるでしょう。",
    "この世には見えない絆が存在しています。人々がお互いを思いやる心、それが私たち天使の最大の喜びです。"
  ];
  const repliesCharacter2 = [
    "オレ様のいたずらで、ちょっとした混乱を起こしてやるぜ。",
    "人間たちって、ちょっとしたことでパニックになるよな。オレ様のちょっとした悪戯が、彼らをどう変えるか楽しみだぜ。",
    "オレ様の存在があるからこそ、天使たちも輝くんだよ。ハハ、なんてことないさ、オレ様はただの悪魔だからな。",
    "たまには、このオレ様も人間たちにいいことしてやるか。そうだな・・・熱いからそこら中に水でも撒いてやるか！",
    "この世界は、オレ様の遊び場だ。でも、心配すんな、オレ様がいる限り、つまらないことにはならねえからな！"
  ];
  const getRandomReply = (replies: string[]) => {
    const randomIndex = Math.floor(Math.random() * replies.length);
    return replies[randomIndex];
  };

  const handleClick = () => {
    if (newMessage.message.trim() !== '') {
      // ユーザーからのメッセージを追加
      setMessages(prevMessages => [...prevMessages, { ...newMessage, sender: "user" }]);

      // 一定時間後にキャラクター1とキャラクター2からの返答を追加
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { message: getRandomReply(repliesCharacter1), sender: "character1" },
          { message: getRandomReply(repliesCharacter2), sender: "character2" }
        ]);
      }, 1000); // 1秒後に実行

      setNewMessage({ message: '', sender: 'user' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage({ ...newMessage, message: e.target.value });
  };

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagSubmit = () => {
    if (tagInput.trim() !== '') {
      setTags(tagInput.split(',').map(tag => tag.trim()));
      setTagInput('');
    }
  };

  return (
    <div className="flex justify-space-around justify-center items-center w-screen h-[calc(100vh-96px)]"> {/* ヘッダーとフッターを除いた高さ */}
      {/* チャット欄 */}
      <div className="mr-10 w-[45%] flex items-center justify-center shadow bg-slate-900 rounded-lg border-black" style={{ height: '95%' }}>
        <div className="w-[90%] p-4 bg-gray-300 rounded-lg overflow-y-auto flex flex-col-reverse" style={{ height: '90%' }}>
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-end ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                {/* キャラクター画像 */}
                <div className='grow-0'>
                  {message.sender === "character1" &&
                    <div className="avatar">
                      <div className="w-12 rounded-full bg-white shadow-lg">
                        <Image src="/images/character_angel.png" alt="Character1" width={144} height={144} className="object-cover" />
                      </div>
                    </div>
                  }
                  {message.sender === "character2" &&
                    <div className="chat-image avatar">
                      <div className="w-12 rounded-full bg-white shadow-lg">
                        <Image src="/images/character_akuma.png" alt="Character1" width={144} height={144} className="object-cover" />
                      </div>
                    </div>
                  }
                </div>
                {/* メッセージ */}
                <div className={`${message.sender === "user" ? "chat chat-end" : "chat chat-start"}`}>
                  <div className={`${message.sender === "user" ? "mr-2" : "ml-2"} chat-header`}>
                    {message.sender}
                  </div>
                  <div className={`${message.sender === "user" ? "chat-bubble-info" : "chat-bubble-success"} chat-bubble break-words whitespace-normal`}>
                    {message.message}
                  </div>
                </div>
                {/* ユーザーアバター */}
                <div className='grow-0'>
                  {message.sender === "user" &&
                    <div className="chat-image avatar">
                      <div className="w-12 rounded-full shadow-lg">
                        <Image src={avatar} alt="avatar" width={144} height={144} className="object-cover" />
                      </div>
                    </div>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* メッセージ入力欄 */}
      <div className="mr-10 w-[45%] flex items-center justify-center shadow bg-slate-900 rounded-lg border-black" style={{ height: '95%' }}>
        <div className="ml-5 w-[90%] flex flex-col items-center justify-end p-4 pb-10 border border-gray-300" style={{ height: '90%' }}>
          {/* タグ表示 */}
          <div className="flex flex-wrap mb-4">
            {tags.map((tag, index) => (
              <span key={index}>
                <div className="badge badge-warning gap-2 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  {tag}
                </div>
              </span>
            ))}
          </div>
          {/* タグ入力フォーム */}
          <div className="flex w-[90%] h-14 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={handleTagChange}
              className="border-2 border-black flex-grow p-2 mr-6 rounded-l bg-white text-black"
              placeholder="タグを入力（例：tag1,tag2）"
            />
            <button onClick={handleTagSubmit}><input type="submit" value="Submit" className="btn btn-outline" /></button>
          </div>
          {/* メッセージ入力フォーム */}
          <div className="flex w-[90%] h-14 mt-2">
            <input
              type="text"
              value={newMessage.message}
              onChange={handleChange}
              className="border-2 border-black flex-grow p-2 mr-6 rounded-l bg-white text-black"
              placeholder="メッセージを入力..."
            />
            <button onClick={handleClick}><input type="submit" value="Submit" className="btn btn-outline" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}