import { motion } from "framer-motion";

interface ScrollerProps {
  targetHref: string;
  absolute?: boolean;
}

const Scroller = ( { targetHref, absolute = false }: ScrollerProps) => {
  return (
    <div className={absolute ? 'absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center' : 'w-full flex justify-center items-center mt-6'}>
      <a href={targetHref}>
        <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary dark:border-secondary border-secondary-light flex justify-center items-start p-2'>
          <motion.div
            animate={{
              y: [0, 24, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className='w-3 h-3 rounded-full bg-secondary dark:bg-secondary bg-secondary-light mb-1'
          />
        </div>
      </a>
    </div>
  );
}

export default Scroller;