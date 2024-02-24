import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'

import { useHelper } from '@/app/_contexts/_featureContexts/HelperContext'

interface UserInterfaceProps {
  setTags: (tags: string[]) => void
  saveDecision: () => Promise<void>
}

const TagInputForm = ({ setTags, saveDecision }: UserInterfaceProps) => {
  const { inputTags, setInputTags } = useHelper()
  const { setDisplayTags } = useHelper()
  const { setLabelBgColor } = useHelper()
  const { setLabelTextColor } = useHelper()
  const { setTagAlert } = useHelper()

  const handleTagChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 入力値からスペースを含む全ての空白文字を取り除く
    const tagsWithoutSpaces = e.target.value
      .split(',')
      .map((tag) => tag.replace(/\s+/g, '').slice(0, 10)) // ここで全てのスペースを取り除く
    const nonEmptyTags = tagsWithoutSpaces.filter((tag) => tag)

    // タグの個数が6個以下、各タグの文字数が10文字以下であることを確認
    const newTags = nonEmptyTags.slice(0, 6)
    setTags(newTags)
    setDisplayTags(newTags)

    // 入力値を更新
    setInputTags(e.target.value)
  }

  useEffect(() => {
    const splitTags = inputTags.split(',').map((tag) => tag.replace(/\s+/g, ''))
    const nonEmptyTags = splitTags.filter((tag) => tag)

    const newAlertMessages = []

    // タグの個数が6個を超える場合
    if (splitTags.length > 6) {
      newAlertMessages.push('タグの個数が6個を超えています。')
    }

    // タグ1つの文字数が10文字を超える場合
    if (nonEmptyTags.some((tag) => tag.length > 10)) {
      newAlertMessages.push('タグの文字数が10文字を超えています。')
    }

    // 空白のタグが存在する場合
    if (nonEmptyTags.some((tag) => tag.length === 0)) {
      newAlertMessages.push('空白のタグは許容されません。')
    }

    // アラートメッセージを更新
    setTagAlert(newAlertMessages)

    // タグに関するアラートが存在しない場合
    if (newAlertMessages.length) {
      setLabelBgColor('bg-red-100')
      setLabelTextColor('text-red-800')
    } else {
      setLabelBgColor('bg-blue-100')
      setLabelTextColor('text-blue-800')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputTags])

  return (
    <>
      <div className='flex w-full flex-row items-center gap-2 rounded-[99px] border border-gray-900/1 bg-slate-100 p-2'>
        <div className='relative grid h-full w-full min-w-[80%]'>
          <textarea
            rows={1}
            placeholder='タグをカンマ(,)区切りで入力してください（6個まで）'
            onChange={handleTagChange}
            value={inputTags}
            className='peer h-full resize-none min-h-full w-full rounded-[7px] !border-0 border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder:text-blue-gray-300 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-transparent focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50'
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all before:content-none after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all after:content-none peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"></label>
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault() // フォームの自動送信を防ぐ
              // void演算子を使用して非同期関数を呼び出す
              void saveDecision().catch((error) => {
                console.error('Error saving decision:', error)
              })
            }}
            className='relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-full text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
            type='button'
          >
            <span className='absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
              <PaperAirplaneIcon className='h-5 w-5' />
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

export { TagInputForm }
