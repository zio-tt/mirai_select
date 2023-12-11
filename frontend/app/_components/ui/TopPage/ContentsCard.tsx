import { ContentsImage } from "./ContentsImage";
import { ContentsText } from "./ContentsText";

type ContentsCardProps = {
  imageURL: string[]
  imageAlt: string[]
  title: string
  text: JSX.Element
  addClassName?: string
  imageWidth?: number
  imageHeight?: number
}

export const ContentsCard = ({imageURL, imageAlt, title, text, addClassName, imageWidth, imageHeight}: ContentsCardProps) => {
  return (
    <div className='flex flex-col lg:flex-row items-center justify-center w-full mb-10'>
      <ContentsImage imageURL={imageURL}
                     imageAlt={imageAlt}
                     addClassName={addClassName}
                     imageWidth={imageWidth}
                     imageHeight={imageHeight} />
      <ContentsText title={title}
                    text={text} />
    </div>
  );
}
