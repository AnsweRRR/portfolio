import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import StarsCanvas from "../components/canvas/Stars";
import { About, BlogSection, Contact, Experience, Footer, Hero, Tech, Work, Feedbacks } from "../components/sections";
import ScrollToTop from "../components/ScrollToTop";
import WeatherWidget from "../components/WeatherWidget";
import { useBlogAvailability } from "../hooks/useBlogAvailability";

const HomePage = () => {
  const location = useLocation();
  const blogAvailability = useBlogAvailability();

  useEffect(() => {
    if (!location.hash) return;
    document.querySelector(location.hash)?.scrollIntoView();
  }, [location.hash]);

  return (
    <div className='relative z-0 bg-primary'>
      <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
        {/* <MacOSMenuBar /> */}
        <Hero />
      </div>
      <About />
      <Experience />
      <Tech />
      <Work />
      {blogAvailability === "available" && <BlogSection />}
      <div className='relative z-0'>
        <Feedbacks />
        <Contact />
        <StarsCanvas />
        <Footer />
      </div>
      <ScrollToTop />
      <WeatherWidget />
    </div>
  );
};

export default HomePage;
