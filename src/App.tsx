import { BrowserRouter } from "react-router-dom";
import Hero from "./components/Hero";
import Tech from "./components/Tech";
import Work from "./components/Work";

function App() {
  return (
    <BrowserRouter>
      <div className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          {/* <Navbar /> */}
          <Hero />
        </div>
        {/* <About /> */}
        {/* <Experience /> */}
        <Tech />
        <Work />
        {/* <Feedbacks /> */}
        {/* <div className='relative z-0'>
          <Contact />
          <StarsCanvas />
        </div> */}
      </div>
    </BrowserRouter>
  )
}

export default App;