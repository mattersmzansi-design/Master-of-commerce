import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Crypto from "./pages/Crypto";
import News from "./pages/News";
import Betting from "./pages/Betting";
import Calendar from "./pages/Calendar";
import NYSE from "./pages/NYSE";
import ComingSoon from "./pages/ComingSoon";
import { fetchSubstackPosts } from "./lib/substack.js";
import { addToIndex } from "./lib/searchIndex.js";

export default function App() {
  // Pull Substack posts into the global search index once, on app boot.
  useEffect(() => {
    fetchSubstackPosts().then(posts => {
      addToIndex(posts.map(p => ({
        title:    p.title,
        subtitle: `Substack · ${p.author || "Ntokozo Cele"} · ${new Date(p.date).toLocaleDateString("en-ZA",{day:"numeric",month:"short"})}`,
        path:     p.link,       // external Substack URL — the search handler treats http(s) links as new-tab
        kind:     "Substack",
      })));
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crypto" element={<Crypto />} />
        <Route path="/news" element={<News />} />
        <Route path="/betting" element={<Betting />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/nyse" element={<NYSE />} />
        <Route path="/jse" element={
          <ComingSoon title="JSE Stocks" blurb="Live Johannesburg Stock Exchange data is coming soon." />
        } />
        <Route path="*" element={
          <ComingSoon title="Page not found" blurb="That page doesn't exist yet." />
        } />
      </Routes>
    </BrowserRouter>
  );
}
