import {ReactElement} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Home} from "./pages/Home.tsx";
import {About} from "./pages/About.tsx";
import {Socials} from "./pages/Socials.tsx";

/**
 * App Component
 * Root application component that renders the entire site.
 *
 * @returns {ReactElement}
 */
export function App(): ReactElement {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element = {<About />} />
              <Route path="/socials" element = {<Socials />} />
          </Routes>
      </Router>

  );
}
