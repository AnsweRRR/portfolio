import { BrowserRouter } from "react-router-dom";

import Hero from './components/Hero'

function App() {

  return (
    <>
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    </>
  )
}

export default App;