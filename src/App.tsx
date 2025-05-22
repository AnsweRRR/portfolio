import { BrowserRouter } from "react-router-dom";
import StarsCanvas from "./components/canvas/Stars";
import { Navbar, About, Contact, Experience, Footer, Hero, Tech, Work, Feedbacks } from "./components/sections";
import './i18n/i18n';

function App() {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Hero />
        </div>
        <About />
        <Experience />
        <Tech />
        <Work />
        <div className='relative z-0'>
          <Feedbacks />
          <Contact />
          <StarsCanvas />
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;