import { BrowserRouter } from "react-router-dom";
import StarsCanvas from "./components/canvas/Stars";
import { About, Contact, Experience, Footer, Hero, Tech, Work } from "./components/sections";

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