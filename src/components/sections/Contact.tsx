import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from 'emailjs-com';
import { motion } from 'framer-motion';
import Raspberry from '../canvas/Raspberry';
import SectionWrapper from '../../hoc/SectionWrapper';

const Contact = () => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    setFormStatus('sending');
    setErrorMessage('');

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      formRef.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ).then(
      () => {
        setFormStatus('success');
        formRef.current?.reset();
      },
      (error) => {
        console.error("EmailJS hiba:", error);
        setErrorMessage(error.text || 'Hiba történt az üzenet küldésekor. Kérjük, próbálja újra később.');
        setFormStatus('error');
      }
    );
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (formStatus === 'success') {
      timer = setTimeout(() => {
        setFormStatus('idle');
      }, 10000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [formStatus]);

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
          className="w-full md:w-1/2 bg-white dark:bg-[#2a2342] p-8 rounded-2xl shadow-xl min-h-[480px] flex flex-col justify-center"
        >
          {formStatus === 'success' ? (
            <div className="text-center">
              <img
                src="/images/email_sent_feedback.gif"
                alt="Email elküldve"
                className="mx-auto mb-4 object-contain"
              />
              <h3 className="text-2xl font-semibold text-green-500 dark:text-green-400">
                Sikeresen elküldve!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Köszönjük üzenetét. Hamarosan felvesszük Önnel a kapcsolatot.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('contact.title')}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{t('contact.subtitle')}</p>
              {formStatus === 'error' && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-100 rounded-lg">
                  <p className="font-bold">Hiba történt!</p>
                  <p>{errorMessage}</p>
                </div>
              )}
              <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
                <div>
                  <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('contact.name')}</label>
                  <input
                    type="text"
                    name="user_name"
                    id="user_name"
                    required
                    disabled={formStatus === 'sending'}
                    className="mt-1 w-full p-3 bg-gray-100 dark:bg-[#3a2f60] text-gray-800 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-[#915EFF] disabled:opacity-60 dark:disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('contact.email')}</label>
                  <input
                    type="email"
                    name="user_email"
                    id="user_email"
                    required
                    disabled={formStatus === 'sending'}
                    className="mt-1 w-full p-3 bg-gray-100 dark:bg-[#3a2f60] text-gray-800 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-[#915EFF] disabled:opacity-60 dark:disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('contact.message')}</label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    required
                    disabled={formStatus === 'sending'}
                    className="mt-1 w-full p-3 bg-gray-100 dark:bg-[#3a2f60] text-gray-800 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-[#915EFF] disabled:opacity-60 dark:disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full bg-[#915EFF] text-white py-3 rounded-lg hover:bg-purple-600 transition-colors duration-150 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {formStatus === 'sending' ? 'Küldés...' : t('contact.send')}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const WrappedContact = SectionWrapper(Contact, "contact");
export default WrappedContact;