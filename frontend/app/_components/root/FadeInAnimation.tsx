import { motion } from 'framer-motion'

type FadeInAnimationProps = {
  children: React.ReactNode
}

const FadeInAnimation = ({ children }: FadeInAnimationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1 }}
      className='flex flex-col w-full h-full'
    >
      {children}
    </motion.div>
  )
}

export { FadeInAnimation }