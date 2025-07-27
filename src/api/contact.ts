import { IconType } from "react-icons";
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaWhatsapp,
  FaInstagram
} from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

export interface ContactLink {
  href: string;
  title: string;
  icon: IconType;
}

export const contactLinks: ContactLink[] = [
  {
    href: "mailto:mail@pogranyitamas.com",
    title: "Email",
    icon: MdEmail,
  },
  {
    href: "tel:+36204963272",
    title: "Phone",
    icon: MdPhone,
  },
  {
    href: "https://wa.me/+36204963272",
    title: "WhatsApp",
    icon: FaWhatsapp,
  },
  {
    href: "https://www.linkedin.com/in/pogranyitamas/",
    title: "LinkedIn",
    icon: FaLinkedin,
  },
  {
    href: "https://www.facebook.com/pogranyitamas99/",
    title: "Facebook",
    icon: FaFacebook,
  },
  {
    href: "https://www.instagram.com/tamas.pogranyi/",
    title: "Instagram",
    icon: FaInstagram,
  },
  {
    href: "https://github.com/AnsweRRR",
    title: "GitHub",
    icon: FaGithub,
  },
]; 