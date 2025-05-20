import { motion } from 'framer-motion';
import SectionWrapper from '../../hoc/SectionWrapper';

const About = () => {
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6 }}
          className="w-48 h-48 rounded-full overflow-hidden shadow-2xl ring-4 ring-primary"
        >
          <img 
            src="/images/ghibly_myself.png" 
            alt="Profile" 
            className="w-full h-full animate-pulse"
            style={{ imageRendering: 'auto' }}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center md:text-left"
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">About Me</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-2xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vulputate, justo at elementum hendrerit, turpis turpis dapibus lacus, a vestibulum orci lacus nec lorem. Curabitur ut elit sed libero tempor suscipit.
          </p>
        </motion.div>

      </div>
    </div>
  );
}

const WrappedAbout = SectionWrapper(About, "about");
export default WrappedAbout;