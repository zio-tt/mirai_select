import { ContentsImage } from "../../ui-elements/TopPage/ContentsImage";
import { ContentsText } from "../../ui-elements/TopPage/ContentsText";

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
