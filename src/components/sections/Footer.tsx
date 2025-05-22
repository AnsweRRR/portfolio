import { useTranslation } from "react-i18next";
import { contactLinks } from "../../api/contact";

export default function Footer() {
  const { t } = useTranslation();
  const FULL_NAME = "Tamás Pogrányi";

  return (
    <footer className="text-gray-100 py-4">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="text-center sm:text-left">
        </div>

        <div className="flex gap-6 text-gray-300">
          {contactLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="hover:text-white"
              title={link.title}
            >
              <link.icon size={24} />
            </a>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-4">
        © {new Date().getFullYear()} {FULL_NAME}. {t('footer.rights')}
      </div>
    </footer>
  );
}