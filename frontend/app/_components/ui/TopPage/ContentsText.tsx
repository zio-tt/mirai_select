type ContentsTextProps = {
  title: string
  text: JSX.Element
}

export const ContentsText = ({title, text}: ContentsTextProps) => {
  return (
    <div className='flex flex-col items-center justify-center right-0 ml-5
    w-[40vw] min-h-[40vh]'>
      <div className="h-full w-full bg-gray-200/30 backdrop-blur-lg
      rounded-md border border-gray-200/30 shadow-lg
      flex flex-col items-center justify-center p-10">
        <h3 className='flex text-gray-500 text-lg md:text-2xl lg:text-4xl'>{title}</h3>
        <p className='flex text-center text-gray-500 text-xs md:text-md lg:text-lg mt-2'>
          {text}
        </p>
      </div>
    </div>
  );
}