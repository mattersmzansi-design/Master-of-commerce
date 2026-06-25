import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Crypto from "./pages/Crypto";
import News from "./pages/News";
import Betting from "./pages/Betting";
import Calendar from "./pages/Calendar";
import NYSE from "./pages/NYSE";
import ComingSoon from "./pages/ComingSoon";

export default function App() {
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
          <ComingSoon title="JSE Stocks" blurb="Live Johannesburg Stock Exchange data coming soon — contact Profile Data (profiledata.co.za) or Trading Economics for a data feed, then we wire it straight in." />
        } />
        <Route path="*" element={
          <ComingSoon title="Page not found" blurb="That page doesn't exist yet." />
        } />
      </Routes>
    </BrowserRouter>
  );
}
