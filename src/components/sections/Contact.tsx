import { useRef } from 'react';
import emailjs from 'emailjs-com';
import { motion } from 'framer-motion';
import Raspberry from '../canvas/Raspberry';
import SectionWrapper from '../../hoc/SectionWrapper';

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    emailjs.sendForm(
      'service_bix9mwo',
      'template_portfolio',
      formRef.current,
      'W_OiVSIDic_iqQAGY'
    ).then(
      () => {
        alert('Üzenet elküldve!');
        formRef.current?.reset();
      },
      (error) => {
        alert('Hiba történt: ' + error.text);
      }
    );
  };

  return (
    <div className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 aspect-square relative">
          <Raspberry />
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          whileInView={{ opacity: 0.85, x: 0 }} 
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 bg-white dark:bg-[#2a2342] p-8 rounded-2xl shadow-xl"
        >
          <h2 className="text-3xl font-bold mb-6">Contact</h2>
          <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                name="user_name"
                required
                className="mt-1 w-full p-3 bg-gray-100 dark:bg-[#3a2f60] text-gray-800 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-[#915EFF]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                name="user_email"
                required
                className="mt-1 w-full p-3 bg-gray-100 dark:bg-[#3a2f60] text-gray-800 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-[#915EFF]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
              <textarea
                name="message"
                rows={5}
                required
                className="mt-1 w-full p-3 bg-gray-100 dark:bg-[#3a2f60] text-gray-800 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-[#915EFF]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#915EFF] text-white py-3 rounded-lg hover:bg-purple-600 transition"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const WrappedContact = SectionWrapper(Contact, "contact");
export default WrappedContact;