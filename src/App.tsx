import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StarsCanvas from "./components/canvas/Stars";
import { Navbar, About, Contact, Experience, Footer, Hero, Tech, Work, Feedbacks } from "./components/sections";
import ScrollToTop from "./components/ScrollToTop";
import WeatherWidget from "./components/WeatherWidget";
import { ThemeProvider } from "./context/ThemeContext";
import './i18n/i18n';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <div className='relative z-0 dark:bg-primary bg-primary-light'>
            <div className='dark:bg-hero-pattern bg-hero-pattern-light bg-cover bg-no-repeat bg-center'>
              <Navbar />
              {/* <MacOSMenuBar /> */}
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
            <WeatherWidget />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App;