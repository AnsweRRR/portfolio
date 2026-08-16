import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from "./components/sections";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";
import './i18n/i18n';

// Module-level, not created inside App() — a client recreated on every render
// would drop all cached queries and force every useQuery back into a loading
// state, which is exactly what intermittently made the blog section look like
// it "didn't load" (any re-render of App, e.g. via Vite HMR, reset it).
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/blog' element={<BlogListPage />} />
            <Route path='/blog/:slug' element={<BlogPostPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App;
