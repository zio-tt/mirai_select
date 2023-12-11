import Image from "next/image"

type ContentsImageProps = {
  imageURL: string[]
  imageAlt: string[]
  addClassName?: string
  imageWidth?: number
  imageHeight?: number
}

export const ContentsImage = ({imageURL, imageAlt, addClassName, imageWidth, imageHeight}: ContentsImageProps) => {
  return (
    <>
      { imageWidth && imageHeight && (
        <div className='flex items-center justify-center w-[30vw] min-h-[40vh] overflow-hidden left-0 mr-5'>
          <div className='flex flex-row w-full h-full items-center justify-center'>
            <div className='flex items-center justify-center left-0'>
              <Image src={imageURL[0]}
                    alt={imageAlt[0]}
                    width = {imageWidth}
                    height = {imageHeight}
                    className={`${addClassName}`} />
            </div>
            <div className='flex items-center justify-center left-0'>
              <Image src={imageURL[1]}
                    alt={imageAlt[1]}
                    width = {imageWidth}
                    height = {imageHeight}
                    className={`${addClassName}`} />
            </div>
          </div>
        </div>
      )}
      { !imageWidth && !imageHeight && (
        <div className='relative w-[30vw] min-h-[40vh] overflow-hidden left-0 mr-5'>
          <Image src={imageURL[0]}
                  alt={imageAlt[0]}
                  layout='fill'
                  className={`${addClassName}`} />
        </div>
      )}
    </>
  );
}