import { BrowserRouter } from "react-router-dom";
import StarsCanvas from "./components/canvas/Stars";
import { Navbar, About, Contact, Experience, Footer, Hero, Tech, Work, Feedbacks } from "./components/sections";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./context/ThemeContext";
import './i18n/i18n';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className='relative z-0 bg-primary dark:bg-primary bg-primary-light'>
          <div className='bg-hero-pattern dark:bg-hero-pattern bg-hero-pattern-light bg-cover bg-no-repeat bg-center'>
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
          <ScrollToTop />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;