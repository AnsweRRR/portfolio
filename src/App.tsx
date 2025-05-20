import { BrowserRouter } from "react-router-dom";
import Hero from "./components/Hero";
import Tech from "./components/Tech";
import Work from "./components/Work";
import About from "./components/About";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import StarsCanvas from "./components/canvas/Stars";

function App() {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          {/* <Navbar /> */}
          <Hero />
        </div>
        <About />
        <Experience />
        <Tech />
        <Work />
        {/* <Feedbacks /> */}
        <div className='relative z-0'>
          <Contact />
          <StarsCanvas />
          <Footer />
        </div>
        
      </div>
    </BrowserRouter>
  )
}

export default App;