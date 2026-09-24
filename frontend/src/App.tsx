import { BrowserRouter, Route, Routes } from "react-router-dom";

import CareerAssistant from "./components/CareerAssistant";

import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Parsing from "./pages/Parsing";
import Skills from "./pages/Skills";
import RoleSelect from "./pages/RoleSelect";
import Matching from "./pages/Matching";
import Alignment from "./pages/Alignment";
import Gaps from "./pages/Gaps";
import Roadmap from "./pages/Roadmap";
import Projects from "./pages/Projects";
import Track from "./pages/Track";
import Demo from "./pages/Demo";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/parsing" element={<Parsing />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/role-select" element={<RoleSelect />} />
        <Route path="/matching" element={<Matching />} />
        <Route path="/alignment" element={<Alignment />} />
        <Route path="/gaps" element={<Gaps />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/track" element={<Track />} />
        <Route path="/demo" element={<Demo />} />
      </Routes>

      <CareerAssistant />
    </BrowserRouter>
  );
}