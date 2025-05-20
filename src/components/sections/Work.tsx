import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import SectionWrapper from "../../hoc/SectionWrapper";

const projects = [
  {
    title: "ShoutOut",
    description: "Egy egyszerű feladatkezelő alkalmazás, ahol a felhasználók létrehozhatják, módosíthatják és törölhetik a feladataikat.",
    image: "/images/projects/TODO.png",
    github: "https://github.com/AnsweRRR/shout-out-api",
    live: "https://github.com/AnsweRRR/shout-out-api",
    tags: ["React", "Material UI", "TypeScript", ".NET", "SignalR"]
  },
  {
    title: "Időjárás App",
    description: "Egy alkalmazás, amivel valós idejű időjárás adatokat lehet lekérdezni városok szerint.",
    image: "/images/projects/TODO.png",
    github: "https://github.com/felhasznalo/weather-app",
    live: "https://weather-app.vercel.app",
    tags: ["Next.js", "OpenWeather API", "Tailwind"]
  }
];

const Work = () => {
  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Projects</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
          >
            <div className="relative w-full h-48">
              <img
                src={project.image}
                alt={project.title}
                className="rounded-t-2xl"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between p-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {project.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-end gap-4 text-lg text-gray-600">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black"
                >
                  <FaGithub />
                </a>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black"
                >
                  <FiExternalLink />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WrappedWork = SectionWrapper(Work, "work");
export default WrappedWork;