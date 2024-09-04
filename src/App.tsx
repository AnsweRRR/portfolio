import { BrowserRouter } from "react-router-dom";
import Hero from './components/Hero'
import ThemeProvider from "./components/theme";
import { Box, styled } from "@mui/material";

const AppContainer = styled(Box)(({ theme }) => ({
	position: 'relative',
  zIndex: 0,
  // TODO: backgroundColor: theme.palette.primary.main
  backgroundColor: '#050816'
})) as typeof Box;

const HeroContainer = styled(Box)(() => ({
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
})) as typeof Box;

function App() {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider>
          <AppContainer>
            <HeroContainer>
              <Hero />
            </HeroContainer>
          </AppContainer>
          
        </ThemeProvider>
      </BrowserRouter>
    </>
  )
}

export default App;