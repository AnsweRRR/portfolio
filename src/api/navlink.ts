export interface NavLink {
  id: string;
  title: string;
  route?: string;
}

export const navLinks: NavLink[] = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "experience",
    title: "Experience",
  },
  {
    id: "tech",
    title: "Tech",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "testimonials",
    title: "Testimonials",
  },
  {
    id: "blog",
    title: "Blog",
  },
  {
    id: "contact",
    title: "Contact",
  },
];