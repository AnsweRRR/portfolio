import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from 'emailjs-com';
import { motion } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import BusinessCard from '../canvas/BusinessCard';
import SectionWrapper from '../../hoc/SectionWrapper';
import { FiSend } from 'react-icons/fi';
// import Raspberry from '../canvas/Raspberry';

const Contact = () => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current || !captchaValue) {
      setErrorMessage(t('contact.captchaError'));
      setFormStatus('error');
      return;
    }

    setFormStatus('sending');
    setErrorMessage('');

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      
      setFormStatus('success');
      formRef.current?.reset();
      recaptchaRef.current?.reset();
      setCaptchaValue(null);
    } catch (error: unknown) {
      console.error("EmailJS error:", error);
      const errorMessage = error instanceof Error ? error.message : t('contact.genericError');
      setErrorMessage(errorMessage);
      setFormStatus('error');
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
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
    <div className="w-full py-20 px-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 aspect-square relative">
          {/* <Raspberry /> */}
          <BusinessCard />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 bg-white dark:bg-[#2a2342] p-8 rounded-2xl shadow-xl min-h-[480px] flex flex-col justify-center"
        >
          {formStatus === 'success' ? (
            <div className="text-center">
              <img
                src="/images/email_sent_feedback.gif"
                alt={t('contact.emailSentAlt')}
                className="mx-auto mb-4 object-contain"
              />
              <h3 className="text-2xl font-semibold text-green-500 dark:text-green-400">
                {t('contact.successTitle')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {t('contact.successMessage')}
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('contact.title')}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{t('contact.subtitle')}</p>
              {formStatus === 'error' && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-100 rounded-lg">
                  <p className="font-bold">{t('contact.errorTitle')}</p>
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
                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={handleCaptchaChange}
                    theme="dark"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus === 'sending' || !captchaValue}
                  className="w-full bg-[#915EFF] text-white py-3 rounded-lg hover:bg-purple-600 transition-colors duration-150 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {formStatus === 'sending' ? (
                    t('contact.sending')
                  ) : (
                    <>
                      <FiSend className="mr-2 h-4 w-4" />
                      {t('contact.send')}
                    </>
                  )}
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