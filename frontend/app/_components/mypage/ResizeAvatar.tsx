import pica from 'pica'
import Slider from 'rc-slider/lib/Slider'
import { useCallback, useRef, useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import Modal from 'react-modal'
import 'rc-slider/assets/index.css'

import { useCharacterList } from '@/app/_contexts/CharacterListContext'

interface Props {
  onChangePreviewAvatar: (iconFile: File | null) => void
  onChangeAvatar: (iconFile: File | null) => void
}
const style = { width: 200, margin: 50 }

const ICON_WIDTH = 100 as const
const ICON_HEIGHT = 100 as const

const ResizeAvatar = (props: Props) => {
  const { onChangeAvatar, onChangePreviewAvatar } = props
  const { previewAvatar } = useCharacterList()
  const editorRef = useRef<AvatarEditor | null>(null)
  const [scale, setScale] = useState(1)

  const handleClickFileSave = useCallback(async () => {
    if (!editorRef.current) return

    const img = editorRef.current.getImage()
    const canvas = editorRef.current.getImageScaledToCanvas()
    canvas.width = ICON_WIDTH
    canvas.height = ICON_HEIGHT
    const picaCanvas = await pica().resize(img, canvas)

    picaCanvas.toBlob((blob) => {
      if (!blob) return
      if (!previewAvatar) return

      const nextFile = new File([blob], previewAvatar.name, {
        type: previewAvatar.type,
        lastModified: Date.now(),
      })
      onChangeAvatar(nextFile)
      handleCloseIsOpen()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewAvatar, onChangeAvatar])

  const handleCloseIsOpen = useCallback(() => {
    onChangePreviewAvatar(null)
  }, [onChangePreviewAvatar])

  const handleChangeScale = useCallback((value: number | number[]) => {
    if (Array.isArray(value)) return
    setScale(value)
  }, [])

  return (
    <Modal
      isOpen={!!previewAvatar}
      onRequestClose={handleCloseIsOpen}
      ariaHideApp={false}
      overlayClassName={{
        base: 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center',
        afterOpen: 'bg-black bg-opacity-50',
        beforeClose: 'bg-black bg-opacity-0',
      }}
      className={{
        base: 'relative w-0 h-0 bg-transparent border-none mx-auto z-60',
        afterOpen: 'w-[350px] h-[450px] bg-white border-none mx-auto',
        beforeClose: 'w-0 h-0 bg-transparent border-none mx-auto',
      }}
      closeTimeoutMS={500}
    >
      <div className='flex items-center justify-center h-full'>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex justify-center'>
            <AvatarEditor
              ref={editorRef}
              image={previewAvatar ? URL.createObjectURL(previewAvatar) : ''}
              width={ICON_WIDTH}
              height={ICON_HEIGHT}
              borderRadius={100}
              color={[0, 0, 0, 0.5]}
              scale={scale}
              rotate={0}
            />
          </div>
          <div className='flex pt-2' style={style}>
            <Slider
              onChange={handleChangeScale}
              min={1}
              max={1.5}
              step={0.01}
              defaultValue={1}
            />
          </div>
          <div className='flex justify-center pt-2'>
            <button
              type='button'
              className='cursor-pointer'
              onClick={() =>
                void (async () => {
                  await handleClickFileSave()
                })()
              }
            >
              確定
            </button>
          </div>
          <div className='flex justify-center pt-2'>
            <button type='button' className='cursor-pointer' onClick={handleCloseIsOpen}>
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export { ResizeAvatar }
