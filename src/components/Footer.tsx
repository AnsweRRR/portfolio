import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

const contactLinks = [
  {
    href: "mailto:pogranyitamas99@gmail.com",
    title: "Email",
    icon: <MdEmail size={24} />,
  },
  {
    href: "tel:+36204963272",
    title: "Phone",
    icon: <MdPhone size={24} />,
  },
  {
    href: "https://github.com/AnsweRRR",
    title: "GitHub",
    icon: <FaGithub size={24} />,
  },
  {
    href: "https://www.linkedin.com/in/tam%C3%A1s-pogr%C3%A1nyi-a682941ba/",
    title: "LinkedIn",
    icon: <FaLinkedin size={24} />,
  },
  {
    href: "https://www.facebook.com/pogranyitamas99/",
    title: "Facebook",
    icon: <FaFacebook size={24} />,
  },
];

export default function Footer() {
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
              {link.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-4">
        © {new Date().getFullYear()} {FULL_NAME}. All rights reserved.
      </div>
    </footer>
  );
}