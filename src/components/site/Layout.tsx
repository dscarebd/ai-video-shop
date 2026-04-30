import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [pathname]);
  useEffect(() => {
    const seg = pathname.split("/")[1] || "home";
    document.body.setAttribute("data-route", seg);
    return () => { document.body.removeAttribute("data-route"); };
  }, [pathname]);
  return (
    <div className="min-h-screen flex flex-col text-foreground relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}