// hooks
// contexts
import { useHelper }   from '@/app/_contexts/HelperContext';
// components
import { UserQueryDisplay } from '@/app/_components/helper/Information/UserQueryDisplay';
import { SelectedResponse } from '@/app/_components/helper/Information/SelectedResponse';

const Information = () => {
  const { conversationCount }  = useHelper();
  const { currentUser }        = useHelper();
  const { userCharacters }     = useHelper();
  const { queryText }          = useHelper();
  const { beforeQueryText }    = useHelper();
  const { userDecision }       = useHelper();
  const { beforeUserDecision } = useHelper();
  const { displayTags }        = useHelper();
  const { labelBgColor }       = useHelper();
  const { labelTextColor }     = useHelper();
  const { tagAlert }           = useHelper();

  if(!currentUser || !userCharacters ) { return null; }
  return (
    <>
      <div className='fixed right-0 flex flex-col w-[30rem] min-h-screen overflow-auto justify-start items-center pt-10 mt-[3rem] border-l'>
        {conversationCount == 2 && (
          <>
            {displayTags.length > 0 && (
              <>
                { tagAlert &&  (
                  <div className='w-[80%] max-h-[10vh] flex flex-col items-center justify-center mx-auto text-red-600 p-6 border border-red-500 overflow-auto'>
                    {tagAlert.map((alert, index) => (
                      <div key={index} className='flex'>{alert}</div>
                    ))}
                  </div>
                )}
                入力中のタグ
                <div className="flex w-[80%] max-h-[30%] border overflow-auto">
                  {displayTags.map((tag, index) => (
                    <div key={index} className={`text-xs font-semibold mb-2 px-2.5 py-1 rounded ${labelTextColor} ${labelBgColor}`}>
                      {tag}
                    </div>
                  ))}
                </div>
              </>
            )}
            {userDecision && beforeQueryText && (
              <>
                前回の質問文と選択した回答
                <div className="flex flex-col w-[80%] h-[50vh] p-4 items-start justify-start border overflow-auto">
                  <UserQueryDisplay decisionUser={currentUser} queryText={beforeQueryText} />
                  <SelectedResponse decisionCharacter={userCharacters.find((c)=> c.id == userDecision.character_id)} characterResponse={userDecision} />
                </div>
              </>
            )}
          </>
        )}
        {conversationCount == 3 && (
          <>
            {displayTags.length > 0 && (
              <>
                { tagAlert &&  (
                  <div className='w-[80%] max-h-[10vh] flex flex-col items-center justify-center mx-auto text-red-600 p-6 border border-red-500 overflow-auto'>
                    {tagAlert.map((alert, index) => (
                      <div key={index} className='flex'>{alert}</div>
                    ))}
                  </div>
                )}
                入力中のタグ
                <div className="flex w-[80%] max-h-[30%] border overflow-auto">
                  {displayTags.map((tag, index) => (
                    <div key={index} className={`text-xs font-semibold mb-2 px-2.5 py-1 rounded ${labelTextColor} ${labelBgColor}`}>
                      {tag}
                    </div>
                  ))}
                </div>
              </>
            )}
            {beforeUserDecision && userDecision && beforeQueryText && queryText && (
              <>
                前回までの質問文と選択した回答
                <div className="flex flex-col w-[80%] h-[50vh] p-4 items-start justify-start border overflow-auto">
                  <UserQueryDisplay decisionUser={currentUser} queryText={beforeQueryText} />
                  <SelectedResponse decisionCharacter={userCharacters.find((c)=> c.id == beforeUserDecision.character_id)} characterResponse={beforeUserDecision} />
                  <UserQueryDisplay decisionUser={currentUser} queryText={queryText} />
                  <SelectedResponse decisionCharacter={userCharacters.find((c)=> c.id == userDecision.character_id)} characterResponse={beforeUserDecision} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export { Information }