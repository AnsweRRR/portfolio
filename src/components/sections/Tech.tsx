import { motion } from "framer-motion";
import SectionWrapper from "../../hoc/SectionWrapper";
import { fadeIn } from "../../utils/motion";

const skills = [
  {
    name: "HTML",
    level: 90,
    tags: ["ES6+", "Async", "DOM"],
    image: "/images/skills/html.svg",
  },
  {
    name: "CSS",
    level: 90,
    tags: ["ES6+", "Async", "DOM"],
    image: "/images/skills/css.svg",
  },
  {
    name: "JavaScript",
    level: 90,
    tags: ["ES6+", "Async", "DOM"],
    image: "/images/skills/javascript.svg",
  },
  {
    name: "TypeScript",
    level: 85,
    tags: ["OOP", "Type Safety", "Front-end"],
    image: "/images/skills/typescript.svg",
  },
  {
    name: "C# (.NET)",
    level: 75,
    tags: ["Utility-first", "Responsive", "Fast UI"],
    image: "/images/skills/csharp.svg",
  },
  {
    name: "NodeJS",
    level: 80,
    tags: ["Hooks", "SPA", "Components"],
    image: "/images/skills/nodejs.svg",
  },
  {
    name: "React",
    level: 80,
    tags: ["Hooks", "SPA", "Components"],
    image: "/images/skills/react.svg",
  },
  {
    name: "React Native",
    level: 80,
    tags: ["Hooks", "SPA", "Components"],
    image: "/images/skills/react-native.svg",
  },
  {
    name: "Electron",
    level: 80,
    tags: ["Hooks", "SPA", "Components"],
    image: "/images/skills/electron.svg",
  },
  {
    name: "PostgreSQL",
    level: 80,
    tags: ["Hooks", "SPA", "Components"],
    image: "/images/skills/postgresql.svg",
  },
  {
    name: "MS SQL Server",
    level: 80,
    tags: ["Hooks", "SPA", "Components"],
    image: "/images/skills/ms-sql-server.svg",
  },
  {
    name: "MongoDB",
    level: 80,
    tags: ["Hooks", "SPA", "Components"],
    image: "/images/skills/mongodb.svg",
  },
  {
    name: "Firebase",
    level: 80,
    tags: ["Hooks", "SPA", "Components"],
    image: "/images/skills/firebase.svg",
  },
];

interface TechCardProps {
  index: number;
  skill: {
    name: string;
    level: number;
    tags: string[];
    image: string;
  };
}

const TechCard = ({index, skill}: TechCardProps) => {
  return (
    <motion.div
      variants={fadeIn("right", "spring", index * 0.2, 0.2)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div
        key={skill.name}
        className="rounded-2xl shadow-md p-5 flex items-center gap-4 transition-transform transform hover:scale-105 hover:shadow-xl duration-300 bg-white dark:bg-gray-800"
      >
        <img
          src={skill.image}
          alt={skill.name}
          className="w-16 h-16 object-contain"
        />
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <h3 className="text-xl font-semibold">{skill.name}</h3>
            <span className="text-sm text-gray-500">{skill.level}%</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full mb-2">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${skill.level}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 flex flex-wrap gap-2">
            {skill.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 px-2 py-0.5 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Tech = () => {
  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-8">Skills</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4">
        {skills.map((skill, index) => (
          <TechCard key={`skill-${index}`} skill={skill} index={index} />
        ))}
      </div>
    </>
  );
};

const WrappedTech = SectionWrapper(Tech, "tech");
export default WrappedTech;