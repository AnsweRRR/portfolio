import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useBlogAvailability } from "../hooks/useBlogAvailability";

// Guards /blog and /blog/:slug: redirects home once we're sure the blog is
// unavailable (flag off, or the CMS health check failed). While the check is
// still in flight, renders nothing rather than redirecting — otherwise a
// direct link to /blog would bounce visitors home before the check settles.
const BlogRoute = ({ children }: { children: ReactNode }) => {
  const availability = useBlogAvailability();

  if (availability === "checking") return null;
  if (availability === "unavailable") return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default BlogRoute;
