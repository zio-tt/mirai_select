import { motion } from "framer-motion";
import { useTopPage } from "@/app/_contexts/TopPageContext";
import { useEffect, useState } from "react";

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

type FadeInOutProps = {
  children: React.ReactNode;
  onCompletion?: () => void;
  animationType: 'fadeIn' | 'fadeOut';
};

const FadeInOut = ({ children, onCompletion, animationType }: FadeInOutProps ) => (
  <motion.div
    initial={ animationType == 'fadeIn' ? "hidden" : "visible" }
    animate={ animationType == 'fadeIn' ? "visible" : "hidden" }
    variants={fadeInVariants}
    transition={{ duration: 0.7, delay: 0.3 }}
    onAnimationComplete={ animationType == 'fadeIn' ? onCompletion : undefined }
    className="absolute w-full h-full"
  >
    {children}
  </motion.div>
);

const OpeningAnimation = () => {
  const [ fadeInComplete, setFadeInComplete ] = useState(false);
  const [ animationType, setAnimationType ] = useState<'fadeIn' | 'fadeOut'>('fadeIn');
  const { setIsViewed } = useTopPage();

  useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      setFadeInComplete(true);
      setAnimationType('fadeOut');
    }, 1000);
    const fadeOutTimer = setTimeout(() => {
      setIsViewed(true);
    }, 2000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
    }
  }, []);

  const Content = () => (
    <FadeInOut
      onCompletion={() => setFadeInComplete(true)}
      animationType={animationType}>
      <div className='flex flex-col w-screen h-screen items-center justify-center relative overflow-none'>
        <h1 className='flex text-gray-300 text-3xl md:text-5xl lg:text-7xl'>ミライセレクト</h1>
        <h2 className='flex text-gray-500 text-lg md:text-2xl lg:text-4xl mt-3'>あなたの決断をサポートする</h2>
      </div>
    </FadeInOut>
  );

  return (
    <>
      { fadeInComplete ? <Content /> : <Content /> }
    </>
  );
}


export { OpeningAnimation };